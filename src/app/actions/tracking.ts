"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

/**
 * Enregistre une vue de profil si elle n'existe pas déjà dans les 24h
 * @param profileId - ID du profil visité
 * @param fingerprint - Hash unique du visiteur (IP + User-Agent)
 */
export async function recordProfileView(
    profileId: string,
    fingerprint: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient();
        if (!supabase) {
            return { success: false, error: "Database unavailable" };
        }

        // Vérifier si une vue existe déjà dans les 24 dernières heures
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        const { data: existingView } = await supabase
            .from("profile_views")
            .select("id")
            .eq("profile_id", profileId)
            .eq("viewer_fingerprint", fingerprint)
            .gte("created_at", twentyFourHoursAgo)
            .limit(1)
            .single();

        // Si vue déjà existante, on ne fait rien
        if (existingView) {
            return { success: true }; // Pas d'erreur, juste ignoré
        }

        // Insérer la nouvelle vue
        // Note: Cast explicite car la table est nouvelle et pas encore dans les types générés
        const { error } = await (supabase as any)
            .from("profile_views")
            .insert({
                profile_id: profileId,
                viewer_fingerprint: fingerprint,
            });

        if (error) {
            console.error("Error recording profile view:", error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error("Exception recording profile view:", err);
        return { success: false, error: "Unknown error" };
    }
}

/**
 * Enregistre un clic sur le bouton WhatsApp
 * @param profileId - ID du profil contacté
 */
export async function recordWhatsAppClick(
    profileId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient();
        if (!supabase) {
            return { success: false, error: "Database unavailable" };
        }

        // Note: Cast explicite car la table est nouvelle et pas encore dans les types générés
        const { error } = await (supabase as any)
            .from("whatsapp_clicks")
            .insert({ profile_id: profileId });

        if (error) {
            console.error("Error recording WhatsApp click:", error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error("Exception recording WhatsApp click:", err);
        return { success: false, error: "Unknown error" };
    }
}

/**
 * Récupère les statistiques de vues d'un profil
 * @param profileId - ID du profil
 */
export async function getProfileViewsStats(profileId: string): Promise<{
    last7Days: number;
    last30Days: number;
    total: number;
    whatsappClicks7Days: number;
    whatsappClicks30Days: number;
} | null> {
    try {
        const supabase = await createClient();
        if (!supabase) return null;

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

        // Vues des 7 derniers jours
        const { count: last7Days } = await supabase
            .from("profile_views")
            .select("*", { count: "exact", head: true })
            .eq("profile_id", profileId)
            .gte("created_at", sevenDaysAgo);

        // Vues des 30 derniers jours
        const { count: last30Days } = await supabase
            .from("profile_views")
            .select("*", { count: "exact", head: true })
            .eq("profile_id", profileId)
            .gte("created_at", thirtyDaysAgo);

        // Total des vues
        const { count: total } = await supabase
            .from("profile_views")
            .select("*", { count: "exact", head: true })
            .eq("profile_id", profileId);

        // Clics WhatsApp des 7 derniers jours
        const { count: whatsappClicks7Days } = await supabase
            .from("whatsapp_clicks")
            .select("*", { count: "exact", head: true })
            .eq("profile_id", profileId)
            .gte("clicked_at", sevenDaysAgo);

        // Clics WhatsApp des 30 derniers jours
        const { count: whatsappClicks30Days } = await supabase
            .from("whatsapp_clicks")
            .select("*", { count: "exact", head: true })
            .eq("profile_id", profileId)
            .gte("clicked_at", thirtyDaysAgo);

        return {
            last7Days: last7Days ?? 0,
            last30Days: last30Days ?? 0,
            total: total ?? 0,
            whatsappClicks7Days: whatsappClicks7Days ?? 0,
            whatsappClicks30Days: whatsappClicks30Days ?? 0,
        };
    } catch (err) {
        console.error("Error fetching profile views stats:", err);
        return null;
    }
}

/**
 * Récupère les vues jour par jour pour les 7 derniers jours
 * Utilisé pour afficher un graphique
 */
export async function getDailyViewsStats(profileId: string): Promise<{
    date: string;
    views: number;
}[]> {
    try {
        const supabase = await createClient();
        if (!supabase) return [];

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Récupérer toutes les vues des 7 derniers jours
        const { data } = await supabase
            .from("profile_views")
            .select("created_at")
            .eq("profile_id", profileId)
            .gte("created_at", sevenDaysAgo.toISOString())
            .order("created_at", { ascending: true });

        if (!data) return [];

        // Grouper par jour
        const dailyCounts: Record<string, number> = {};

        // Initialiser tous les jours avec 0
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dateKey = date.toISOString().split('T')[0];
            dailyCounts[dateKey] = 0;
        }

        // Compter les vues par jour
        (data as Array<{ created_at: string }>).forEach(view => {
            const dateKey = view.created_at.split('T')[0];
            if (dailyCounts[dateKey] !== undefined) {
                dailyCounts[dateKey]++;
            }
        });

        // Convertir en tableau pour le graphique
        return Object.entries(dailyCounts).map(([date, views]) => ({
            date,
            views
        }));
    } catch (err) {
        console.error("Error fetching daily views:", err);
        return [];
    }
}
