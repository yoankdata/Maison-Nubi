"use server";

import { createClient } from "@/lib/supabase-server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",") || [];

export async function updateProfileStatus(
    profileId: string,
    newStatus: "active" | "pending" | "banned"
) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        // 1. Vérification Auth & Admin
        if (!user || !user.email) {
            return { error: "Vous devez être connecté." };
        }

        if (!ADMIN_EMAILS.includes(user.email)) {
            return { error: "Accès refusé. Vous n'êtes pas administrateur." };
        }

        // 2. Tenter la mise à jour
        // Si la clé SERVICE_ROLE est présente, on l'utilise pour contourner RLS
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (serviceRoleKey) {
            const adminClient = createSupabaseClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                serviceRoleKey,
                {
                    auth: {
                        autoRefreshToken: false,
                        persistSession: false,
                    },
                }
            );

            const { error } = await adminClient
                .from("profiles")
                .update({ status: newStatus })
                .eq("id", profileId);

            if (error) {
                console.error("Erreur Admin Update (Service Role):", error);
                return { error: "Erreur lors de la mise à jour (Admin)." };
            }
        } else {
            // Sinon, on essaie avec le client utilisateur (nécessite des policies RLS correctes)
            // Note: C'est moins robuste car dépendant des policies "admin" dans la DB
            const { error } = await supabase
                .from("profiles")
                .update({ status: newStatus } as never)
                .eq("id", profileId);

            if (error) {
                console.error("Erreur Update (User Client):", error);
                return {
                    error:
                        "Erreur RLS. Vérifiez vos permissions ou ajoutez SUPABASE_SERVICE_ROLE_KEY.",
                };
            }
        }

        // 3. Revalidation du cache
        revalidatePath("/admin/profils");
        return { success: true };
    } catch (err) {
        console.error("Erreur inattendue:", err);
        return { error: "Une erreur inattendue est survenue." };
    }
}
