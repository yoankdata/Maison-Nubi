import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase-server';
import Stripe from 'stripe';

/**
 * POST /api/webhooks/stripe
 * Gère les événements envoyés par Stripe
 * IMPORTANT: Cette route ne doit PAS être protégée par auth
 */
export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
        console.error('Webhook Stripe: Signature manquante');
        return NextResponse.json({ error: 'Signature manquante' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error('Erreur validation webhook Stripe:', err.message);
        return NextResponse.json(
            { error: `Webhook error: ${err.message}` },
            { status: 400 }
        );
    }

    console.log(`[Stripe Webhook] Événement reçu: ${event.type}`);

    const supabase = await createClient();
    if (!supabase) {
        console.error('Webhook Stripe: Supabase non configuré');
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }

    try {
        // Gérer les différents types d'événements
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session, supabase);
                break;

            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                await handleSubscriptionUpdate(event.data.object as Stripe.Subscription, supabase);
                break;

            case 'customer.subscription.deleted':
                await handleSubscriptionCanceled(event.data.object as Stripe.Subscription, supabase);
                break;

            case 'invoice.payment_succeeded':
                await handlePaymentSucceeded(event.data.object as Stripe.Invoice, supabase);
                break;

            case 'invoice.payment_failed':
                await handlePaymentFailed(event.data.object as Stripe.Invoice, supabase);
                break;

            default:
                console.log(`[Stripe Webhook] Événement non géré: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error(`[Stripe Webhook] Erreur traitement ${event.type}:`, error);
        return NextResponse.json(
            { error: 'Erreur traitement webhook' },
            { status: 500 }
        );
    }
}

/**
 * Gérer la fin du paiement Checkout
 * Supporte les abonnements ET les boosts
 */
async function handleCheckoutComplete(session: Stripe.Checkout.Session, supabase: any) {
    const profileId = session.metadata?.profile_id;
    const planType = session.metadata?.plan_type;
    const productType = session.metadata?.product_type;

    if (!profileId) {
        console.error('[Checkout Complete] profile_id manquant dans metadata');
        return;
    }

    console.log(`[Checkout Complete] Profile: ${profileId}, Plan: ${planType}, Product: ${productType}`);

    // === GESTION DU BOOST 7 JOURS ===
    if (productType === 'boost_7_days' || planType === 'boost') {
        await handleBoostPurchase(session, profileId, supabase);
        return;
    }

    // === GESTION ABONNEMENT CLASSIQUE ===
    const subscriptionId = session.subscription as string;
    if (!subscriptionId) {
        console.error('[Checkout Complete] subscription_id manquant');
        return;
    }

    // Cast explicite car stripe.subscriptions.retrieve() retourne Response<Subscription>
    const subscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription;

    // Activer le statut premium
    const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_premium: true })
        .eq('id', profileId);

    if (profileError) {
        console.error('[Checkout Complete] Erreur activation premium:', profileError);
        throw profileError;
    }

    // Créer l'enregistrement subscription
    const { error: subError } = await supabase
        .from('subscriptions')
        .insert({
            profile_id: profileId,
            stripe_customer_id: subscription.customer as string,
            stripe_subscription_id: subscription.id,
            stripe_price_id: subscription.items.data[0].price.id,
            status: subscription.status,
            plan_type: planType || 'monthly',
            amount: subscription.items.data[0].price.unit_amount! / 100, // Convertir de centimes
            currency: subscription.items.data[0].price.currency.toUpperCase(),
            // Note: depuis API 2025-03-31, current_period est sur SubscriptionItem
            current_period_start: new Date((subscription.items.data[0] as any).current_period_start * 1000).toISOString(),
            current_period_end: new Date((subscription.items.data[0] as any).current_period_end * 1000).toISOString(),
        });

    if (subError) {
        console.error('[Checkout Complete] Erreur création subscription:', subError);
        throw subError;
    }

    console.log(`[Checkout Complete] ✅ Premium activé pour ${profileId}`);
}

/**
 * Gérer l'achat d'un boost 7 jours
 */
async function handleBoostPurchase(session: Stripe.Checkout.Session, profileId: string, supabase: any) {
    console.log(`[Boost Purchase] Activation boost pour profile: ${profileId}`);

    // Récupérer le profil actuel pour vérifier si un boost est déjà actif
    const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('premium_boost_end_at')
        .eq('id', profileId)
        .single();

    if (fetchError) {
        console.error('[Boost Purchase] Erreur récupération profil:', fetchError);
        throw fetchError;
    }

    // Calculer la nouvelle date de fin
    // Si boost actif : on ajoute 7 jours à la date existante
    // Sinon : on part de maintenant + 7 jours
    let newBoostEndDate: Date;
    const now = new Date();

    if (profile?.premium_boost_end_at) {
        const existingEndDate = new Date(profile.premium_boost_end_at);
        if (existingEndDate > now) {
            // Boost actif : extension de 7 jours
            newBoostEndDate = new Date(existingEndDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            console.log(`[Boost Purchase] Extension boost - nouvelle fin: ${newBoostEndDate.toISOString()}`);
        } else {
            // Boost expiré : nouveau boost de 7 jours
            newBoostEndDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        }
    } else {
        // Aucun boost précédent : 7 jours à partir de maintenant
        newBoostEndDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }

    // Mettre à jour le profil avec les dates de boost
    const { error: updateError } = await supabase
        .from('profiles')
        .update({
            premium_boost_end_at: newBoostEndDate.toISOString(),
            premium_boost_activated_at: now.toISOString(),
        })
        .eq('id', profileId);

    if (updateError) {
        console.error('[Boost Purchase] Erreur mise à jour profil:', updateError);
        throw updateError;
    }

    // Enregistrer dans la table boost_purchases
    const { error: purchaseError } = await supabase
        .from('boost_purchases')
        .insert({
            profile_id: profileId,
            provider: 'stripe',
            amount: session.amount_total ? session.amount_total / 100 : 5000, // Convertir centimes → FCFA
            status: 'completed',
            stripe_payment_intent_id: session.payment_intent as string,
            activated_at: now.toISOString(),
            expires_at: newBoostEndDate.toISOString(),
        });

    if (purchaseError) {
        console.error('[Boost Purchase] Erreur enregistrement boost_purchases:', purchaseError);
        // On ne throw pas ici car le boost est déjà activé
    }

    // Enregistrer dans payment_history
    const { error: historyError } = await supabase
        .from('payment_history')
        .insert({
            profile_id: profileId,
            provider: 'stripe',
            stripe_payment_intent_id: session.payment_intent as string,
            amount: session.amount_total ? session.amount_total / 100 : 5000,
            currency: 'XOF',
            plan_type: 'boost',
            status: 'succeeded',
            description: 'Boost Gold 7 Jours',
            receipt_url: session.url,
        });

    if (historyError) {
        console.error('[Boost Purchase] Erreur enregistrement payment_history:', historyError);
    }

    console.log(`[Boost Purchase] ✅ Boost activé pour ${profileId} jusqu'au ${newBoostEndDate.toLocaleDateString('fr-FR')}`);
}

/**
 * Gérer la mise à jour d'un abonnement
 */
async function handleSubscriptionUpdate(subscription: Stripe.Subscription, supabase: any) {
    const customerId = subscription.customer as string;

    console.log(`[Subscription Update] Customer: ${customerId}, Status: ${subscription.status}`);

    // Trouver le profil via customer_id
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

    if (!profile) {
        console.error('[Subscription Update] Profil non trouvé pour customer:', customerId);
        return;
    }

    // Mettre à jour l'abonnement
    const { error } = await supabase
        .from('subscriptions')
        .update({
            status: subscription.status,
            stripe_price_id: subscription.items.data[0].price.id,
            amount: subscription.items.data[0].price.unit_amount! / 100,
            // Note: depuis API 2025-03-31, current_period est sur SubscriptionItem
            current_period_start: new Date((subscription.items.data[0] as any).current_period_start * 1000).toISOString(),
            current_period_end: new Date((subscription.items.data[0] as any).current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
        })
        .eq('stripe_subscription_id', subscription.id);

    if (error) {
        console.error('[Subscription Update] Erreur mise à jour:', error);
        throw error;
    }

    // Si l'abonnement est actif, s'assurer que is_premium est true
    if (subscription.status === 'active') {
        await supabase
            .from('profiles')
            .update({ is_premium: true })
            .eq('id', profile.id);
    }

    console.log(`[Subscription Update] ✅ Abonnement mis à jour pour ${profile.id}`);
}

/**
 * Gérer l'annulation d'un abonnement
 */
async function handleSubscriptionCanceled(subscription: Stripe.Subscription, supabase: any) {
    const customerId = subscription.customer as string;

    console.log(`[Subscription Canceled] Customer: ${customerId}`);

    // Trouver le profil
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

    if (!profile) {
        console.error('[Subscription Canceled] Profil non trouvé');
        return;
    }

    // Désactiver le premium
    await supabase
        .from('profiles')
        .update({ is_premium: false })
        .eq('id', profile.id);

    // Marquer l'abonnement comme annulé
    await supabase
        .from('subscriptions')
        .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id);

    console.log(`[Subscription Canceled] ✅ Premium désactivé pour ${profile.id}`);
}

/**
 * Gérer un paiement réussi
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
    // Cast en any car les types Stripe v20 ne correspondent pas exactement à l'API réelle
    const invoiceData = invoice as any;
    const customerId = typeof invoiceData.customer === 'string'
        ? invoiceData.customer
        : invoiceData.customer?.id || '';
    const subscriptionId = typeof invoiceData.subscription === 'string'
        ? invoiceData.subscription
        : invoiceData.subscription?.id || null;

    console.log(`[Payment Succeeded] Customer: ${customerId}, Amount: ${invoice.amount_paid / 100}`);

    // Trouver le profil
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

    if (!profile) {
        console.error('[Payment Succeeded] Profil non trouvé');
        return;
    }

    // Récupérer l'abonnement pour avoir le plan type
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan_type')
        .eq('stripe_subscription_id', subscriptionId)
        .single();

    // Enregistrer dans l'historique
    await supabase
        .from('payment_history')
        .insert({
            profile_id: profile.id,
            provider: 'stripe',
            stripe_payment_intent_id: typeof invoiceData.payment_intent === 'string'
                ? invoiceData.payment_intent
                : invoiceData.payment_intent?.id || null,
            stripe_invoice_id: invoice.id,
            amount: invoice.amount_paid / 100,
            currency: invoice.currency.toUpperCase(),
            plan_type: subscription?.plan_type || 'monthly',
            status: 'succeeded',
            description: `Paiement NUBI GOLD ${subscription?.plan_type === 'annual' ? 'Annuel' : 'Mensuel'}`,
            receipt_url: invoice.hosted_invoice_url,
        });

    console.log(`[Payment Succeeded] ✅ Paiement enregistré pour ${profile.id}`);
}

/**
 * Gérer un échec de paiement
 */
async function handlePaymentFailed(invoice: Stripe.Invoice, supabase: any) {
    const customerId = invoice.customer as string;

    console.log(`[Payment Failed] Customer: ${customerId}`);

    // Trouver le profil
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('stripe_customer_id', customerId)
        .single();

    if (!profile) {
        console.error('[Payment Failed] Profil non trouvé');
        return;
    }

    // Enregistrer l'échec
    await supabase
        .from('payment_history')
        .insert({
            profile_id: profile.id,
            provider: 'stripe',
            stripe_invoice_id: invoice.id,
            amount: invoice.amount_due / 100,
            currency: invoice.currency.toUpperCase(),
            plan_type: 'monthly', // Par défaut
            status: 'failed',
            description: 'Échec de paiement',
        });

    // TODO: Envoyer un email de notification
    console.log(`[Payment Failed] ⚠️ Échec enregistré pour ${profile.id}`);
}
