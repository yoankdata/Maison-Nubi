"use client";

import { useEffect, useRef } from "react";
import { recordProfileView } from "@/app/actions/tracking";

interface ProfileViewTrackerProps {
    profileId: string;
    profileOwnerId?: string; // Pour ne pas compter les vues du propriétaire
}

/**
 * Génère un fingerprint basique basé sur le navigateur
 * Note: Ce n'est pas un tracking invasif, juste pour éviter les doublons
 */
function generateFingerprint(): string {
    const components = [
        navigator.userAgent,
        navigator.language,
        screen.width + "x" + screen.height,
        new Date().getTimezoneOffset().toString(),
    ];

    // Hash simple basé sur les composants
    const str = components.join("|");
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
}

/**
 * Composant invisible qui enregistre une vue de profil
 * - Limite à 1 vue par visiteur par profil par 24h
 * - Utilise localStorage comme double-check côté client
 * - N'enregistre pas les vues du propriétaire du profil
 */
export function ProfileViewTracker({ profileId, profileOwnerId }: ProfileViewTrackerProps) {
    const hasTracked = useRef(false);

    useEffect(() => {
        // Éviter le double-tracking en Strict Mode React
        if (hasTracked.current) return;
        hasTracked.current = true;

        const trackView = async () => {
            try {
                // Vérifier si le visiteur est le propriétaire du profil
                // (En réalité, on devrait comparer avec l'ID utilisateur connecté)
                // Pour l'instant, on fait confiance au serveur pour ça

                // Vérifier le localStorage pour éviter les requêtes inutiles
                const storageKey = `pv_${profileId}`;
                const lastView = localStorage.getItem(storageKey);
                const now = Date.now();
                const twentyFourHours = 24 * 60 * 60 * 1000;

                // Si vue dans les 24 dernières heures, on ignore
                if (lastView && (now - parseInt(lastView, 10)) < twentyFourHours) {
                    return;
                }

                // Générer un fingerprint pour la déduplication côté serveur
                const fingerprint = generateFingerprint();

                // Enregistrer la vue
                const result = await recordProfileView(profileId, fingerprint);

                if (result.success) {
                    // Mettre à jour le localStorage
                    localStorage.setItem(storageKey, now.toString());
                }
            } catch (error) {
                // Silencieusement ignorer les erreurs pour ne pas impacter l'UX
                console.debug("Profile view tracking error:", error);
            }
        };

        // Délai de 2 secondes pour s'assurer que la page est bien visible
        // et éviter de compter les rebonds immédiats
        const timer = setTimeout(trackView, 2000);

        return () => clearTimeout(timer);
    }, [profileId, profileOwnerId]);

    // Composant invisible
    return null;
}
