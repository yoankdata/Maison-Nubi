"use client";

import Link from "next/link";
import {
    Globe,
    Instagram,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    Camera,
    Star,
    Smartphone,
    Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Page Services Premium - Add-ons pour booster la visibilité
 * Affiche les services additionnels : Site Web Signature et Conciergerie Instagram
 */
export default function ServicesPremiumPage() {
    return (
        <div className="space-y-8 max-w-4xl">
            {/* En-tête */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-gold" />
                    <h1 className="font-serif text-3xl font-bold text-anthracite">
                        Services Premium
                    </h1>
                </div>
                <p className="text-lg text-muted-foreground">
                    Passez de l'ombre à la lumière avec nos services exclusifs
                </p>
            </div>

            {/* Intro */}
            <Card className="border-2 border-gold/20 bg-gradient-to-br from-gold/5 to-transparent">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 flex-shrink-0">
                            <Gift className="h-6 w-6 text-gold" />
                        </div>
                        <div>
                            <h3 className="font-bold text-anthracite mb-2">
                                Des outils puissants pour les professionnels d'exception
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Nos services premium sont conçus pour les prestataires qui exigent une présence digitale irréprochable et veulent dominer leur marché.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Service 1 : Site Web Signature */}
            <Card className="group relative bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow duration-500 border-2 border-slate-100">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/10 transition-colors" />

                <CardContent className="p-8 md:p-12 relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <Badge className="bg-anthracite text-white hover:bg-anthracite border-none text-xs px-3 py-1">
                            Best-Seller
                        </Badge>
                        <span className="text-sm font-semibold text-gold-dark tracking-wide uppercase">
                            Indépendance Totale
                        </span>
                    </div>

                    <h3 className="text-4xl font-serif font-bold text-anthracite mb-4 leading-none">
                        Site Web Signature
                    </h3>
                    <p className="text-slate-600 text-lg mb-10 max-w-lg">
                        Votre propre vitrine digitale (.ci). <br />
                        Luxe, crédibilité et réservations directes.
                    </p>

                    <div className="grid grid-cols-2 gap-6 mb-12">
                        <div className="flex flex-col gap-2">
                            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mb-1">
                                <Globe className="w-5 h-5 text-gold-dark" />
                            </div>
                            <span className="font-bold text-anthracite">Domaine .ci</span>
                            <span className="text-xs text-muted-foreground">inclus 1 an</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mb-1">
                                <Smartphone className="w-5 h-5 text-gold-dark" />
                            </div>
                            <span className="font-bold text-anthracite">Mobile First</span>
                            <span className="text-xs text-muted-foreground">Design responsive</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mb-1">
                                <Camera className="w-5 h-5 text-gold-dark" />
                            </div>
                            <span className="font-bold text-anthracite">Galerie HD</span>
                            <span className="text-xs text-muted-foreground">Illimité</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mb-1">
                                <Star className="w-5 h-5 text-gold-dark" />
                            </div>
                            <span className="font-bold text-anthracite">Avis Nubi</span>
                            <span className="text-xs text-muted-foreground">Synchronisés</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-6 pt-8 border-t border-slate-100">
                        <div>
                            <div className="text-5xl font-bold text-anthracite tracking-tight mb-1">
                                150 000 <span className="text-2xl text-slate-400 font-medium">FCFA</span>
                            </div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Paiement unique
                            </div>
                        </div>
                        <Button
                            asChild
                            className="h-14 px-8 rounded-full bg-anthracite text-white hover:bg-gold hover:text-white transition-all duration-300 text-lg font-bold shadow-xl"
                        >
                            <Link href="https://wa.me/2250707756297?text=Je%20souhaite%20lancer%20mon%20site%20web" target="_blank">
                                Lancer mon projet
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Service 2 : Conciergerie Instagram */}
            <Card className="relative bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-3xl border border-white/5 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardContent className="p-8 md:p-12 relative z-10">
                    <div className="flex justify-between items-start mb-10">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <Instagram className="w-8 h-8" />
                        </div>
                        <Badge className="bg-white text-anthracite hover:bg-white font-bold px-3 py-1">
                            Livraison Express : 24h
                        </Badge>
                    </div>

                    <h3 className="text-3xl font-serif font-bold text-white mb-6">
                        Conciergerie Instagram
                    </h3>
                    <p className="text-gray-200 text-lg leading-relaxed mb-10">
                        Votre image est votre première source de revenus. Nous transformons votre profil en aimant à clients.
                    </p>

                    <ul className="space-y-4 mb-12">
                        <li className="flex items-center gap-3 text-white font-medium">
                            <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
                            <span>Bio optimisée & stratégique</span>
                        </li>
                        <li className="flex items-center gap-3 text-white font-medium">
                            <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
                            <span>Configuration boutons contact</span>
                        </li>
                        <li className="flex items-center gap-3 text-white font-medium">
                            <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
                            <span>Highlights (Stories à la une)</span>
                        </li>
                        <li className="flex items-center gap-3 text-white font-medium">
                            <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
                            <span>Harmonisation visuelle du feed</span>
                        </li>
                    </ul>

                    <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <div className="text-4xl font-bold text-white mb-1">
                                20 000 <span className="text-xl text-gray-500 font-normal">FCFA</span>
                            </div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                Paiement unique
                            </div>
                        </div>
                        <Button
                            asChild
                            className="w-full sm:w-auto h-14 px-8 rounded-full bg-gold text-anthracite hover:bg-white transition-all duration-300 text-lg font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                        >
                            <Link href="https://wa.me/2250707756297?text=Je%20souhaite%20obtenir%20mon%20pack%20Instagram" target="_blank">
                                Obtenir mon pack
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Service 3 : Boost Gold 7 Jours - NOUVEAU */}
            <Card className="relative bg-gradient-to-br from-gold/5 to-purple-50 rounded-3xl border-2 border-gold/20 overflow-hidden group">
                <div className="absolute top-4 right-4">
                    <Badge className="bg-gold text-white hover:bg-gold font-bold px-3 py-1">
                        ⚡ NOUVEAU
                    </Badge>
                </div>

                <CardContent className="p-8 md:p-12 relative z-10">
                    <div className="flex items-center gap-2 mb-8 mt-4">
                        <Badge className="bg-purple-600 text-white hover:bg-purple-600 border-none text-xs px-3 py-1">
                            7 Jours
                        </Badge>
                        <span className="text-sm font-semibold text-gold-dark tracking-wide uppercase">
                            Accès Elite
                        </span>
                    </div>

                    <h3 className="text-3xl font-serif font-bold text-anthracite mb-4">
                        Boost Gold
                    </h3>
                    <p className="text-slate-600 text-lg leading-relaxed mb-8">
                        Testez les avantages premium pendant 7 jours. Parfait avant un événement important.
                    </p>

                    <ul className="space-y-3 mb-10">
                        <li className="flex items-center gap-3 text-anthracite font-medium">
                            <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
                            <span>Badge Vérifié & Premium</span>
                        </li>
                        <li className="flex items-center gap-3 text-anthracite font-medium">
                            <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
                            <span>Position Top 3 garantie</span>
                        </li>
                        <li className="flex items-center gap-3 text-anthracite font-medium">
                            <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
                            <span>Galerie photos illimitée</span>
                        </li>
                        <li className="flex items-center gap-3 text-anthracite font-medium">
                            <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
                            <span>Statistiques avancées</span>
                        </li>
                    </ul>

                    <div className="pt-6 border-t border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <div className="text-4xl font-bold text-anthracite mb-1">
                                5 000 <span className="text-xl text-slate-400 font-normal">FCFA</span>
                            </div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Accès 7 jours
                            </div>
                        </div>
                        <Button
                            asChild
                            className="w-full sm:w-auto h-14 px-8 rounded-full bg-gradient-to-r from-gold to-yellow-600 text-white hover:shadow-2xl hover:shadow-gold/50 transition-all duration-300 text-lg font-bold"
                        >
                            <Link href="/inscription">
                                <Sparkles className="mr-2 h-5 w-5" />
                                Booster maintenant
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Footer info */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
                <CardContent className="p-6 text-center">
                    <p className="text-sm text-slate-600">
                        <strong className="text-anthracite">Besoin d'un conseil personnalisé ?</strong>
                        <br />
                        Contactez notre équipe sur WhatsApp au <strong className="text-gold">+225 07 07 75 62 97</strong>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
