"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Plus,
    Trash2,
    Loader2,
    AlertCircle,
    ImageIcon,
    Upload,
    Crown,
    Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import type { PortfolioImage, Profile } from "@/lib/database.types";

const FREE_PHOTO_LIMIT = 3;

/**
 * Page de gestion de la galerie portfolio
 * Upload d'images vers Supabase Storage
 */
export default function GalleryPage() {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Récupérer le profil pour vérifier is_premium
    const { data: profile } = useQuery({
        queryKey: ["profile"],
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

    // Récupérer les images du portfolio
    const { data: images, isLoading } = useQuery({
        queryKey: ["portfolio"],
        queryFn: async () => {
            if (!supabase) throw new Error("Supabase non configuré");

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Non connecté");

            const { data, error } = await supabase
                .from("portfolio_images")
                .select("*")
                .eq("profile_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data as unknown as PortfolioImage[];
        },
    });

    const imageCount = images?.length || 0;
    const isPremium = profile?.is_premium || false;
    const isLimitReached = !isPremium && imageCount >= FREE_PHOTO_LIMIT;

    // Upload d'une image
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !supabase) return;

        // Vérifier la limite pour les comptes gratuits
        if (!isPremium && imageCount >= FREE_PHOTO_LIMIT) {
            setError(`Limite de ${FREE_PHOTO_LIMIT} photos atteinte. Passez à NUBI GOLD pour des photos illimitées !`);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            return;
        }

        // Vérifier le type de fichier
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setError("Format non supporté. Utilisez JPG, PNG ou WebP.");
            return;
        }

        // Vérifier la taille (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError("L'image ne doit pas dépasser 5MB.");
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Non connecté");

            // Générer un nom de fichier unique
            const fileExt = file.name.split(".").pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;

            // Upload vers Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from("portfolio")
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // Obtenir l'URL publique
            const { data: urlData } = supabase.storage
                .from("portfolio")
                .getPublicUrl(fileName);

            // Insérer dans la table portfolio_images
            const { error: insertError } = await supabase
                .from("portfolio_images")
                .insert({
                    profile_id: user.id,
                    image_url: urlData.publicUrl,
                } as never);

            if (insertError) throw insertError;

            // Rafraîchir la liste
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
        } catch (err) {
            console.error("Erreur upload:", err);
            setError(err instanceof Error ? err.message : "Erreur lors de l'upload");
        } finally {
            setIsUploading(false);
            // Reset l'input file
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    // Supprimer une image
    const deleteImage = useMutation({
        mutationFn: async (image: PortfolioImage) => {
            if (!supabase) throw new Error("Supabase non configuré");

            // Extraire le chemin du fichier de l'URL
            const url = new URL(image.image_url);
            const pathParts = url.pathname.split("/storage/v1/object/public/portfolio/");
            const filePath = pathParts[1];

            // Supprimer du Storage
            if (filePath) {
                await supabase.storage.from("portfolio").remove([filePath]);
            }

            // Supprimer de la DB
            const { error } = await supabase
                .from("portfolio_images")
                .delete()
                .eq("id", image.id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
        },
        onError: (err) => {
            setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
        },
    });

    return (
        <div className="space-y-6 max-w-2xl">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-2xl font-bold text-anthracite">
                        Ma Galerie
                    </h1>
                    <p className="text-muted-foreground">
                        Montrez vos réalisations aux clients
                    </p>
                </div>

                {/* Bouton Upload */}
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleUpload}
                        className="hidden"
                        disabled={isLimitReached}
                    />
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading || isLimitReached}
                        className={`rounded-full ${isLimitReached ? 'bg-muted text-muted-foreground' : 'bg-gold hover:bg-gold-dark text-white'}`}
                    >
                        {isUploading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : isLimitReached ? (
                            <Lock className="mr-2 h-4 w-4" />
                        ) : (
                            <Upload className="mr-2 h-4 w-4" />
                        )}
                        {isLimitReached ? "Limite atteinte" : "Ajouter une photo"}
                    </Button>
                </div>
            </div>

            {/* Message d'erreur */}
            {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Statut photos */}
            {isPremium ? (
                <Card className="border-green-500/30 bg-green-50/30">
                    <CardContent className="flex items-center gap-3 py-4">
                        <Crown className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-anthracite">
                                Photos illimitées
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Avantage NUBI GOLD actif
                            </p>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            GOLD
                        </span>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-gold/30 bg-gold/5">
                    <CardContent className="flex items-center gap-3 py-4">
                        <Crown className="h-5 w-5 text-gold flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-anthracite">
                                {imageCount}/{FREE_PHOTO_LIMIT} photos utilisées
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Passez à NUBI GOLD pour des photos illimitées
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-gold text-gold hover:bg-gold hover:text-white"
                            asChild
                        >
                            <a href="/espace-pro/abonnement">Upgrade</a>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Galerie */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Vos photos</CardTitle>
                    <CardDescription>
                        Ces photos sont affichées sur votre profil public
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-gold" />
                        </div>
                    ) : images && images.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {images.map((image) => (
                                <div
                                    key={image.id}
                                    className="relative aspect-square rounded-xl overflow-hidden group"
                                >
                                    {/* Image */}
                                    <Image
                                        src={image.image_url}
                                        alt="Portfolio"
                                        fill
                                        sizes="(max-width: 640px) 50vw, 33vw"
                                        className="object-cover"
                                        loading="lazy"
                                    />

                                    {/* Overlay avec bouton supprimer */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="h-10 w-10 rounded-full"
                                            onClick={() => deleteImage.mutate(image)}
                                            disabled={deleteImage.isPending}
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {/* Placeholder pour ajouter si pas à la limite */}
                            {!isLimitReached && (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center text-muted-foreground hover:border-gold hover:text-gold transition-colors"
                                >
                                    <Plus className="h-8 w-8 mb-2" />
                                    <span className="text-xs">Ajouter</span>
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground">
                                Aucune photo ajoutée
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Montrez vos plus belles réalisations !
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
