"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    User,
    Camera,
    Loader2,
    Save,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { uploadAvatarAction } from "@/app/actions/auth";
import type { Profile, Category } from "@/lib/database.types";
import { generateSlug, generateOptimizedSlug } from "@/lib/utils";
import { HoursEditor } from "@/components/dashboard/hours-editor";


// Schéma de validation du profil
const profileSchema = z.object({
    full_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    bio: z.string().max(500, "La bio ne peut pas dépasser 500 caractères").optional(),
    category: z.enum(["coiffure", "makeup", "onglerie", "regard", "soins", "spa", "henne", "barber"]),
    neighborhood: z.string().optional(),
    address_details: z.string().max(200, "L'adresse ne peut pas dépasser 200 caractères").optional(),
    whatsapp: z.string().regex(/^(\+225)?[0-9]{10}$/, "Format invalide. Ex: 0701020304 ou +2250701020304"),
    instagram_handle: z.string().optional(),
    tiktok_handle: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const CATEGORIES = [
    { value: "coiffure", label: "Coiffure" },
    { value: "makeup", label: "Maquillage" },
    { value: "ongles", label: "Ongles" },
    { value: "soins", label: "Soins" },
    { value: "barber", label: "Barber" },
];

const NEIGHBORHOODS = [
    "Cocody Angré",
    "Cocody Danga",
    "Marcory Zone 4",
    "Plateau",
    "Riviera Faya",
    "Yopougon",
    "Treichville",
    "Adjamé",
    "Koumassi",
    "Autre",
];

/**
 * Page de profil du Dashboard
 * Formulaire complet avec upload avatar
 */
export default function ProfilePage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // États
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isDirty },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    const selectedCategory = watch("category");

    // Charger le profil au montage
    useEffect(() => {
        async function loadProfile() {
            if (!supabase) {
                setError("Supabase non configuré");
                setIsLoading(false);
                return;
            }

            try {
                // Récupérer l'utilisateur connecté
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    router.push("/connexion");
                    return;
                }

                // Récupérer le profil
                const { data, error: fetchError } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                // Si le profil n'existe pas (erreur PGRST116), le créer
                if (fetchError && fetchError.code === "PGRST116") {
                    // Profil non trouvé, création automatique...

                    // Génération d'un slug unique optimisé pour le SEO
                    const fullName = user.user_metadata?.full_name || "Nouveau Prestataire";
                    const category = user.user_metadata?.category || "coiffure";
                    const baseSlug = generateOptimizedSlug(fullName, category);
                    let slug = baseSlug;
                    let counter = 1;

                    // Vérifier si le slug existe déjà
                    while (true) {
                        const { count } = await supabase
                            .from("profiles")
                            .select("id", { count: "exact", head: true })
                            .eq("slug", slug);

                        if (count === 0) break; // Slug disponible

                        slug = `${baseSlug}-${counter++}`;
                    }

                    // Créer le profil avec les métadonnées de l'utilisateur
                    const { data: newProfile, error: insertError } = await supabase
                        .from("profiles")
                        .insert({
                            id: user.id,
                            email: user.email,
                            full_name: fullName,
                            slug: slug,
                            category: user.user_metadata?.category || "coiffure",
                            whatsapp: user.user_metadata?.whatsapp || "+225",
                            city: "Abidjan",
                            status: "pending",
                        } as never)
                        .select()
                        .single();

                    if (insertError) {
                        console.error("Erreur création profil:", insertError);
                        throw insertError;
                    }

                    const profileData = newProfile as unknown as Profile;
                    setProfile(profileData);
                    setAvatarUrl(profileData.avatar_url);

                    // Pré-remplir le formulaire
                    reset({
                        full_name: profileData.full_name,
                        bio: profileData.bio || "",
                        category: profileData.category as Category,
                        neighborhood: profileData.neighborhood || "",
                        address_details: profileData.address_details || "",
                        whatsapp: profileData.whatsapp,
                        instagram_handle: profileData.instagram_handle || "",
                        tiktok_handle: profileData.tiktok_handle || "",
                    });
                } else if (fetchError) {
                    throw fetchError;
                } else {
                    const profileData = data as unknown as Profile;
                    setProfile(profileData);
                    setAvatarUrl(profileData.avatar_url);

                    // Pré-remplir le formulaire
                    reset({
                        full_name: profileData.full_name,
                        bio: profileData.bio || "",
                        category: profileData.category as Category,
                        neighborhood: profileData.neighborhood || "",
                        address_details: profileData.address_details || "",
                        whatsapp: profileData.whatsapp,
                        instagram_handle: profileData.instagram_handle || "",
                        tiktok_handle: profileData.tiktok_handle || "",
                    });
                }
            } catch (err) {
                console.error("Erreur chargement profil:", err);
                setError("Impossible de charger votre profil. Vérifiez que la table 'profiles' existe dans Supabase.");
            } finally {
                setIsLoading(false);
            }
        }

        loadProfile();
    }, [router, reset]);

    // Soumettre les modifications du profil
    const onSubmit = async (data: ProfileFormData) => {
        if (!supabase || !profile) return;

        setIsSaving(true);
        setError(null);
        setSuccess(false);

        try {
            // Préparer les données de mise à jour
            const updateData = {
                full_name: data.full_name,
                bio: data.bio || null,
                category: data.category,
                neighborhood: data.neighborhood || null,
                address_details: data.address_details || null,
                whatsapp: data.whatsapp,
                instagram_handle: data.instagram_handle || null,
                tiktok_handle: data.tiktok_handle || null,
                status: "active" as const, // Activer le profil après complétion
            };

            const { error: updateError } = await supabase
                .from("profiles")
                .update(updateData as never) // Cast pour bypass le typage strict
                .eq("id", profile.id);

            if (updateError) throw updateError;

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error("Erreur mise à jour:", err);
            setError("Erreur lors de la sauvegarde. Veuillez réessayer.");
        } finally {
            setIsSaving(false);
        }
    };

    // Upload de l'avatar via Server Action (Sécurisé)
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const result = await uploadAvatarAction(formData);

            if (result.error) {
                setError(result.error);
            } else if (result.success && result.avatarUrl) {
                setAvatarUrl(result.avatarUrl);
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err) {
            console.error("Erreur upload:", err);
            setError("Une erreur inattendue est survenue.");
        } finally {
            setIsUploading(false);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    // Initiales pour le fallback avatar
    const initials = profile?.full_name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "?";

    // Chargement
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl">
            {/* En-tête */}
            <div>
                <h1 className="font-serif text-2xl font-bold text-anthracite">
                    Mon Profil
                </h1>
                <p className="text-muted-foreground">
                    Complétez votre profil pour être visible par les clients
                </p>
            </div>

            {/* Messages */}
            {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            {success && (
                <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-600">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    Profil enregistré avec succès !
                </div>
            )}

            {/* Carte Avatar */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Photo de profil</CardTitle>
                    <CardDescription>
                        Cette photo sera visible par les clients
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-6">
                    <div className="relative">
                        <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                            <AvatarImage src={avatarUrl || undefined} alt={profile?.full_name} />
                            <AvatarFallback className="bg-gold text-white text-2xl font-semibold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        {isUploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                <Loader2 className="h-6 w-6 animate-spin text-white" />
                            </div>
                        )}
                    </div>
                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleAvatarUpload}
                            className="hidden"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            <Camera className="mr-2 h-4 w-4" />
                            Changer la photo
                        </Button>
                        <p className="mt-2 text-xs text-muted-foreground">
                            JPG, PNG ou WebP. 2MB max.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Formulaire */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Informations</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Nom commercial */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-anthracite">
                                Nom commercial / Nom du salon *
                            </label>
                            <Input
                                placeholder="Ex: Salon Naya ou Marie Koné"
                                className="rounded-lg"
                                {...register("full_name")}
                            />
                            {errors.full_name && (
                                <p className="text-xs text-red-500">{errors.full_name.message}</p>
                            )}
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-anthracite">
                                Bio / Description
                            </label>
                            <Textarea
                                placeholder="Décrivez votre activité, votre expérience, vos spécialités..."
                                className="rounded-lg min-h-[100px]"
                                {...register("bio")}
                            />
                            {errors.bio && (
                                <p className="text-xs text-red-500">{errors.bio.message}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Maximum 500 caractères
                            </p>
                        </div>

                        {/* Catégorie */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-anthracite">
                                Catégorie principale *
                            </label>
                            <Select
                                value={selectedCategory}
                                onValueChange={(v) => setValue("category", v as Category, { shouldDirty: true })}
                            >
                                <SelectTrigger className="rounded-lg">
                                    <SelectValue placeholder="Choisissez votre spécialité" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category && (
                                <p className="text-xs text-red-500">{errors.category.message}</p>
                            )}
                        </div>

                        {/* Commune */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-anthracite">
                                Commune / Quartier
                            </label>
                            <Select
                                value={watch("neighborhood") || ""}
                                onValueChange={(v) => setValue("neighborhood", v, { shouldDirty: true })}
                            >
                                <SelectTrigger className="rounded-lg">
                                    <SelectValue placeholder="Sélectionnez votre quartier" />
                                </SelectTrigger>
                                <SelectContent>
                                    {NEIGHBORHOODS.map((n) => (
                                        <SelectItem key={n} value={n}>
                                            {n}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Adresse complète */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-anthracite">
                                Adresse complète (optionnel)
                            </label>
                            <Input
                                placeholder="Ex: Riviera Faya, près de la pharmacie centrale"
                                className="rounded-lg"
                                {...register("address_details")}
                            />
                            {errors.address_details && (
                                <p className="text-xs text-red-500">{errors.address_details.message}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Donnez des indications précises pour que vos clients vous trouvent facilement
                            </p>
                        </div>

                        {/* WhatsApp */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-anthracite">
                                Numéro WhatsApp *
                            </label>
                            <Input
                                type="tel"
                                placeholder="+225 07 00 00 00 00"
                                className="rounded-lg"
                                {...register("whatsapp")}
                            />
                            {errors.whatsapp && (
                                <p className="text-xs text-red-500">{errors.whatsapp.message}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Les clients vous contacteront sur ce numéro
                            </p>
                        </div>

                        {/* Instagram */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-anthracite">
                                Instagram (optionnel)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    @
                                </span>
                                <Input
                                    placeholder="votre_compte"
                                    className="pl-8 rounded-lg"
                                    {...register("instagram_handle")}
                                />
                            </div>
                        </div>

                        {/* TikTok */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-anthracite">
                                TikTok (optionnel)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    @
                                </span>
                                <Input
                                    placeholder="votre_compte"
                                    className="pl-8 rounded-lg"
                                    {...register("tiktok_handle")}
                                />
                            </div>
                        </div>

                        {/* Bouton sauvegarder */}
                        <Button
                            type="submit"
                            disabled={isSaving || !isDirty}
                            className="w-full rounded-full bg-gold hover:bg-gold-dark text-white"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enregistrement...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Enregistrer les modifications
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
