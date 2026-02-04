"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

/**
 * Server Action pour la déconnexion
 * Avantages par rapport à l'API Route :
 * - Protection CSRF intégrée automatiquement par Next.js
 * - Pas besoin de gérer les headers manuellement
 */
export async function signOutAction() {
    const supabase = await createClient();

    if (supabase) {
        await supabase.auth.signOut();
    }

    redirect("/");
}

/**
 * Server Action pour valider et uploader un avatar
 * Validation côté serveur :
 * - Type MIME autorisé (image/jpeg, image/png, image/webp)
 * - Taille maximale (2MB)
 * - Nom de fichier sécurisé
 */
export async function uploadAvatarAction(formData: FormData) {
    const supabase = await createClient();

    if (!supabase) {
        return { error: "Service non disponible" };
    }

    // Récupérer l'utilisateur connecté
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Non authentifié" };
    }

    const file = formData.get("avatar") as File | null;

    if (!file || file.size === 0) {
        return { error: "Aucun fichier fourni" };
    }

    // ========== VALIDATION CÔTÉ SERVEUR ==========

    // 1. Vérifier le type MIME
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
        return { error: "Format non supporté. Utilisez JPG, PNG ou WebP." };
    }

    // 2. Vérifier la taille (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
        return { error: "L'image ne doit pas dépasser 2MB." };
    }

    // 3. Vérifier que c'est vraiment une image (magic bytes)
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    const isValidImage = (
        // JPEG: FF D8 FF
        (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) ||
        // PNG: 89 50 4E 47
        (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) ||
        // WebP: 52 49 46 46 ... 57 45 42 50
        (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
            bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50)
    );

    if (!isValidImage) {
        return { error: "Le fichier n'est pas une image valide." };
    }

    // ========== UPLOAD VERS SUPABASE ==========

    try {
        // Générer un nom de fichier sécurisé
        const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `${user.id}/avatar.${fileExt}`;

        // Convertir en Buffer pour Supabase
        const fileBuffer = Buffer.from(buffer);

        // Upload vers Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(fileName, fileBuffer, {
                upsert: true,
                contentType: file.type,
            });

        if (uploadError) {
            console.error("Erreur upload Supabase:", uploadError);
            return { error: "Erreur lors de l'upload. Veuillez réessayer." };
        }

        // Obtenir l'URL publique
        const { data: urlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(fileName);

        const newAvatarUrl = urlData.publicUrl + "?t=" + Date.now(); // Cache busting

        // Mettre à jour le profil avec la nouvelle URL
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ avatar_url: newAvatarUrl } as never)
            .eq("id", user.id);

        if (updateError) {
            console.error("Erreur mise à jour profil:", updateError);
            return { error: "Erreur lors de la mise à jour du profil." };
        }

        return { success: true, avatarUrl: newAvatarUrl };
    } catch (err) {
        console.error("Erreur upload avatar:", err);
        return { error: "Erreur inattendue. Veuillez réessayer." };
    }
}
