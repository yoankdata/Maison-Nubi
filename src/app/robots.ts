import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://maisonnubi.ci';

/**
 * Génère le fichier robots.txt
 * Configure les règles d'indexation pour les moteurs de recherche
 */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/espace-pro/',  // Dashboard privé
                    '/api/',         // Routes API
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
