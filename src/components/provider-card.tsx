import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/database.types";
import { getOptimizedImageUrl } from "@/lib/image-utils";
import { isPremiumActive } from "@/lib/premium";

interface ProviderCardProps {
    provider: Profile;
    showServices?: boolean;
}

/**
 * Carte prestataire "Clean Card" - Style Luxe Éditorial
 * - Pas de bordures, ombre diffuse au survol
 * - Image carrée coins arrondis
 * - Typographie minimaliste
 */
export function ProviderCard({ provider }: ProviderCardProps) {
    const isPremium = isPremiumActive(provider);

    // Initiales
    const initials = provider.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    // Label catégorie
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

    // URL optimisée pour les cartes (400x400, qualité medium)
    const optimizedAvatarUrl = getOptimizedImageUrl(provider.avatar_url, 'card', 'medium');

    return (
        <Link href={`/prestataire/${provider.slug}`} className="group block h-full">
            <Card className="h-full border border-transparent shadow-none bg-transparent hover:bg-white hover:border-gold/20 transition-all duration-500 ease-out hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.15)] rounded-2xl overflow-hidden">
                <CardContent className="p-4 flex flex-col h-full gap-4">
                    {/* Image / Avatar Aspect Square */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface/50">
                        {provider.avatar_url ? (
                            <Image
                                src={optimizedAvatarUrl}
                                alt={provider.full_name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
                                loading="lazy"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gold/5 text-gold font-serif text-4xl">
                                {initials}
                            </div>
                        )}

                        {/* Badge Premium Flottant Minimaliste */}
                        {isPremium && (
                            <div className="absolute top-3 right-3 flex items-center justify-center h-8 w-8 rounded-full bg-white/90 backdrop-blur text-gold shadow-sm">
                                <Sparkles className="h-4 w-4 fill-gold" />
                            </div>
                        )}

                        {/* Badge Recommandations (visible au hover ou toujours si mobile) */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-medium text-anthracite shadow-sm">
                            <Heart className="h-3 w-3 fill-gold text-gold" />
                            <span>{provider.recommendations_count || 0}</span>
                        </div>
                    </div>

                    {/* Informations Minimalistes */}
                    <div className="flex flex-col flex-1">
                        {/* Catégorie Tiny Uppercase */}
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase">
                                {categoryLabels[provider.category] || provider.category}
                            </span>
                        </div>

                        {/* Nom Serif */}
                        <h3 className="font-serif text-xl font-medium text-anthracite leading-tight mb-2 group-hover:text-gold transition-colors">
                            {provider.full_name}
                        </h3>

                        {/* Localisation Discrète */}
                        <div className="mt-auto flex items-center justify-between pt-2 border-t border-transparent group-hover:border-border/30 transition-colors duration-500">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate max-w-[120px]">
                                    {provider.neighborhood ? provider.neighborhood : provider.city}
                                </span>
                            </div>

                            {/* Action Arrow (Ghost) */}
                            <div className="transform translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                <ArrowRight className="h-4 w-4 text-gold" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
