import { createClient } from "@/lib/supabase-server";
import { ProviderCard } from "@/components/provider-card";
import type { Profile } from "@/lib/database.types";

/**
 * Composant serveur pour afficher les profils a la une
 * Affiche les profils premium ou les mieux notes
 */
export async function FeaturedProfiles() {
    const supabase = await createClient();

    if (!supabase) {
        return null;
    }

    // Recuperer les profils premium ou les mieux notes (max 4)
    const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .eq("status", "active")
        .order("is_premium", { ascending: false })
        .order("rating", { ascending: false })
        .limit(4);

    if (!profiles || profiles.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(profiles as unknown as Profile[]).map((profile) => (
                <ProviderCard key={profile.id} provider={profile} />
            ))}
        </div>
    );
}
