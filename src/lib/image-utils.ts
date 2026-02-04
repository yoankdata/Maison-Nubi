/**
 * Utilitaires d'optimisation d'images pour Maison Nubi
 * Utilise Supabase Storage Image Transformations
 * https://supabase.com/docs/guides/storage/serving/image-transformations
 * 
 * Optimisé pour les connexions lentes (3G/4G en Côte d'Ivoire)
 */

// Configuration des tailles d'images
export const IMAGE_SIZES = {
    thumbnail: { width: 100, height: 100 },   // Avatars petits
    avatar: { width: 200, height: 200 },       // Avatars standards
    card: { width: 400, height: 400 },         // Cartes de prestataires
    portfolio: { width: 800, height: 800 },    // Images de portfolio
    hero: { width: 1200, height: 800 },        // Images hero/couverture
    full: { width: 1600, height: 1200 },       // Images pleine taille
} as const;

export type ImageSize = keyof typeof IMAGE_SIZES;

// Qualités d'image selon le contexte
export const IMAGE_QUALITY = {
    low: 60,      // Pour les previews/thumbnails
    medium: 75,   // Standard (bon équilibre taille/qualité)
    high: 85,     // Pour les images importantes
} as const;

export type ImageQuality = keyof typeof IMAGE_QUALITY;

/**
 * Transforme une URL Supabase Storage en URL optimisée
 * 
 * @param url - URL originale de l'image Supabase
 * @param size - Taille prédéfinie (thumbnail, avatar, card, portfolio, hero, full)
 * @param quality - Qualité de compression (low, medium, high)
 * @returns URL transformée avec paramètres d'optimisation
 * 
 * @example
 * ```ts
 * // Avatar 200x200 en qualité medium
 * getOptimizedImageUrl(profile.avatar_url, 'avatar', 'medium')
 * 
 * // Image portfolio en qualité haute
 * getOptimizedImageUrl(image.image_url, 'portfolio', 'high')
 * ```
 */
export function getOptimizedImageUrl(
    url: string | null | undefined,
    size: ImageSize = 'card',
    quality: ImageQuality = 'medium'
): string {
    if (!url) return '/placeholder-image.jpg';

    // Vérifier si c'est une URL Supabase Storage
    if (!url.includes('supabase.co/storage')) {
        // Si ce n'est pas Supabase, retourner l'URL originale
        return url;
    }

    try {
        const urlObj = new URL(url);
        const { width, height } = IMAGE_SIZES[size];
        const qualityValue = IMAGE_QUALITY[quality];

        // Utiliser l'endpoint de transformation Supabase
        // Format: /storage/v1/render/image/public/bucket/path?width=X&height=Y&quality=Z
        const pathParts = urlObj.pathname.split('/storage/v1/object/public/');

        if (pathParts.length !== 2) {
            return url; // Format non reconnu, retourner l'original
        }

        const bucketAndPath = pathParts[1];

        // Construire l'URL de transformation
        const transformUrl = `${urlObj.origin}/storage/v1/render/image/public/${bucketAndPath}`;

        // Ajouter les paramètres de transformation
        const params = new URLSearchParams({
            width: width.toString(),
            height: height.toString(),
            quality: qualityValue.toString(),
            resize: 'cover', // Couvre la zone en coupant si nécessaire
            format: 'origin', // Garde le format original ou utilise 'webp' pour forcer WebP
        });

        return `${transformUrl}?${params.toString()}`;
    } catch {
        // En cas d'erreur de parsing, retourner l'URL originale
        return url;
    }
}

/**
 * Génère un srcset pour les images responsives
 * Utile avec le composant Next.js Image
 * 
 * @param url - URL originale de l'image
 * @param sizes - Liste des tailles à générer
 * @returns srcset string pour attribut HTML
 */
export function getImageSrcSet(
    url: string | null | undefined,
    sizes: ImageSize[] = ['thumbnail', 'card', 'portfolio']
): string {
    if (!url) return '';

    return sizes
        .map(size => {
            const optimizedUrl = getOptimizedImageUrl(url, size, 'medium');
            const width = IMAGE_SIZES[size].width;
            return `${optimizedUrl} ${width}w`;
        })
        .join(', ');
}

/**
 * Détermine la meilleure taille d'image selon le viewport
 * Utile pour charger l'image optimale selon l'écran
 * 
 * @param viewportWidth - Largeur du viewport en pixels
 * @returns La taille d'image recommandée
 */
export function getRecommendedImageSize(viewportWidth: number): ImageSize {
    if (viewportWidth < 400) return 'thumbnail';
    if (viewportWidth < 768) return 'card';
    if (viewportWidth < 1200) return 'portfolio';
    return 'hero';
}

/**
 * Préfixe de placeholder blur pour les images
 * Génère une version très basse résolution pour le loading
 */
export function getBlurPlaceholder(url: string | null | undefined): string {
    if (!url) return '';
    return getOptimizedImageUrl(url, 'thumbnail', 'low');
}
