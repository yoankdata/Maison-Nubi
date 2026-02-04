import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_PRICES } from '@/lib/stripe';
import { createClient } from '@/lib/supabase-server';
import { isPremiumActive } from '@/lib/premium';
import type { Database } from '@/lib/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Schéma de validation pour la requête
const checkoutRequestSchema = z.object({
    planType: z.enum(['monthly', 'annual', 'boost'], {
        message: 'Type de plan invalide. Valeurs acceptées: monthly, annual, boost'
    }),
});

/**
 * POST /api/stripe/create-checkout-session
 * Crée une session Stripe Checkout pour un abonnement OU un boost
 */
export async function POST(request: NextRequest) {
    try {
        const supabase: SupabaseClient<Database> = await createClient();

        // Vérifier l'authentification
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        // Type local pour les données du profil récupérées
        type ProfileData = {
            id: string;
            email: string;
            full_name: string;
            stripe_customer_id: string | null;
            is_premium: boolean;
            premium_boost_end_at: string | null;
        };

        // Récupérer le profil avec les champs boost
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, email, full_name, stripe_customer_id, is_premium, premium_boost_end_at')
            .eq('id', user.id)
            .single();

        if (profileError || !profileData) {
            return NextResponse.json(
                { error: 'Profil non trouvé' },
                { status: 404 }
            );
        }

        // Typage explicite après validation avec assertion de type
        const profile = profileData as ProfileData;

        // Validation du payload avec Zod
        const body = await request.json();
        const validationResult = checkoutRequestSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.issues[0]?.message || 'Type de plan invalide' },
                { status: 400 }
            );
        }

        const { planType } = validationResult.data;

        // === GESTION DU BOOST ===
        if (planType === 'boost') {
            // Vérifier si déjà abonné Gold (bloque l'achat de boost)
            if (profile.is_premium) {
                return NextResponse.json(
                    { error: 'Vous êtes déjà membre NUBI GOLD ! Le boost n\'est pas nécessaire.' },
                    { status: 400 }
                );
            }

            const boostPriceId = STRIPE_PRICES.boost;
            if (!boostPriceId) {
                return NextResponse.json(
                    { error: 'Prix du boost non configuré' },
                    { status: 500 }
                );
            }

            // Créer ou récupérer le client Stripe
            let customerId = profile.stripe_customer_id;

            if (!customerId) {
                const customer = await stripe.customers.create({
                    email: profile.email,
                    name: profile.full_name,
                    metadata: {
                        profile_id: profile.id,
                    },
                });
                customerId = customer.id;

                await supabase
                    .from('profiles')
                    // @ts-ignore - Supabase type inference issue
                    .update({ stripe_customer_id: customerId })
                    .eq('id', profile.id);
            }

            // Créer session pour le boost (paiement unique)
            const session = await stripe.checkout.sessions.create({
                customer: customerId,
                mode: 'payment', // Paiement unique, pas subscription
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: boostPriceId,
                        quantity: 1,
                    },
                ],
                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/espace-pro?boost=success&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/espace-pro/services-premium?canceled=true`,
                metadata: {
                    profile_id: profile.id,
                    plan_type: 'boost',
                    product_type: 'boost_7_days', // Clé pour identifier dans le webhook
                },
                allow_promotion_codes: true,
            });

            return NextResponse.json({ sessionId: session.id, url: session.url });
        }

        // === GESTION ABONNEMENT CLASSIQUE (monthly/annual) ===

        // Vérifier si déjà premium
        if (profile.is_premium) {
            return NextResponse.json(
                { error: 'Vous êtes déjà membre NUBI GOLD' },
                { status: 400 }
            );
        }

        // Vérifier que les price IDs sont configurés
        const priceId = STRIPE_PRICES[planType as 'monthly' | 'annual'];
        if (!priceId) {
            return NextResponse.json(
                { error: `Price ID pour le plan ${planType} non configuré` },
                { status: 500 }
            );
        }

        // Créer ou récupérer le client Stripe
        let customerId = profile.stripe_customer_id;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: profile.email,
                name: profile.full_name,
                metadata: {
                    profile_id: profile.id,
                },
            });
            customerId = customer.id;

            // Sauvegarder le customer ID dans le profil
            await supabase
                .from('profiles')
                // @ts-ignore - Supabase type inference issue
                .update({ stripe_customer_id: customerId })
                .eq('id', profile.id);
        }

        // Créer la session Stripe Checkout
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/espace-pro/abonnement?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/espace-pro/abonnement?canceled=true`,
            metadata: {
                profile_id: profile.id,
                plan_type: planType,
            },
            allow_promotion_codes: true, // Permettre les codes promo
            billing_address_collection: 'auto',
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
        console.error('Erreur création session Stripe:', error);

        // En production, masquer les détails techniques
        const errorMessage = process.env.NODE_ENV === 'production'
            ? 'Une erreur est survenue lors de la création de la session'
            : error.message || 'Erreur lors de la création de la session';

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
