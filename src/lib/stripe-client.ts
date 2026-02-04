import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

/**
 * Client Stripe côté navigateur
 * Lazy loading pour optimiser les performances
 */
export const getStripe = () => {
    if (!stripePromise) {
        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

        if (!publishableKey) {
            console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY manquante');
            return null;
        }

        stripePromise = loadStripe(publishableKey);
    }

    return stripePromise;
};
