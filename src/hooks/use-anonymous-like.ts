"use client";

import { useState, useEffect, useTransition } from "react";
import { toggleLike, checkIfLiked } from "@/app/actions/likes";

/**
 * Hook pour gerer les likes anonymes
 * Utilise device_id stocke en localStorage
 * Feedback optimiste via state local
 */
export function useAnonymousLike(profileId: string, initialCount: number = 0) {
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [count, setCount] = useState(initialCount);
    const [isPending, startTransition] = useTransition();

    // Initialiser device_id au montage
    useEffect(() => {
        let id = localStorage.getItem("nubi_device_id");

        if (!id) {
            // Generer un nouveau device_id
            id = crypto.randomUUID();
            localStorage.setItem("nubi_device_id", id);
        }

        setDeviceId(id);
    }, []);

    // Verifier si deja like au montage
    useEffect(() => {
        if (!deviceId || !profileId) return;

        checkIfLiked(profileId, deviceId).then((liked) => {
            setIsLiked(liked);
        });
    }, [deviceId, profileId]);

    // Fonction pour toggle le like avec feedback optimiste
    const handleToggle = () => {
        if (!deviceId) return;

        // Mise a jour optimiste immediate (avant appel serveur)
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setCount(prev => newIsLiked ? prev + 1 : Math.max(0, prev - 1));

        // Appel serveur en arriere-plan
        startTransition(async () => {
            const result = await toggleLike(profileId, deviceId);

            if (result.success) {
                // Synchroniser avec le resultat serveur
                setIsLiked(result.isLiked);
                setCount(result.count);
            } else {
                // Rollback si erreur
                setIsLiked(!newIsLiked);
                setCount(prev => !newIsLiked ? prev + 1 : Math.max(0, prev - 1));
            }
        });
    };

    return {
        isLiked,
        count,
        isPending,
        toggle: handleToggle,
        isReady: !!deviceId
    };
}
