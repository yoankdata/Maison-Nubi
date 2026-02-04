"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import type { OpeningHourInsert, OpeningHourUpdate } from "@/lib/database.types";

/**
 * Récupère les horaires d'un prestataire
 */
export async function getOpeningHoursAction(profileId: string) {
    const supabase = await createClient();

    // Récupérer les horaires triés par jour (0=Dimanche)
    const { data, error } = await supabase
        .from("opening_hours")
        .select("*")
        .eq("profile_id", profileId)
        .order("day_of_week", { ascending: true });

    if (error) {
        console.error("Erreur récupération horaires:", error);
        return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
}

/**
 * Met à jour les horaires d'ouverture
 * Cette action écrase ou crée les horaires pour chaque jour envoyé
 */
export async function updateOpeningHoursAction(hours: { day_of_week: number; open_time: string | null; close_time: string | null; is_closed: boolean }[]) {
    const supabase = await createClient();

    // 1. Vérifier l'auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: "Non connecté" };
    }

    try {
        // 2. Préparer les données pour upsert
        const updates: OpeningHourInsert[] = hours.map(h => ({
            profile_id: user.id,
            day_of_week: h.day_of_week,
            open_time: h.open_time,
            close_time: h.close_time,
            is_closed: h.is_closed
        }));

        // 3. Upsert (Insérer ou mettre à jour)
        const { error } = await supabase
            .from("opening_hours" as any)
            .upsert(updates as any, { onConflict: "profile_id,day_of_week" });

        if (error) throw error;

        // 4. Revalidate pour mettre à jour l'affichage
        revalidatePath("/espace-pro/profil");
        revalidatePath(`/prestataire`); // Invalidera potentiellement toutes les pages prestataires, peut être optimisé

        return { success: true };
    } catch (error) {
        console.error("Erreur mise à jour horaires:", error);
        return { success: false, error: "Impossible de mettre à jour les horaires" };
    }
}
