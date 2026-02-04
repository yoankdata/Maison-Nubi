"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    Search,
    Crown,
    Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateProfileStatus } from "@/app/actions/admin";

type Profile = {
    id: string;
    full_name: string;
    email: string;
    slug: string;
    category: string;
    city: string;
    neighborhood: string | null;
    status: "active" | "pending" | "banned";
    is_premium: boolean;
    avatar_url: string | null;
    created_at: string;
};

const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
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
    return labels[category] || category;
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "active":
            return "bg-green-100 text-green-700 border-green-200";
        case "pending":
            return "bg-amber-100 text-amber-700 border-amber-200";
        case "banned":
            return "bg-red-100 text-red-700 border-red-200";
        default:
            return "bg-gray-100 text-gray-700 border-gray-200";
    }
};

export default function AdminProfilesPage() {
    const searchParams = useSearchParams();
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>(
        searchParams.get("status") || "all"
    );
    const [categoryFilter, setCategoryFilter] = useState("all");

    // Chargement des profils
    useEffect(() => {
        loadProfiles();
    }, [statusFilter, categoryFilter]);

    const loadProfiles = async () => {
        if (!supabase) return;

        setLoading(true);

        let query = supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });

        // Filtres
        if (statusFilter !== "all") {
            query = query.eq("status", statusFilter);
        }

        if (categoryFilter !== "all") {
            query = query.eq("category", categoryFilter);
        }

        const { data, error } = await query;

        if (!error && data) {
            setProfiles(data as Profile[]);
        }

        setLoading(false);
    };

    // Actions de modération
    const handleStatusUpdate = async (
        profileId: string,
        newStatus: "active" | "pending" | "banned"
    ) => {
        // Optimistic update visual (optionnel, ou juste loading state)
        // Ici on va juste appeler l'action serveur

        const result = await updateProfileStatus(profileId, newStatus);

        if (result.error) {
            alert(result.error);
        } else {
            // Recharger la liste pour être sûr (l'action a fait un revalidatePath mais 
            // comme on est en client-side fetch, il faut refetcher ou attendre que le props change si c'était un RSC.
            // Ici, loadProfiles est manuel.)
            loadProfiles();
        }
    };

    // Filtrer par recherche
    const filteredProfiles = profiles.filter((profile) =>
        profile.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div>
                <h1 className="font-serif text-2xl font-bold text-anthracite">
                    Modération des Profils
                </h1>
                <p className="text-muted-foreground">
                    Gérez et modérez les profils prestataires
                </p>
            </div>

            {/* Filtres */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Recherche */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher par nom ou email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Filtre statut */}
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                <SelectItem value="pending">En attente</SelectItem>
                                <SelectItem value="active">Actifs</SelectItem>
                                <SelectItem value="banned">Bannis</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Filtre catégorie */}
                        <Select
                            value={categoryFilter}
                            onValueChange={setCategoryFilter}
                        >
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les catégories</SelectItem>
                                <SelectItem value="coiffure">Coiffure</SelectItem>
                                <SelectItem value="makeup">Maquillage</SelectItem>
                                <SelectItem value="onglerie">Onglerie</SelectItem>
                                <SelectItem value="regard">Regard</SelectItem>
                                <SelectItem value="soins">Soins & Esthétique</SelectItem>
                                <SelectItem value="spa">Bien-être & Spa</SelectItem>
                                <SelectItem value="henne">Henné</SelectItem>
                                <SelectItem value="barber">Barber</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Liste des profils */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gold" />
                </div>
            ) : filteredProfiles.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        Aucun profil trouvé
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filteredProfiles.map((profile) => (
                        <Card
                            key={profile.id}
                            className="hover:shadow-md transition-shadow"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    {/* Avatar */}
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={profile.avatar_url || undefined} />
                                        <AvatarFallback className="bg-gold/10 text-gold font-semibold">
                                            {profile.full_name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Infos */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-anthracite truncate">
                                                {profile.full_name}
                                            </h3>
                                            {profile.is_premium && (
                                                <Crown className="h-4 w-4 text-gold flex-shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {profile.email}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <Badge variant="outline" className="text-xs">
                                                {getCategoryLabel(profile.category)}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                {profile.city}
                                                {profile.neighborhood && ` - ${profile.neighborhood}`}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Statut & Actions */}
                                    <div className="flex flex-col md:flex-row items-end md:items-center gap-3">
                                        <Badge
                                            className={`${getStatusColor(profile.status)} border`}
                                        >
                                            {profile.status === "active" && "Actif"}
                                            {profile.status === "pending" && "En attente"}
                                            {profile.status === "banned" && "Banni"}
                                        </Badge>

                                        <div className="flex gap-2">
                                            {/* Voir le profil */}
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                            >
                                                <Link
                                                    href={`/prestataire/${profile.slug}`}
                                                    target="_blank"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>

                                            {/* Actions selon le statut */}
                                            {profile.status === "pending" && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                                        onClick={() =>
                                                            handleStatusUpdate(profile.id, "active")
                                                        }
                                                    >
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Valider
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                                        onClick={() =>
                                                            handleStatusUpdate(profile.id, "banned")
                                                        }
                                                    >
                                                        <XCircle className="h-3 w-3 mr-1" />
                                                        Rejeter
                                                    </Button>
                                                </>
                                            )}

                                            {profile.status === "active" && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                                    onClick={() =>
                                                        handleStatusUpdate(profile.id, "banned")
                                                    }
                                                >
                                                    <XCircle className="h-3 w-3 mr-1" />
                                                    Bannir
                                                </Button>
                                            )}

                                            {profile.status === "banned" && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                                    onClick={() =>
                                                        handleStatusUpdate(profile.id, "active")
                                                    }
                                                >
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Réactiver
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Résumé */}
            <div className="text-sm text-muted-foreground text-center">
                {filteredProfiles.length} profil(s) trouvé(s)
            </div>
        </div>
    );
}
