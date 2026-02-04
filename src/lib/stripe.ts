import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY manquante dans les variables d\'environnement');
}

/**
 * Client Stripe côté serveur
 * Utilisé dans les API routes et server actions
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-12-15.clover',
    typescript: true,
});

/**
 * IDs des prix Stripe
 * À récupérer depuis le Stripe Dashboard après création des produits
 */
export const STRIPE_PRICES = {
    monthly: process.env.STRIPE_PRICE_ID_MONTHLY || '', // price_xxxxx
    annual: process.env.STRIPE_PRICE_ID_ANNUAL || '',   // price_xxxxx
    boost: process.env.STRIPE_BOOST_PRICE_ID || '',     // price_xxxxx pour boost 7 jours
} as const;

/**
 * Configuration des montants (en FCFA)
 */
export const PRICING = {
    monthly: {
        amount: 10000,
        currency: 'XOF',
        label: 'Mensuel',
    },
    annual: {
        amount: 100000,
        currency: 'XOF',
        label: 'Annuel',
        savings: 20000, // Économie par rapport au mensuel (2 mois offerts)
    },
    boost: {
        amount: 5000,
        currency: 'XOF',
        label: 'Boost 7 Jours',
        duration_days: 7,
    },
} as const;
