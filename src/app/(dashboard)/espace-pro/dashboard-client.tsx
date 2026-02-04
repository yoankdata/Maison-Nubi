"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Crown, PartyPopper, Sparkles, CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist";
import { ProfileViewsCard } from "@/components/dashboard/profile-views-card";
import Link from "next/link";
// import Confetti from somewhere? No, reusing the inline code from previous file.

interface DashboardClientProps {
    success: boolean;
    profile: any;
    hasServices: boolean;
    hasHours: boolean;
    hasPhotos: boolean;
}

export default function DashboardClient({
    success,
    profile,
    hasServices,
    hasHours,
    hasPhotos,
}: DashboardClientProps) {
    const router = useRouter();
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (success) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    // Si SUCCÈS (redirection Stripe ou autre), on affiche la page de félicitations
    if (success) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                {/* Confettis */}
                {showConfetti && (
                    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
                        {[...Array(50)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute animate-bounce"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `-20px`,
                                    animationDelay: `${Math.random() * 2}s`,
                                    animationDuration: `${2 + Math.random() * 3}s`,
                                }}
                            >
                                <Sparkles
                                    className="h-4 w-4"
                                    style={{
                                        color: [
                                            "#D4AF37",
                                            "#FFD700",
                                            "#FFA500",
                                            "#FF6B6B",
                                            "#4ECDC4",
                                        ][Math.floor(Math.random() * 5)],
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="w-full max-w-md animate-in slide-in-from-bottom-8 fade-in duration-700">
                    <Card className="border-0 shadow-2xl shadow-gold/10 overflow-hidden relative">
                        <div className="h-2 bg-gradient-to-r from-gold via-yellow-400 to-gold w-full absolute top-0 left-0" />

                        <CardContent className="pt-12 pb-10 px-8 text-center space-y-8">
                            <div className="flex justify-center relative">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full scale-150 animate-pulse" />
                                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gold to-amber-500 shadow-lg border-4 border-white">
                                        <Crown className="h-12 w-12 text-white" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-gray-100">
                                        <PartyPopper className="h-5 w-5 text-gold" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h1 className="font-serif text-3xl font-bold text-anthracite">
                                    Félicitations !
                                </h1>
                                <p className="text-muted-foreground text-lg">
                                    Bienvenue dans le club{" "}
                                    <span className="font-bold text-gold">NUBI GOLD</span>.
                                </p>
                            </div>

                            <div className="pt-2">
                                <Button
                                    onClick={() => router.push("/espace-pro/profil")}
                                    className="w-full h-12 rounded-full bg-anthracite hover:bg-gold hover:text-white text-white font-bold transition-all duration-300"
                                >
                                    Configurer mon profil Gold
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => router.replace("/espace-pro")}
                                    className="mt-2 w-full text-sm text-muted-foreground"
                                >
                                    Aller au dashboard
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Dashboard Standard
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="font-serif text-3xl font-bold text-anthracite">
                    Bonjour, {profile.full_name?.split(" ")[0]} 👋
                </h1>
                <p className="text-muted-foreground mt-1">
                    Voici un aperçu de votre activité sur Maison Nubi.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Colonne Principale */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Checklist d'onboarding */}
                    <OnboardingChecklist
                        profile={profile}
                        hasServices={hasServices}
                        hasHours={hasHours}
                        hasPhotos={hasPhotos}
                    />

                    {/* Statistiques de vues */}
                    <ProfileViewsCard
                        profileId={profile.id}
                        isPremium={profile.is_premium}
                    />
                </div>

                {/* Colonne Latérale */}
                <div className="space-y-6">
                    {/* Lien Public Profile */}
                    <Card className="border-l-4 border-l-gold shadow-sm">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-anthracite">Votre profil public</h3>
                                {profile.status === 'active' ? (
                                    <span className="flex h-2 w-2 rounded-full bg-green-500" title="En ligne" />
                                ) : (
                                    <span className="flex h-2 w-2 rounded-full bg-amber-500" title="En attente" />
                                )}
                            </div>

                            <p className="text-xs text-muted-foreground mb-2">Partagez ce lien avec vos clients :</p>

                            <div className="bg-gray-100 p-3 rounded-lg text-xs font-mono break-all border border-gray-200 mb-3 select-all">
                                {`https://maisonnubi.ci/prestataire/${profile.slug}`}
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1" onClick={() => {
                                    navigator.clipboard.writeText(`https://maisonnubi.ci/prestataire/${profile.slug}`);
                                    alert("Lien copié !");
                                }}>
                                    <Copy className="h-3 w-3 mr-2" />
                                    Copier
                                </Button>
                                <Button size="sm" className="flex-1 bg-anthracite text-white hover:bg-gold" asChild>
                                    <Link href={`/prestataire/${profile.slug}`} target="_blank">
                                        Voir
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
