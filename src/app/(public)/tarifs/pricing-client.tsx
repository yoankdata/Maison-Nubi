"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Check, X, Crown, Sparkles, Zap, TrendingUp, HelpCircle,
    Instagram, Gift, CheckCircle2, CreditCard, Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Configuration des features
const features = [
    { name: "Profil visible 24/7", free: true, gold: true },
    { name: "Bouton WhatsApp direct", free: true, gold: true },
    { name: "Galerie photos", free: "3 photos", gold: "Illimitée" },
    { name: "Position prioritaire (Top 3)", free: false, gold: true },
    { name: 'Badge "Vérifié & Premium"', free: false, gold: true },
    { name: "Statistiques d'audience", free: false, gold: true },
    { name: "Support personnalisé", free: false, gold: true },
];

export default function PricingClient() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("annually");

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#D4AF37] selection:text-white">

            {/* --- 1. HERO SECTION --- */}
            <section className="relative pt-24 pb-20 overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/40 via-slate-50 to-slate-50 pointer-events-none" />

                <div className="container relative mx-auto px-4 text-center z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-200 bg-amber-50 text-[#B4922B] text-xs font-bold uppercase tracking-wider mb-6">
                        <Sparkles className="w-3 h-3" />
                        L'excellence de la beauté ivoirienne
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight mb-6 text-slate-900">
                        Des tarifs simples pour <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B4922B] italic pr-2">
                            dominer votre marché
                        </span>
                    </h1>

                    <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-10">
                        Rejoignez l'élite des professionnels de la beauté à Abidjan. Choisissez le plan qui propulsera votre salon au niveau supérieur.
                    </p>

                    {/* Toggle Facturation */}
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="relative">
                            <Tabs defaultValue="annually" value={billingCycle} onValueChange={(v) => setBillingCycle(v as any)} className="w-[320px]">
                                <TabsList className="grid w-full grid-cols-2 rounded-full h-14 bg-white border border-slate-200 p-1.5 shadow-sm">
                                    <TabsTrigger value="monthly" className="rounded-full h-full text-sm font-medium data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all">
                                        Mensuel
                                    </TabsTrigger>
                                    <TabsTrigger value="annually" className="rounded-full h-full text-sm font-bold data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white transition-all">
                                        Annuel (-20%)
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                            {/* Petit badge promo flottant */}
                            <div className="absolute -right-6 -top-4 rotate-12 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-md border border-green-200 shadow-sm">
                                -20%
                            </div>
                        </div>

                        <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                            <Gift className="w-4 h-4 text-[#D4AF37]" />
                            <span className="text-slate-700">2 mois offerts</span> en paiement annuel
                        </p>
                    </div>
                </div>
            </section>

            {/* --- 2. MAIN PRICING CARDS --- */}
            <section className="pb-24 container mx-auto px-4">
                <div className="grid lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto items-start">

                    {/* Starter Card */}
                    <Card className="border border-slate-200 shadow-none hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm relative top-4">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-bold text-slate-700">Starter</CardTitle>
                            <CardDescription>L'essentiel pour être visible.</CardDescription>
                            <div className="mt-6 flex items-baseline">
                                <span className="text-4xl font-bold text-slate-900">0</span>
                                <span className="ml-1 text-slate-500 font-medium">FCFA/mois</span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-4">
                            <div className="space-y-4">
                                {features.map((f, i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm">
                                        {f.free ? (
                                            <CheckCircle2 className="w-5 h-5 text-slate-900 flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <X className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                                        )}
                                        <span className={f.free ? "text-slate-700" : "text-slate-400 line-through"}>
                                            {f.name} {typeof f.free === 'string' && <span className="font-bold text-slate-900">({f.free})</span>}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="p-8 pt-0">
                            <Button asChild variant="outline" className="w-full rounded-xl h-12 border-slate-200 hover:bg-slate-50 hover:text-slate-900 font-semibold">
                                <Link href="/inscription">Commencer gratuitement</Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Gold Card (Premium) */}
                    <Card className="relative border-[#D4AF37] border shadow-xl shadow-amber-500/5 flex flex-col bg-white">
                        <CardHeader className="p-8 pb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="text-2xl font-bold text-[#B4922B] flex items-center gap-2 font-serif">
                                    NUBI GOLD
                                </CardTitle>
                                <Crown className="w-6 h-6 text-[#D4AF37] fill-[#D4AF37]" />
                            </div>
                            <CardDescription className="text-[#B4922B]/80 font-medium">Pour remplir votre agenda.</CardDescription>

                            <div className="mt-6 flex items-baseline">
                                <span className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                                    {billingCycle === 'annually' ? '100 000' : '10 000'}
                                </span>
                                <span className="ml-2 text-slate-500 font-medium text-sm lg:text-base">FCFA / {billingCycle === 'annually' ? 'an' : 'mois'}</span>
                            </div>
                            {billingCycle === 'annually' && (
                                <p className="text-xs text-green-600 font-bold mt-2 bg-green-50 inline-block px-2 py-1 rounded">Économisez 20 000 FCFA</p>
                            )}
                        </CardHeader>

                        <CardContent className="p-8 pt-2 flex-grow">
                            <div className="space-y-5">
                                <p className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Tout inclus :</p>
                                {features.map((f, i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm group">
                                        <div className="w-5 h-5 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#D4AF37] transition-colors">
                                            <Check className="w-3 h-3 text-[#D4AF37] group-hover:text-white" />
                                        </div>
                                        <span className="text-slate-700 font-medium">
                                            {f.name} {typeof f.gold === 'string' && <span className="text-[#B4922B] font-bold">({f.gold})</span>}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>

                        <CardFooter className="p-8 pt-0 flex-col gap-4">
                            <Button asChild className="w-full rounded-xl h-14 bg-[#D4AF37] hover:bg-[#B4922B] text-white shadow-lg shadow-amber-500/20 text-lg font-bold transition-all hover:translate-y-[-2px]">
                                <Link href="/inscription" className="flex items-center gap-2">
                                    <Zap className="w-5 h-5 fill-current" /> Devenir Membre Gold
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* PRESTIGE CARD (NOUVEAU) */}
                    <Card className="relative border-slate-800 bg-slate-950 text-white shadow-2xl overflow-hidden transform md:-translate-y-4 transition-transform duration-300 hover:scale-[1.02]">

                        <CardHeader className="p-8 border-b border-white/10 bg-gradient-to-b from-slate-900 to-slate-950">
                            <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="text-2xl font-bold text-white flex items-center gap-2 font-serif">
                                    NUBI PRESTIGE
                                </CardTitle>
                            </div>
                            <CardDescription className="text-slate-400">Votre marque. Votre site. Vos clients.</CardDescription>

                            <div className="mt-6 flex items-baseline">
                                <span className="text-4xl lg:text-5xl font-bold text-[#D4AF37] tracking-tight">
                                    {billingCycle === 'annually' ? '400 000' : '35 000'}
                                </span>
                                <span className="ml-2 text-slate-400 font-medium text-sm lg:text-base">FCFA / {billingCycle === 'annually' ? 'an' : 'mois'}</span>
                            </div>
                        </CardHeader>

                        <CardContent className="p-8 flex-grow">
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Inclus Nubi Gold +</p>

                                    {/* BENEFIT: Site Web Propriétaire */}
                                    <div className="flex items-start gap-3 text-sm">
                                        <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                                        <span className="font-bold text-white">Votre Propre Site Web (.ci) <span className="text-slate-500 font-normal block text-xs mt-0.5">Actif 100% à vous</span></span>
                                    </div>

                                    {/* BENEFIT: Réservations (Résultat) */}
                                    <div className="flex items-start gap-3 text-sm">
                                        <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                                        <span className="font-bold text-white">10-20 Réservations / mois <span className="text-slate-500 font-normal block text-xs mt-0.5">Estimation sans commission</span></span>
                                    </div>

                                    {/* BENEFIT: Propriété Data */}
                                    <div className="flex items-start gap-3 text-sm">
                                        <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-300">Vos clients vous appartiennent</span>
                                    </div>

                                    {/* BENEFIT: Visibilité Locale */}
                                    <div className="flex items-start gap-3 text-sm">
                                        <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-300">Google Maps & SEO Local</span>
                                    </div>

                                    {/* BENEFIT: Maintenance */}
                                    <div className="flex items-start gap-3 text-sm">
                                        <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-300">Maintenance Technique incluse</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="p-8 pt-0 flex-col gap-4">
                            <Button asChild className="w-full rounded-xl h-14 bg-white hover:bg-slate-200 text-slate-950 text-lg font-bold transition-all shadow-lg shadow-white/5">
                                <Link
                                    href="https://wa.me/33760164998?text=Bonjour%2C%20je%20souhaite%20cr%C3%A9er%20mon%20site%20maintenant%20avec%20l'offre%20Maison%20Nubi%20PRESTIGE."
                                    target="_blank"
                                >
                                    Créer mon site maintenant
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>

                </div>
            </section>

            {/* --- 3. SERVICES EXCLUSIFS (DARK THEME) --- */}
            <section className="bg-[#0f172a] py-24 md:py-32 relative overflow-hidden">
                {/* Texture Noise & Glows */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <Badge className="bg-white/10 text-white border-white/20 mb-6 px-4 py-1.5 hover:bg-white/20 transition-colors">
                            À LA CARTE
                        </Badge>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                            Besoin d'un coup de pouce <br /><span className="text-[#D4AF37] italic">ponctuel ?</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">

                        {/* SERVICE 1 : Instagram */}
                        <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 flex flex-col justify-between hover:bg-white/10 transition-all duration-500">
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white">
                                        <Instagram className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-bold text-white/60 uppercase tracking-widest">24h Express</span>
                                </div>
                                <h3 className="text-3xl font-serif font-bold text-white mb-4">Conciergerie Insta</h3>
                                <p className="text-slate-300 mb-8 leading-relaxed">
                                    Transformez votre profil Instagram en aimant à clients avec une optimisation professionnelle.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    {["Bio stratégique & Liens", "Highlights (Stories à la une)", "Harmonisation Feed", "Modèles de posts"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-200">
                                            <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                                            <span className="text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="pt-8 border-t border-white/10">
                                <div className="flex items-end gap-2 mb-6">
                                    <span className="text-4xl font-bold text-white">20.000</span>
                                    <span className="text-sm font-medium text-slate-400 pb-1">FCFA / unique</span>
                                </div>
                                <Button asChild className="w-full h-12 rounded-full bg-white text-slate-900 hover:bg-[#D4AF37] hover:text-white transition-all duration-300 font-bold">
                                    <Link href="https://wa.me/2250707756297" target="_blank">
                                        Commander le pack
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* SERVICE 2 : Boost (Petit prix) */}
                        <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-[2rem] p-8 flex flex-col justify-between shadow-lg hover:border-[#D4AF37]/50 transition-colors duration-500">
                            <div className="absolute top-4 right-4 bg-[#D4AF37] text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse">
                                NEW
                            </div>
                            <div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-[#D4AF37]" fill="currentColor" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-white mb-4">Boost Visibilité 7J</h3>
                                <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                                    Besoin d'un coup de projecteur rapide ? Testez la puissance du Premium pendant une semaine sans engagement.
                                </p>
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="bg-slate-800/50 p-3 rounded-lg flex items-center gap-3 border border-slate-700">
                                        <Crown className="w-4 h-4 text-[#D4AF37]" />
                                        <span className="text-sm text-slate-200">Badge Premium</span>
                                    </div>
                                    <div className="bg-slate-800/50 p-3 rounded-lg flex items-center gap-3 border border-slate-700">
                                        <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                                        <span className="text-sm text-slate-200">Top 3 Recherche</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-8 mt-4 border-t border-slate-700">
                                <div className="flex items-end gap-2 mb-6">
                                    <span className="text-4xl font-bold text-[#D4AF37]">5.000</span>
                                    <span className="text-sm font-medium text-slate-400 pb-1">FCFA / 7 jours</span>
                                </div>
                                <Button asChild className="w-full h-12 rounded-full border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all duration-300 font-bold bg-transparent">
                                    <Link href="/inscription">
                                        Activer le boost
                                    </Link>
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- 4. RENTABILITÉ & RÉASSURANCE --- */}
            <section className="py-24 container mx-auto px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif font-bold mb-4">Retour sur investissement immédiat</h2>
                        <p className="text-slate-500 italic">
                            "Un seul client gagné grâce à Nubi Gold suffit généralement à rentabiliser votre abonnement annuel."
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: CreditCard, title: "Carte Bancaire", desc: "Visa, Mastercard. Paiement sécurisé." },
                            { icon: Smartphone, title: "Mobile Money", desc: "Orange, MTN, Moov, Wave acceptés." },
                            { icon: Smartphone, title: "Wave Card", desc: "Compatible cartes virtuelles." },
                            { icon: HelpCircle, title: "Support Local", desc: "Équipe basée à Abidjan 7j/7." },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center group">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-400 group-hover:text-[#D4AF37] group-hover:bg-amber-50 transition-colors">
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                                <p className="text-xs text-slate-500 leading-tight px-2">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
