import Script from "next/script";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SafeImage } from "@/components/ui/safe-image";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    Heart,
    MapPin,
    Crown,
    CheckCircle2,
    Star,
    ShieldCheck,
    Instagram,
    MessageCircle,
} from "lucide-react";
import { ViewHours } from "@/components/public/view-hours";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase-server";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { LikeButton } from "@/components/like-button";
import { ShareButton } from "@/components/share-button";
import { ProfileViewTracker } from "@/components/profile-view-tracker";
import type { Profile, Service, PortfolioImage } from "@/lib/database.types";

import { getOptimizedImageUrl } from "@/lib/image-utils";
import { getProfileGradient } from "@/lib/design-utils";
import { isPremiumActive } from "@/lib/premium";

// Labels des catégories
const categoryLabels: Record<string, string> = {
    coiffure: "Coiffure",
    makeup: "Maquillage",
    ongles: "Onglerie", // Ancienne valeur pour rétrocompatibilité
    onglerie: "Onglerie",
    regard: "Regard",
    soins: "Soins & Esthétique",
    spa: "Bien-être & Spa",
    henne: "Henné",
    barber: "Barber",
};

interface ProfileWithDetails extends Profile {
    services: Service[];
    portfolio_images: PortfolioImage[];
}

async function getProfile(slug: string): Promise<ProfileWithDetails | null> {
    const supabase = await createClient();
    if (!supabase) return null;

    const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("slug", slug)
        .eq("status", "active")
        .single();

    if (!profileData) return null;

    const profile = profileData as unknown as Profile;

    const { data: servicesData } = await supabase
        .from("services")
        .select("*")
        .eq("profile_id", profile.id)
        .order("price", { ascending: true });

    const { data: portfolioData } = await supabase
        .from("portfolio_images")
        .select("*")
        .eq("profile_id", profile.id)
        .order("created_at", { ascending: false });

    return {
        ...profile,
        services: (servicesData ?? []) as Service[],
        portfolio_images: (portfolioData ?? []) as PortfolioImage[],
    };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const profile = await getProfile(slug);
    if (!profile) return { title: "Profil non trouvé" };
    return {
        title: `${profile.full_name} - ${categoryLabels[profile.category] || "Beauté"}`,
        description: profile.bio?.substring(0, 160),
    };
}

export default async function ProviderProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const profile = await getProfile(slug);

    if (!profile) notFound();

    const isPremium = isPremiumActive(profile);
    const initials = profile.full_name.slice(0, 2).toUpperCase();
    const avatarImage = getOptimizedImageUrl(profile.avatar_url, 'avatar', 'high');

    // Construction du Schema.org (LocalBusiness / BeautySalon)
    const minPrice = profile.services.length > 0 ? Math.min(...profile.services.map(s => s.price)) : 0;
    const maxPrice = profile.services.length > 0 ? Math.max(...profile.services.map(s => s.price)) : 0;
    const priceRange = minPrice > 0 ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}` : "Sur devis";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BeautySalon",
        name: profile.full_name,
        image: [avatarImage || "https://maisonnubi.ci/og-image.jpg"],
        description: profile.bio || `Découvrez ${profile.full_name}, professionnel de la beauté à Abidjan.`,
        address: {
            "@type": "PostalAddress",
            streetAddress: profile.neighborhood,
            addressLocality: profile.city || "Abidjan",
            addressRegion: "Abidjan",
            addressCountry: "CI"
        },
        priceRange: priceRange,
        url: `https://maisonnubi.ci/prestataire/${profile.slug}`,
        telephone: profile.whatsapp ? `+225${profile.whatsapp}` : undefined,
    };

    const gradientClass = getProfileGradient(slug);

    return (
        <div className="min-h-screen bg-white font-sans pb-20 selection:bg-gold/20">
            <Script
                id="json-ld-profile"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <ProfileViewTracker profileId={profile.id} />

            {/* === 1. HERO SECTION === */}
            <div className={`relative h-[25vh] lg:h-[35vh] w-full ${gradientClass} overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay" />

                <div className="container mx-auto px-4 relative h-full">
                    <div className="absolute top-6 left-4 z-20">
                        <Button asChild variant="ghost" size="sm" className="rounded-full bg-white/10 backdrop-blur-xl text-white border border-white/20 hover:bg-white/20 transition-all">
                            <Link href="/recherche">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Retour
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 relative">

                {/* === 2. BLOC IDENTITÉ === */}
                <div className="-mt-16 mb-12 flex flex-col md:flex-row items-center md:items-end gap-6 relative z-10">

                    {/* AVATAR */}
                    <div className="relative shrink-0 transition-transform hover:scale-105 duration-300">
                        <div className="h-36 w-36 rounded-full p-1.5 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                            <Avatar className="h-full w-full border border-gray-50">
                                <AvatarImage src={avatarImage || undefined} className="object-cover" />
                                <AvatarFallback className="bg-anthracite text-white text-4xl font-serif">{initials}</AvatarFallback>
                            </Avatar>
                        </div>
                        {isPremium && (
                            <div className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-gold text-white shadow-xl border-4 border-white animate-in zoom-in duration-500" title="Premium">
                                <Crown className="h-4 w-4 fill-current" />
                            </div>
                        )}
                    </div>

                    {/* INFOS PRINCIPALES */}
                    <div className="flex-1 w-full text-center md:text-left">
                        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-center md:justify-start gap-3">
                                    <Badge className="bg-gold/10 text-gold-dark border-gold/20 hover:bg-gold/20 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">
                                        {categoryLabels[profile.category] || "Beauté"}
                                    </Badge>

                                    {(profile.recommendations_count || 0) > 0 && (
                                        <div className="flex items-center gap-1.5 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                                            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
                                            <span className="text-rose-700 text-sm font-bold">{profile.recommendations_count}</span>
                                        </div>
                                    )}
                                </div>

                                <h1 className="font-serif text-4xl md:text-6xl font-black text-anthracite tracking-tight">
                                    {profile.full_name}
                                </h1>

                                <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 font-medium">
                                    <MapPin className="h-4 w-4 text-gold" />
                                    <span>{profile.neighborhood ? `${profile.neighborhood}, ` : ""}{profile.city}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto justify-center">
                                <div className="flex gap-2">
                                    <LikeButton profileId={profile.id} initialCount={profile.recommendations_count || 0} />
                                    <ShareButton
                                        url={`https://maisonnubi.ci/prestataire/${profile.slug}`}
                                        title={`Découvrez ${profile.full_name} sur Maison Nubi`}
                                    />
                                </div>
                                <WhatsAppButton
                                    whatsapp={profile.whatsapp}
                                    providerEmail={profile.email || ''}
                                    providerName={profile.full_name}
                                    category={categoryLabels[profile.category]}
                                    className="flex-1 h-12 px-6 rounded-full bg-[#25D366] hover:bg-[#20BD5C] text-white font-bold transition-all shadow-xl hover:shadow-[#25D366]/30"
                                >
                                    <MessageCircle className="mr-2 h-5 w-5" />
                                    Discuter sur WhatsApp
                                </WhatsAppButton>
                            </div>
                        </div>
                    </div>
                </div>

                {/* === 3. CONTENU (GRID) === */}
                <div className="grid lg:grid-cols-12 gap-12">

                    {/* GAUCHE */}
                    <div className="lg:col-span-8 space-y-16">

                        {/* Bio */}
                        {profile.bio && (
                            <section className="relative">
                                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gold/20 rounded-full" />
                                <h2 className="font-serif text-2xl text-anthracite mb-4 font-bold">L'univers</h2>
                                <p className="text-slate-600 leading-relaxed text-xl font-light italic">
                                    « {profile.bio} »
                                </p>
                            </section>
                        )}

                        {/* Services Style "Menu" */}
                        {profile.services.length > 0 && (
                            <section className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                                <h2 className="font-serif text-3xl text-anthracite mb-8 font-bold">Carte des Prestations</h2>
                                <div className="space-y-6">
                                    {profile.services.map((service) => (
                                        <div key={service.id} className="flex items-end justify-between group cursor-default">
                                            <div className="flex-1 mr-4">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="font-bold text-anthracite group-hover:text-gold transition-colors">{service.title}</span>
                                                    <div className="flex-1 border-b border-dotted border-slate-300 mb-1" />
                                                </div>
                                                {/* Description de service si ajoutée un jour à la DB */}
                                                <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Soin signature</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-serif text-lg font-black text-anthracite">
                                                    {formatPrice(service.price)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Galerie Modernisée */}
                        {profile.portfolio_images && profile.portfolio_images.length > 0 && (
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="font-serif text-3xl text-anthracite font-bold">Portfolio</h2>
                                    <div className="h-px flex-1 bg-slate-100" />
                                </div>
                                <div className="columns-2 md:columns-3 gap-4 space-y-4">
                                    {profile.portfolio_images.map((image, idx) => (
                                        <div key={image.id} className="relative rounded-2xl overflow-hidden group bg-slate-100 break-inside-avoid shadow-sm hover:shadow-xl transition-all duration-500 min-h-[200px]">
                                            <SafeImage
                                                src={image.image_url}
                                                alt={`Réalisation ${idx + 1}`}
                                                width={500}
                                                height={500}
                                                className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* DROITE : Sidebar Sticky */}
                    <div className="lg:col-span-4">
                        <aside className="sticky top-28 space-y-6">
                            <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white/80 backdrop-blur-xl ring-1 ring-slate-100 overflow-hidden rounded-[2rem]">
                                <div className="h-2 bg-gold w-full" />
                                <CardContent className="p-8 space-y-8">
                                    <div>
                                        <h3 className="font-serif text-xl font-bold text-anthracite mb-6">Contact & Horaires</h3>

                                        {/* Réseaux Sociaux */}
                                        {(profile.instagram_handle || profile.tiktok_handle) && (
                                            <div className="mb-6">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Suivez-moi</p>
                                                <div className="flex gap-3">
                                                    {profile.instagram_handle && (
                                                        <a
                                                            href={`https://instagram.com/${profile.instagram_handle}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white hover:scale-110 transition-transform shadow-md"
                                                            title="Instagram"
                                                        >
                                                            <Instagram className="h-5 w-5" />
                                                        </a>
                                                    )}
                                                    {profile.tiktok_handle && (
                                                        <a
                                                            href={`https://tiktok.com/@${profile.tiktok_handle}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-center h-11 w-11 rounded-xl bg-black text-white hover:scale-110 transition-transform shadow-md"
                                                            title="TikTok"
                                                        >
                                                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                                                            </svg>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <ViewHours profileId={profile.id} />
                                    </div>

                                    <div className="flex gap-4 items-start">
                                        <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold shrink-0">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div className="text-sm">
                                            <p className="font-bold text-anthracite mb-1">Localisation</p>
                                            <p className="text-slate-500 leading-relaxed">
                                                {profile.address_details || (
                                                    <>
                                                        {profile.neighborhood}<br />
                                                        {profile.city}, Côte d'Ivoire
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {isPremium && (
                                        <div className="bg-emerald-50/50 rounded-2xl p-4 flex gap-4 items-center border border-emerald-100">
                                            <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-200">
                                                <CheckCircle2 className="h-5 w-5" />
                                            </div>
                                            <p className="text-[11px] text-emerald-900 font-bold uppercase tracking-wider">Établissement certifié</p>
                                        </div>
                                    )}

                                    <WhatsAppButton
                                        whatsapp={profile.whatsapp}
                                        providerEmail={profile.email || ''}
                                        providerName={profile.full_name}
                                        category={categoryLabels[profile.category]}
                                        variant="fixed"
                                        className="w-full h-14 text-base font-black shadow-[#25D366]/30 bg-[#25D366] hover:bg-[#20BD5C]"
                                    >
                                        <MessageCircle className="mr-2 h-5 w-5" />
                                        Discuter sur WhatsApp
                                    </WhatsAppButton>

                                    <div className="text-center space-y-2">
                                        <p className="text-xs text-slate-600 font-bold">
                                            💬 Contact direct et rapide
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            Réponse généralement en moins d'une heure
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Badge additionnel */}
                            <div className="px-8 flex items-center gap-2 text-slate-400">
                                <MessageCircle className="h-4 w-4" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Contact direct et sécurisé</span>
                            </div>
                        </aside>
                    </div>

                </div>
            </div>

            {/* === 4. MOBILE STICKY BOOKING BAR (Visible uniquement mobile) === */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-50 md:hidden animate-in slide-in-from-bottom-5 fade-in duration-500">
                <WhatsAppButton
                    whatsapp={profile.whatsapp}
                    providerEmail={profile.email || ''}
                    providerName={profile.full_name}
                    category={categoryLabels[profile.category]}
                    variant="fixed"
                    className="w-full h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5C] text-white font-bold shadow-lg shadow-[#25D366]/20 flex items-center justify-center text-lg active:scale-95 transition-transform"
                >
                    <MessageCircle className="mr-2 h-6 w-6" />
                    Discuter (WhatsApp)
                </WhatsAppButton>
            </div>
        </div >
    );
}