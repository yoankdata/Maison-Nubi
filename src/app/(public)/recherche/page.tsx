"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, MapPin, Sparkles, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ProviderCard } from "@/components/provider-card";
import { supabase } from "@/lib/supabase";
import type { Profile, Category } from "@/lib/database.types";
import { motion } from "framer-motion";

// Options de filtres
const CATEGORIES: { value: Category | "all"; label: string }[] = [
    { value: "all", label: "Tout voir" },
    { value: "coiffure", label: "Coiffure" },
    { value: "makeup", label: "Maquillage" },
    { value: "onglerie", label: "Onglerie" },
    { value: "regard", label: "Regard" },
    { value: "soins", label: "Soins & Esthétique" },
    { value: "spa", label: "Bien-être & Spa" },
    { value: "henne", label: "Henné" },
    { value: "barber", label: "Barber" },
];

const NEIGHBORHOODS = [
    "Tous les quartiers",
    "Cocody Angré",
    "Cocody Danga",
    "Marcory Zone 4",
    "Plateau",
    "Riviera Faya",
    "Yopougon",
    "Treichville",
    "Adjamé",
    "Koumassi",
];

// ============================================
// RECHERCHE INTELLIGENTE
// Parse une requête comme "Tresses à Cocody pas cher"
// ============================================

// Mots-clés associés à chaque catégorie
const CATEGORY_KEYWORDS: Record<Category, string[]> = {
    coiffure: ["tresse", "tresses", "coiffure", "cheveux", "tissage", "locks", "braids", "nappy", "défrisage", "coiffeuse", "coiffeur"],
    makeup: ["maquillage", "makeup", "make-up", "mariée", "mariage", "teint", "contouring", "maquilleuse"],
    onglerie: ["ongles", "ongle", "manucure", "pédicure", "nail", "nails", "gel", "vernis", "pose", "capsules", "onglerie"],
    regard: ["cils", "sourcils", "regard", "extension", "microblading", "brow", "lash", "lashes", "rehaussement"],
    soins: ["soin", "soins", "facial", "visage", "corps", "gommage", "peeling", "esthétique", "épilation"],
    spa: ["spa", "massage", "bien-être", "détente", "relaxation", "hammam", "sauna", "rituel"],
    henne: ["henné", "henne", "tatouage", "jagua", "body art", "temporaire", "henna"],
    barber: ["barber", "barbier", "barbe", "coupe homme", "dégradé", "fade", "homme"],
};

// Mots-clés de localisation
const LOCATION_KEYWORDS: Record<string, string[]> = {
    "Cocody Angré": ["cocody", "angré", "angre"],
    "Cocody Danga": ["danga"],
    "Marcory Zone 4": ["marcory", "zone 4", "zone4"],
    "Plateau": ["plateau"],
    "Riviera Faya": ["riviera", "faya"],
    "Yopougon": ["yopougon", "yop"],
    "Treichville": ["treichville"],
    "Adjamé": ["adjamé", "adjame"],
    "Koumassi": ["koumassi"],
};

interface ParsedQuery {
    searchTerms: string;
    detectedCategory: Category | null;
    detectedLocation: string | null;
}

/**
 * Parse une requête de recherche naturelle
 * Ex: "Tresses à Cocody pas cher" → { searchTerms: "pas cher", detectedCategory: "coiffure", detectedLocation: "Cocody Angré" }
 */
function parseSearchQuery(query: string): ParsedQuery {
    const lowerQuery = query.toLowerCase().trim();
    let searchTerms = lowerQuery;
    let detectedCategory: Category | null = null;
    let detectedLocation: string | null = null;

    // Détecter la catégorie
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        for (const keyword of keywords) {
            if (lowerQuery.includes(keyword)) {
                detectedCategory = category as Category;
                // Retirer le mot-clé de la recherche
                searchTerms = searchTerms.replace(new RegExp(keyword, 'gi'), '').trim();
                break;
            }
        }
        if (detectedCategory) break;
    }

    // Détecter la localisation
    for (const [location, keywords] of Object.entries(LOCATION_KEYWORDS)) {
        for (const keyword of keywords) {
            if (lowerQuery.includes(keyword)) {
                detectedLocation = location;
                // Retirer le mot-clé de la recherche
                searchTerms = searchTerms.replace(new RegExp(keyword, 'gi'), '').trim();
                break;
            }
        }
        if (detectedLocation) break;
    }

    // Nettoyer les mots de liaison restants
    searchTerms = searchTerms
        .replace(/\b(à|a|au|aux|de|du|des|le|la|les|un|une|pas|cher|et|ou)\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

    return { searchTerms, detectedCategory, detectedLocation };
}

// Composant Skeleton pour le chargement
const ProviderCardSkeleton = () => (
    <div className="rounded-xl border border-border/40 bg-white p-4 h-[380px] flex flex-col gap-4">
        <div className="h-48 w-full bg-gray-100 animate-pulse rounded-lg" />
        <div className="space-y-2">
            <div className="h-4 w-3/4 bg-gray-100 animate-pulse rounded" />
            <div className="h-3 w-1/2 bg-gray-100 animate-pulse rounded" />
        </div>
        <div className="mt-auto h-10 w-full bg-gray-100 animate-pulse rounded-full" />
    </div>
);

function SearchPageContent() {
    const searchParams = useSearchParams();

    // États Données
    const [providers, setProviders] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // États Filtres
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
        (searchParams.get("category") as Category) || "all"
    );
    const [selectedNeighborhood, setSelectedNeighborhood] = useState("Tous les quartiers");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Debounce de la recherche texte
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 400); // 400ms pour être un peu moins sensible
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch des données avec recherche intelligente
    useEffect(() => {
        let isMounted = true;

        async function fetchProviders() {
            setIsLoading(true);
            setError(null);

            if (!supabase) {
                if (isMounted) {
                    setError("Configuration manquante.");
                    setIsLoading(false);
                }
                return;
            }

            try {
                // Parser la requête pour détecter catégorie et lieu automatiquement
                const parsed = debouncedQuery ? parseSearchQuery(debouncedQuery) : null;

                // Utiliser les filtres détectés automatiquement OU les filtres manuels
                const effectiveCategory = parsed?.detectedCategory || (selectedCategory !== "all" ? selectedCategory : null);
                const effectiveLocation = parsed?.detectedLocation || (selectedNeighborhood !== "Tous les quartiers" ? selectedNeighborhood : null);
                const searchTerms = parsed?.searchTerms || "";

                let query = supabase
                    .from("profiles")
                    .select("*")
                    .eq("status", "active")
                    .order("is_premium", { ascending: false }) // Premium d'abord
                    .order("rating", { ascending: false })     // Mieux notés ensuite
                    .limit(50); // Sécurité performance

                // Appliquer le filtre catégorie (détecté ou manuel)
                if (effectiveCategory) {
                    query = query.eq("category", effectiveCategory);
                }

                // Appliquer le filtre localisation (détecté ou manuel)
                if (effectiveLocation) {
                    query = query.eq("neighborhood", effectiveLocation);
                }

                // Recherche texte sur les termes restants
                if (searchTerms) {
                    query = query.or(`full_name.ilike.%${searchTerms}%,bio.ilike.%${searchTerms}%`);
                }

                const { data, error: supabaseError } = await query;

                if (supabaseError) throw supabaseError;

                if (isMounted) {
                    setProviders((data as unknown as Profile[]) || []);
                }
            } catch (err) {
                console.error("Erreur Supabase:", err);
                if (isMounted) setError("Erreur lors du chargement des profils.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        fetchProviders();

        return () => { isMounted = false; };
    }, [selectedCategory, selectedNeighborhood, debouncedQuery]);

    // Reset des filtres
    const resetFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
        setSelectedNeighborhood("Tous les quartiers");
        setIsFilterOpen(false);
    };

    const activeFiltersCount =
        (selectedCategory !== "all" ? 1 : 0) +
        (selectedNeighborhood !== "Tous les quartiers" ? 1 : 0);

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header de Recherche Sticky (Relative sur mobile pour éviter conflit avec Navbar) */}
            <div className="relative md:sticky top-0 md:top-16 z-30 bg-white/80 backdrop-blur-xl border-b border-border/40 transition-all">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row gap-3 items-center">

                        {/* Barre de recherche */}
                        <div className="relative w-full md:max-w-lg group transition-all">
                            <div className="absolute inset-0 bg-gold/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative flex items-center bg-white rounded-full border border-border shadow-sm hover:shadow-md hover:border-gold/30 transition-all h-12 px-4">
                                <Search className="h-5 w-5 text-muted-foreground group-hover:text-gold transition-colors mr-3" />
                                <Input
                                    type="text"
                                    placeholder="Ex: Tresses à Cocody, Maquillage mariée..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="border-none shadow-none focus-visible:ring-0 bg-transparent flex-1 h-full text-base placeholder:text-muted-foreground/70"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Filtres Desktop */}
                        <div className="hidden md:flex items-center gap-2 flex-1 justify-end">
                            <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as Category | "all")}>
                                <SelectTrigger className="w-[160px] rounded-full h-11 bg-white border-border hover:border-gold/50 transition-colors">
                                    <SelectValue placeholder="Catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedNeighborhood} onValueChange={setSelectedNeighborhood}>
                                <SelectTrigger className="w-[180px] rounded-full h-11 bg-white border-border hover:border-gold/50 transition-colors">
                                    <div className="flex items-center truncate">
                                        <MapPin className="h-4 w-4 mr-2 text-gold shrink-0" />
                                        <span className="truncate">{selectedNeighborhood === "Tous les quartiers" ? "Quartier" : selectedNeighborhood}</span>
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    {NEIGHBORHOODS.map((n) => (
                                        <SelectItem key={n} value={n}>{n}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {activeFiltersCount > 0 && (
                                <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground hover:text-red-500 rounded-full px-3">
                                    Effacer
                                </Button>
                            )}
                        </div>

                        {/* Mobile Filter Trigger */}
                        <div className="md:hidden w-full flex justify-between items-center mt-1">
                            <span className="text-sm text-muted-foreground font-medium">
                                {providers.length > 0 ? `${providers.length} résultats` : 'Aucun résultat'}
                            </span>
                            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm" className="rounded-full border-border bg-white gap-2 shadow-sm">
                                        <Filter className="h-4 w-4" />
                                        Filtres
                                        {activeFiltersCount > 0 && (
                                            <Badge className="bg-gold h-5 w-5 p-0 flex items-center justify-center text-[10px] ml-1">
                                                {activeFiltersCount}
                                            </Badge>
                                        )}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="bottom" className="rounded-t-[2rem] h-[85vh]">
                                    <SheetHeader className="text-left mb-6">
                                        <SheetTitle className="font-serif text-2xl">Filtres</SheetTitle>
                                    </SheetHeader>

                                    <div className="space-y-8 py-4">
                                        {/* Catégories Mobile */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Catégories</label>
                                            <div className="flex flex-wrap gap-2">
                                                {CATEGORIES.map((cat) => (
                                                    <button
                                                        key={cat.value}
                                                        onClick={() => setSelectedCategory(cat.value)}
                                                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${selectedCategory === cat.value
                                                            ? "bg-gold/10 border-gold text-gold-dark"
                                                            : "bg-gray-50 border-transparent text-anthracite hover:bg-gray-100"
                                                            }`}
                                                    >
                                                        {cat.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Quartiers Mobile */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Localisation</label>
                                            <Select value={selectedNeighborhood} onValueChange={setSelectedNeighborhood}>
                                                <SelectTrigger className="w-full h-12 rounded-xl bg-gray-50 border-0">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {NEIGHBORHOODS.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <SheetFooter className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-border flex flex-row gap-3">
                                        <Button variant="outline" onClick={resetFilters} className="flex-1 h-12 rounded-full border-2">
                                            Réinitialiser
                                        </Button>
                                        <SheetClose asChild>
                                            <Button className="flex-1 h-12 rounded-full bg-anthracite hover:bg-anthracite/90 text-white">
                                                Afficher ({providers.length})
                                            </Button>
                                        </SheetClose>
                                    </SheetFooter>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grille de Résultats */}
            <div className="container mx-auto px-4 py-8">
                {/* Loader Squelette */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <ProviderCardSkeleton key={i} />
                        ))}
                    </div>
                ) : error ? (
                    /* État d'erreur */
                    <div className="text-center py-20">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                            <X className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-medium text-anthracite">Une erreur est survenue</h3>
                        <p className="text-muted-foreground mt-1 mb-4">{error}</p>
                        <Button onClick={() => window.location.reload()} variant="outline">Réessayer</Button>
                    </div>
                ) : providers.length > 0 ? (
                    /* Liste des résultats */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {providers.map((provider, index) => (
                            <motion.div
                                key={provider.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                            >
                                <ProviderCard provider={provider} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    /* État Vide (Empty State) */
                    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full" />
                            <div className="relative h-20 w-20 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-border/50">
                                <Search className="h-8 w-8 text-gold" />
                            </div>
                        </div>
                        <h3 className="font-serif text-2xl text-anthracite mb-2">Aucun talent trouvé</h3>
                        <p className="text-muted-foreground max-w-sm mb-8">
                            Nous n'avons trouvé aucun prestataire correspondant à vos critères "{searchQuery}" à {selectedNeighborhood}.
                        </p>
                        <Button
                            onClick={resetFilters}
                            size="lg"
                            className="rounded-full bg-anthracite hover:bg-gold transition-colors duration-300"
                        >
                            Voir tous les talents
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Wrapper Suspense obligatoire pour useSearchParams
export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen pt-24 px-4 container mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => <ProviderCardSkeleton key={i} />)}
                </div>
            </div>
        }>
            <SearchPageContent />
        </Suspense>
    );
}
