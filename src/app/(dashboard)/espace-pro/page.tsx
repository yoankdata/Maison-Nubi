import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const success = searchParams?.success === "true";

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/connexion");
    }

    // Requêtes parallèles pour optimiser le temps de charge
    const [profileResult, servicesResult, hoursResult, photosResult] =
        await Promise.all([
            supabase.from("profiles").select("*").eq("id", user.id).single(),
            supabase
                .from("services")
                .select("*", { count: "exact", head: true })
                .eq("profile_id", user.id),
            supabase
                .from("opening_hours")
                .select("*", { count: "exact", head: true })
                .eq("profile_id", user.id),
            supabase
                .from("portfolio_images")
                .select("*", { count: "exact", head: true })
                .eq("profile_id", user.id),
        ]);

    const profile = profileResult.data;

    // Si pas de profil, problème critique -> redirection ou erreur
    if (!profile) {
        // Si l'utilisateur est auth mais n'a pas de profil, cas bizarre mais possible
        redirect("/connexion");
    }

    const hasServices = (servicesResult.count || 0) > 0;
    const hasHours = (hoursResult.count || 0) > 0;
    const hasPhotos = (photosResult.count || 0) > 0;

    return (
        <DashboardClient
            success={success}
            profile={profile}
            hasServices={hasServices}
            hasHours={hasHours}
            hasPhotos={hasPhotos}
        />
    );
}
