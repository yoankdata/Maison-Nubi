import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getOpeningHoursAction } from "@/app/actions/hours";
import { OpeningHoursEditor } from "@/components/dashboard/opening-hours-editor";
import { Clock } from "lucide-react";

export default async function OpeningHoursPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/connexion");
    }

    // Récupérer les horaires actuels
    const { data: hours } = await getOpeningHoursAction(user.id);

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                    <Clock className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-serif font-bold text-anthracite">Mes Horaires</h2>
                    <p className="text-muted-foreground">Gérez vos jours et heures d'ouverture</p>
                </div>
            </div>

            <OpeningHoursEditor initialHours={hours || []} />
        </div>
    );
}
