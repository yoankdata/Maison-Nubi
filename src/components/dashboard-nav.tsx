"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Image, CreditCard, LogOut, Package, Home, LayoutDashboard, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
    { href: "/espace-pro", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/espace-pro/profil", label: "Mon Profil", icon: User },
    { href: "/espace-pro/services", label: "Mes Services", icon: Package },
    { href: "/espace-pro/horaires", label: "Mes Horaires", icon: Clock },
    { href: "/espace-pro/galerie", label: "Ma Galerie", icon: Image },
    { href: "/espace-pro/abonnement", label: "Abonnement", icon: CreditCard },
    { href: "/espace-pro/services-premium", label: "Services Premium", icon: Sparkles },
];

export function DashboardNav() {
    const pathname = usePathname();

    return (
        <nav className="space-y-1">
            {sidebarLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 group",
                            isActive
                                ? "bg-gold/10 text-gold font-medium shadow-sm border border-gold/20"
                                : "text-muted-foreground hover:bg-white hover:text-anthracite hover:shadow-sm"
                        )}
                    >
                        <link.icon className={cn(
                            "h-4 w-4 transition-colors",
                            isActive ? "text-gold" : "text-muted-foreground group-hover:text-anthracite"
                        )} />
                        {link.label}
                    </Link>
                );
            })}

            <hr className="my-6 border-border/60" />

            <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:bg-white hover:text-anthracite hover:shadow-sm transition-all duration-200"
            >
                <Home className="h-4 w-4" />
                Retour au site
            </Link>

            <form action="/api/auth/signout" method="POST">
                <button
                    type="submit"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500/80 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                </button>
            </form>
        </nav>
    );
}
