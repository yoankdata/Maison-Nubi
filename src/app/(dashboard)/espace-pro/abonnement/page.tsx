"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Crown,
    Check,
    Loader2,
    Sparkles,
    Star,
    Eye,
    BadgeCheck,
    Zap,
    CheckCircle2,
    Copy,
    Smartphone,
    Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/database.types";
import { StripeCheckoutButton } from "@/components/stripe-checkout-button";
import { CreditCard } from "lucide-react";

// Avantages de l'offre NUBI GOLD
const GOLD_FEATURES = [
    {
        icon: Crown,
        title: "Badge Premium + Vérifié",
        description: "Gagnez la confiance des clients instantanément",
    },
    {
        icon: Star,
        title: "Position Top 3",
        description: "Apparaissez avant vos concurrents dans les recherches",
    },
    {
        icon: Eye,
        title: "Mise en avant prioritaire",
        description: "Votre profil est recommandé aux clients",
    },
    {
        icon: Zap,
        title: "Galerie illimitée",
        description: "Montrez tout votre talent sans limite",
    },
    {
        icon: BadgeCheck,
        title: "Statistiques avancées",
        description: "Suivez vos vues et clics en temps réel",
    },
];

/**
 * Page de gestion de l'abonnement NUBI GOLD
 * Affiche les offres Annuelle et Mensuelle avec instructions Mobile Money
 */
export default function BillingPage() {
    const [copied, setCopied] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<"annual" | "monthly">("annual");
    const [showUpgradeInstructions, setShowUpgradeInstructions] = useState(false);

    // Récupérer le statut premium
    const { data: profile, isLoading: isLoadingProfile } = useQuery({
        queryKey: ["profile-premium"],
        queryFn: async () => {
            if (!supabase) throw new Error("Supabase non configuré");

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Non connecté");

            const { data, error } = await supabase
                .from("profiles")
                .select("is_premium")
                .eq("id", user.id)
                .single();

            if (error) throw error;
            return data as unknown as Pick<Profile, "is_premium">;
        },
    });

    const isPremium = profile?.is_premium || false;

    // Copier le numéro
    const handleCopyNumber = () => {
        navigator.clipboard.writeText("07 07 75 62 97");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoadingProfile) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl">
            {/* En-tête */}
            <div>
                <h1 className="font-serif text-2xl font-bold text-anthracite">
                    Mon Abonnement
                </h1>
                <p className="text-muted-foreground">
                    {isPremium ? "Vous êtes membre NUBI GOLD" : "Débloquez tout le potentiel de Maison Nubi"}
                </p>
            </div>

            {isPremium ? (
                /* Affichage si déjà premium */
                <Card className="relative overflow-hidden border-2 border-green-500 bg-green-50/30">
                    <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white bg-green-500">
                            <CheckCircle2 className="h-3 w-3" />
                            Actif
                        </span>
                    </div>

                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
                                <Crown className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="font-serif text-2xl">NUBI GOLD</CardTitle>
                                <CardDescription>Votre abonnement premium est actif</CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <ul className="space-y-3">
                            {GOLD_FEATURES.map((feature) => (
                                <li key={feature.title} className="flex items-start gap-3">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                                        <Check className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-anthracite">{feature.title}</p>
                                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="text-center py-4">
                            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-6 py-3 text-green-700 font-medium">
                                <CheckCircle2 className="h-5 w-5" />
                                Merci de faire partie de la communauté NUBI GOLD !
                            </div>
                        </div>

                        {/* Option Upgrade Annuel */}
                        <div className="mt-8 pt-8 border-t border-green-200">
                            <div className="bg-white rounded-xl p-6 border-2 border-gold/30 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl -z-10" />

                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="space-y-2">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 text-gold-dark text-xs font-bold">
                                            <Gift className="h-3 w-3" />
                                            Offre spéciale membres
                                        </div>
                                        <h3 className="font-serif text-lg font-bold text-anthracite">
                                            Vous êtes en mensuel ? Passez à l'annuel !
                                        </h3>
                                        <p className="text-sm text-muted-foreground max-w-sm">
                                            Économisez <strong>20 000 FCFA</strong> (2 mois offerts) et profitez d'une tranquillité d'esprit pendant 1 an.
                                        </p>
                                    </div>

                                    <Button
                                        onClick={() => {
                                            setSelectedPlan("annual");
                                            setShowUpgradeInstructions(true);
                                            // Petit délai pour laisser le rendu se faire avant le scroll
                                            setTimeout(() => {
                                                document.getElementById('upgrade-payment')?.scrollIntoView({ behavior: 'smooth' });
                                            }, 100);
                                        }}
                                        className="bg-gold hover:bg-gold-dark text-white font-bold shadow-lg shadow-gold/20 whitespace-nowrap"
                                    >
                                        Passer à l'annuel
                                    </Button>
                                </div>

                                {/* Instructions paiement Upgrade (affichées au clic ou toujours visibles ?) 
                                    On va les afficher si selectedPlan est annual, ce qui est le cas par défaut mais ici on est dans le bloc premium.
                                    On va modifier la logique pour afficher les instructions si on clique.
                                */}
                            </div>
                        </div>

                        {/* Zone Paiement Upgrade (visible uniquement si demandé) */}
                        {/* Zone Paiement Upgrade (visible uniquement si demandé) */}
                        {showUpgradeInstructions && (
                            <div id="upgrade-payment" className="scroll-mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                <Card className="bg-gold/5 border-2 border-gold/20 mt-6">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center gap-2 text-gold font-semibold">
                                            <Smartphone className="h-5 w-5" />
                                            <span>Payer mon passage à l'annuel</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <ol className="space-y-3 text-sm">
                                            <li className="flex gap-3">
                                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-white text-xs font-bold flex-shrink-0">1</span>
                                                <span className="text-anthracite">
                                                    Envoyez <strong className="font-bold text-gold">100 000 FCFA</strong> par <strong>Wave</strong> ou <strong>Orange Money</strong>
                                                </span>
                                            </li>
                                            <li className="flex gap-3 items-start">
                                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-white text-xs font-bold flex-shrink-0">2</span>
                                                <div className="flex-1">
                                                    <span className="text-anthracite block mb-2">Au numéro :</span>
                                                    <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-gold/30">
                                                        <span className="font-mono text-lg font-bold text-anthracite flex-1">07 07 75 62 97</span>
                                                        <Button
                                                            onClick={handleCopyNumber}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 px-3 hover:bg-gold/10"
                                                        >
                                                            {copied ? (
                                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                            ) : (
                                                                <Copy className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-white text-xs font-bold flex-shrink-0">3</span>
                                                <span className="text-anthracite">
                                                    Envoyez "UPGRADE ANNUEL" sur WhatsApp au <strong>+225 07 07 75 62 97</strong> avec votre preuve
                                                </span>
                                            </li>
                                        </ol>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Sélection du plan */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Plan Annuel */}
                        <button
                            onClick={() => setSelectedPlan("annual")}
                            className={`relative text-left p-6 rounded-2xl border-2 transition-all ${selectedPlan === "annual"
                                ? "border-gold bg-gold/5 shadow-lg"
                                : "border-border hover:border-gold/50"
                                }`}
                        >
                            {/* Badge meilleure offre */}
                            <div className="absolute -top-3 left-4">
                                <Badge className="bg-gold text-white border-none">
                                    <Gift className="mr-1 h-3 w-3" />
                                    Meilleure offre
                                </Badge>
                            </div>

                            <div className="pt-2">
                                <h3 className="font-serif text-xl font-bold text-anthracite mb-1">Annuel</h3>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-3xl font-bold text-anthracite">100 000</span>
                                    <span className="text-muted-foreground">FCFA/an</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-green-600 font-medium">Économisez 20 000 FCFA</span>
                                    <span className="text-xs text-muted-foreground">(2 mois gratuits)</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">Soit 8 333 FCFA/mois</p>
                            </div>

                            {selectedPlan === "annual" && (
                                <div className="absolute top-4 right-4">
                                    <div className="h-6 w-6 rounded-full bg-gold flex items-center justify-center">
                                        <Check className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                            )}
                        </button>

                        {/* Plan Mensuel */}
                        <button
                            onClick={() => setSelectedPlan("monthly")}
                            className={`relative text-left p-6 rounded-2xl border-2 transition-all ${selectedPlan === "monthly"
                                ? "border-gold bg-gold/5 shadow-lg"
                                : "border-border hover:border-gold/50"
                                }`}
                        >
                            <h3 className="font-serif text-xl font-bold text-anthracite mb-1">Mensuel</h3>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-3xl font-bold text-anthracite">10 000</span>
                                <span className="text-muted-foreground">FCFA/mois</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Sans engagement</p>
                            <p className="text-xs text-muted-foreground mt-2">Annulable à tout moment</p>

                            {selectedPlan === "monthly" && (
                                <div className="absolute top-4 right-4">
                                    <div className="h-6 w-6 rounded-full bg-gold flex items-center justify-center">
                                        <Check className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                            )}
                        </button>
                    </div>

                    {/* Avantages inclus */}
                    <Card className="border-2 border-gold/30">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold to-amber-600">
                                    <Crown className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="font-serif text-xl">Avantages NUBI GOLD</CardTitle>
                                    <CardDescription>Inclus dans les deux formules</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid gap-3 md:grid-cols-2">
                                {GOLD_FEATURES.map((feature) => (
                                    <li key={feature.title} className="flex items-start gap-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/10 flex-shrink-0">
                                            <Check className="h-4 w-4 text-gold" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-anthracite text-sm">{feature.title}</p>
                                            <p className="text-xs text-muted-foreground">{feature.description}</p>
                                        </div>
                                    </li>
                                ))}
                                {selectedPlan === "annual" && (
                                    <li className="flex items-start gap-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 flex-shrink-0">
                                            <Gift className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-green-700 text-sm">12 mois de visibilité</p>
                                            <p className="text-xs text-green-600">Sans interruption</p>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Options de paiement */}
                    <Card className="bg-gradient-to-br from-slate-50 to-white border-2 border-gold/20">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2 text-anthracite font-bold text-lg">
                                <CreditCard className="h-5 w-5 text-gold" />
                                <span>Choisissez votre mode de paiement</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                Paiement sécurisé - {selectedPlan === "annual" ? "100 000 FCFA" : "10 000 FCFA"}
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Option 1 : Carte Bancaire (Stripe) */}
                            <div className="relative">
                                <div className="absolute -top-3 left-4 z-10">
                                    <Badge className="bg-emerald-500 text-white border-none shadow-md">
                                        Recommandé • Activation instantanée
                                    </Badge>
                                </div>
                                <div className="border-2 border-emerald-500/30 rounded-xl p-6 bg-white hover:border-emerald-500/50 transition-all">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-bold text-anthracite mb-2 flex items-center gap-2">
                                                <CreditCard className="h-5 w-5 text-emerald-600" />
                                                Paiement par Carte Bancaire
                                            </h3>
                                            <p className="text-sm text-slate-600">
                                                Cartes Visa, Mastercard, ou cartes virtuelles Wave acceptées
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="outline" className="text-xs">
                                                ✨ Activation automatique
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                🔒 Paiement sécurisé Stripe
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                💳 Wave Virtual Card OK
                                            </Badge>
                                        </div>
                                        <StripeCheckoutButton
                                            planType={selectedPlan}
                                            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20"
                                        >
                                            <CreditCard className="mr-2 h-5 w-5" />
                                            Payer par carte bancaire
                                        </StripeCheckoutButton>
                                    </div>
                                </div>
                            </div>

                            {/* Séparateur */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-4 text-slate-500 font-semibold">ou</span>
                                </div>
                            </div>

                            {/* Option 2 : Mobile Money */}
                            <div className="border-2 border-slate-200 rounded-xl p-6 bg-slate-50/50">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-gold font-semibold">
                                        <Smartphone className="h-5 w-5" />
                                        <span>Paiement Mobile Money</span>
                                    </div>
                                    <ol className="space-y-3 text-sm">
                                        <li className="flex gap-3">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-white text-xs font-bold flex-shrink-0">1</span>
                                            <span className="text-anthracite">
                                                Envoyez <strong className="font-bold text-gold">
                                                    {selectedPlan === "annual" ? "100 000 FCFA" : "10 000 FCFA"}
                                                </strong> par <strong>Wave</strong> ou <strong>Orange Money</strong>
                                            </span>
                                        </li>
                                        <li className="flex gap-3 items-start">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-white text-xs font-bold flex-shrink-0">2</span>
                                            <div className="flex-1">
                                                <span className="text-anthracite block mb-2">Au numéro :</span>
                                                <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-gold/30">
                                                    <span className="font-mono text-lg font-bold text-anthracite flex-1">07 07 75 62 97</span>
                                                    <Button
                                                        onClick={handleCopyNumber}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-3 hover:bg-gold/10"
                                                    >
                                                        {copied ? (
                                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                        ) : (
                                                            <Copy className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-white text-xs font-bold flex-shrink-0">3</span>
                                            <span className="text-anthracite">
                                                Contactez-nous sur WhatsApp au <strong>+225 07 07 75 62 97</strong> avec votre preuve de paiement
                                            </span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-white text-xs font-bold flex-shrink-0">4</span>
                                            <span className="text-anthracite">Votre compte sera activé <strong className="font-bold">sous 24h</strong> maximum</span>
                                        </li>
                                    </ol>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-200 text-center">
                                <p className="text-xs text-muted-foreground">
                                    {selectedPlan === "annual"
                                        ? "Abonnement annuel de 12 mois. Renouvelable chaque année."
                                        : "Abonnement mensuel, renouvelable chaque mois. Annulable à tout moment."
                                    }
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Offre gratuite actuelle */}
                    <Card className="bg-gray-50/50">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                                Votre plan actuel : Gratuit
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    Profil visible sur Maison Nubi
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    Jusqu&apos;à 3 photos dans votre galerie
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    Services et tarifs illimités
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
