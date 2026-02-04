/**
 * Utilitaires pour gérer le statut premium des profils
 * Inclut la gestion des abonnements ET des boosts temporaires
 */

import { Profile } from './database.types';

/**
 * Vérifie si un profil a un statut premium actif
 * Prend en compte les abonnements ET les boosts temporaires
 * 
 * @param profile - Le profil à vérifier
 * @returns true si le profil a un abonnement actif OU un boost non expiré
 */
export function isPremiumActive(profile: Profile): boolean {
    // Vérifier abonnement actif
    if (profile.is_premium) {
        return true;
    }

    // Vérifier boost actif
    if (profile.premium_boost_end_at) {
        const boostEndDate = new Date(profile.premium_boost_end_at);
        const now = new Date();
        return boostEndDate > now;
    }

    return false;
}

/**
 * Calcule le nombre de jours restants pour un boost actif
 * 
 * @param profile - Le profil à vérifier
 * @returns Le nombre de jours restants, ou null si pas de boost actif
 */
export function getRemainingBoostDays(profile: Profile): number | null {
    if (!profile.premium_boost_end_at) return null;

    const endDate = new Date(profile.premium_boost_end_at);
    const now = new Date();
    const diffMs = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : null;
}

/**
 * Vérifie si un boost est proche de l'expiration (< 2 jours)
 * 
 * @param profile - Le profil à vérifier
 * @returns true si le boost expire dans moins de 48h
 */
export function isBoostExpiringsSoon(profile: Profile): boolean {
    const remainingDays = getRemainingBoostDays(profile);
    return remainingDays !== null && remainingDays <= 2 && remainingDays > 0;
}

/**
 * Retourne le type de premium actif
 * 
 * @param profile - Le profil à vérifier
 * @returns 'subscription' | 'boost' | null
 */
export function getPremiumType(profile: Profile): 'subscription' | 'boost' | null {
    if (profile.is_premium) {
        return 'subscription';
    }

    if (profile.premium_boost_end_at) {
        const boostEndDate = new Date(profile.premium_boost_end_at);
        if (boostEndDate > new Date()) {
            return 'boost';
        }
    }

    return null;
}

/**
 * Formatte la date de fin de boost pour affichage
 * 
 * @param endDate - Date de fin du boost (ISO string)
 * @returns Texte formaté type "Expire le 31 janvier 2026"
 */
export function formatBoostEndDate(endDate: string): string {
    const date = new Date(endDate);
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };
    return `Expire le ${date.toLocaleDateString('fr-FR', options)}`;
}
