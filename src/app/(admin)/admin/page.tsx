import { Users, Crown, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Page Dashboard Admin
 * Affiche les statistiques globales de la plateforme
 */
export default async function AdminDashboardPage() {
    const supabase = await createClient();

    // Statistiques
    let stats = {
        totalProfiles: 0,
        activeProfiles: 0,
        pendingProfiles: 0,
        bannedProfiles: 0,
        premiumProfiles: 0,
    };

    if (supabase) {
        // Total des profils
        const { count: total } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true });
        stats.totalProfiles = total || 0;

        // Profils actifs
        const { count: active } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("status", "active");
        stats.activeProfiles = active || 0;

        // Profils en attente
        const { count: pending } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending");
        stats.pendingProfiles = pending || 0;

        // Profils bannis
        const { count: banned } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("status", "banned");
        stats.bannedProfiles = banned || 0;

        // Profils premium
        const { count: premium } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("is_premium", true);
        stats.premiumProfiles = premium || 0;
    }

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div>
                <h1 className="font-serif text-2xl font-bold text-anthracite">
                    Dashboard Admin
                </h1>
                <p className="text-muted-foreground">
                    Vue d'ensemble de la plateforme Maison Nubi
                </p>
            </div>

            {/* Statistiques */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Profils
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalProfiles}</div>
                        <p className="text-xs text-muted-foreground">
                            prestataires inscrits
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-700">
                            Actifs
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700">
                            {stats.activeProfiles}
                        </div>
                        <p className="text-xs text-green-600/70">
                            profils visibles
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-amber-200 bg-amber-50/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-amber-700">
                            En attente
                        </CardTitle>
                        <Clock className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-700">
                            {stats.pendingProfiles}
                        </div>
                        <p className="text-xs text-amber-600/70">
                            à modérer
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-gold/30 bg-gold/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gold-dark">
                            Premium
                        </CardTitle>
                        <Crown className="h-4 w-4 text-gold" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gold-dark">
                            {stats.premiumProfiles}
                        </div>
                        <p className="text-xs text-gold/70">
                            abonnés NUBI GOLD
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Actions rapides */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                    <Button asChild className="rounded-full bg-gold hover:bg-gold-dark">
                        <Link href="/admin/profils">
                            <Users className="mr-2 h-4 w-4" />
                            Voir tous les profils
                        </Link>
                    </Button>
                    {stats.pendingProfiles > 0 && (
                        <Button asChild variant="outline" className="rounded-full border-amber-300 text-amber-700 hover:bg-amber-50">
                            <Link href="/admin/profils?status=pending">
                                <Clock className="mr-2 h-4 w-4" />
                                {stats.pendingProfiles} en attente
                            </Link>
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
