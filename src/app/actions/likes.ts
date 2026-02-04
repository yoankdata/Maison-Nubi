"use server";

import { createClient } from "@/lib/supabase-server";

/**
 * Server Actions pour le systeme de likes anonymes
 * Pas d'authentification requise - utilise device_id
 * 
 * Note: La table anonymous_likes doit etre creee dans Supabase
 * Voir: supabase/migrations/20241213_anonymous_likes.sql
 */

interface LikeResult {
    success: boolean;
    isLiked: boolean;
    count: number;
    error?: string;
}

/**
 * Toggle like/unlike pour un profil
 * Si deja like -> unlike, sinon -> like
 */
export async function toggleLike(profileId: string, deviceId: string): Promise<LikeResult> {
    const supabase = await createClient();

    if (!supabase) {
        return { success: false, isLiked: false, count: 0, error: "Database unavailable" };
    }

    try {
        // Cast le client pour bypasser le type checking sur la nouvelle table
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = supabase as any;

        // Verifier si deja like
        const { data: existingLike } = await db
            .from("anonymous_likes")
            .select("id")
            .eq("profile_id", profileId)
            .eq("device_id", deviceId)
            .single();

        if (existingLike) {
            // Unlike - supprimer le like existant
            await db
                .from("anonymous_likes")
                .delete()
                .eq("profile_id", profileId)
                .eq("device_id", deviceId);
        } else {
            // Like - inserer nouveau like
            const { error } = await db
                .from("anonymous_likes")
                .insert({ profile_id: profileId, device_id: deviceId });

            if (error && error.code !== "23505") {
                throw error;
            }
        }

        // Recuperer le nouveau count depuis profiles
        const { data: profile } = await db
            .from("profiles")
            .select("recommendations_count")
            .eq("id", profileId)
            .single();

        return {
            success: true,
            isLiked: !existingLike,
            count: profile?.recommendations_count || 0
        };
    } catch (error) {
        console.error("Error toggling like:", error);
        return { success: false, isLiked: false, count: 0, error: "Failed to toggle like" };
    }
}

/**
 * Verifier si un device a deja like un profil
 */
export async function checkIfLiked(profileId: string, deviceId: string): Promise<boolean> {
    const supabase = await createClient();

    if (!supabase) return false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    const { data } = await db
        .from("anonymous_likes")
        .select("id")
        .eq("profile_id", profileId)
        .eq("device_id", deviceId)
        .single();

    return !!data;
}

/**
 * Recuperer le nombre de recommandations d'un profil
 */
export async function getLikeCount(profileId: string): Promise<number> {
    const supabase = await createClient();

    if (!supabase) return 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    const { data } = await db
        .from("profiles")
        .select("recommendations_count")
        .eq("id", profileId)
        .single();

    return data?.recommendations_count || 0;
}
