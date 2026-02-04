import { Resend } from 'resend';

/**
 * Client Resend pour l'envoi d'emails transactionnels
 * Nécessite RESEND_API_KEY dans .env.local
 */
export const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

// Email d'expédition par défaut
export const FROM_EMAIL = 'Maison Nubi <onboarding@resend.dev>'; // Remplacer par votre domaine une fois vérifié
