import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield, Users, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase-server";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions/auth";

/**
 * Liste des emails admin lue depuis la variable d'environnement
 * Format dans .env.local : ADMIN_EMAILS=admin@maisonnubi.ci,autre@email.com
 * 
 * Avantages :
 * - Pas de redéploiement nécessaire pour changer les admins (sur Vercel)
 * - Emails non exposés dans le code source
 */
function getAdminEmails(): string[] {
    const envEmails = process.env.ADMIN_EMAILS || "";
    if (!envEmails) {
        console.warn("⚠️ ADMIN_EMAILS non configuré dans les variables d'environnement");
        return [];
    }
    return envEmails.split(",").map(email => email.trim().toLowerCase());
}

/**
 * Layout protégé de l'Admin Panel
 * Seuls les emails dans ADMIN_EMAILS peuvent accéder
 */
export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    if (!supabase) {
        redirect("/connexion");
    }

    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/connexion");
    }

    // Vérifier que l'email est autorisé
    const adminEmails = getAdminEmails();
    const userEmail = (user.email || "").toLowerCase();
    const isAdmin = adminEmails.includes(userEmail);

    if (!isAdmin) {
        // Accès refusé - rediriger vers le dashboard normal
        redirect("/espace-pro");
    }

    return (
        <div className="min-h-screen bg-surface">
            {/* Header Admin */}
            <div className="bg-anthracite text-white border-b border-white/10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-gold" />
                        <h1 className="font-serif text-xl font-semibold">
                            Admin Maison Nubi
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-white/60 hidden sm:block">
                            {user.email}
                        </span>
                        <form action={signOutAction}>
                            <Button
                                type="submit"
                                variant="ghost"
                                size="sm"
                                className="text-white/70 hover:text-white hover:bg-white/10"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-10">
                <div className="flex gap-6 md:gap-8">
                    {/* Sidebar */}
                    <aside className="hidden md:block w-64 shrink-0">
                        <div className="sticky top-24">
                            <nav className="space-y-1 bg-white rounded-xl p-4 shadow-sm">
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-anthracite hover:bg-muted transition-colors"
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Link>
                                <Link
                                    href="/admin/profils"
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-anthracite hover:bg-muted transition-colors"
                                >
                                    <Users className="h-4 w-4" />
                                    Modération Profils
                                </Link>
                                <hr className="my-2" />
                                <Link
                                    href="/espace-pro"
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
                                >
                                    <Settings className="h-4 w-4" />
                                    Mon Espace Pro
                                </Link>
                            </nav>
                        </div>
                    </aside>

                    {/* Contenu principal */}
                    <main className="flex-1 min-w-0">{children}</main>
                </div>
            </div>
        </div>
    );
}
