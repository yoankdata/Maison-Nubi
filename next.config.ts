import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Autoriser les images distantes (Supabase Storage, Google, Unsplash, etc.)
  images: {
    // Formats modernes pour une meilleure compression
    formats: ['image/avif', 'image/webp'],
    // Tailles optimisées pour différents écrans (focus mobile)
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache agressif : 1 an (images de portfolio ne changent pas souvent)
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "gsqxysrxfislijvrhhvo.supabase.co",
        pathname: "/storage/v1/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },

  // ============================================
  // SECURITY HEADERS
  // Protection contre les attaques web courantes
  // ============================================
  async headers() {
    return [
      {
        // Appliquer à toutes les routes
        source: "/:path*",
        headers: [
          // Anti-clickjacking : empêche l'intégration dans des iframes malveillantes
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // Empêche le sniffing MIME type
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Contrôle les informations de referrer envoyées
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Protection XSS legacy (pour anciens navigateurs)
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Permissions Policy : limite les fonctionnalités du navigateur
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
          },
          // Strict Transport Security : Force HTTPS (activer en production)
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },

  // Compression et optimisation
  compress: true,

  // Optimisation du build
  poweredByHeader: false, // Masque le header X-Powered-By
};

export default nextConfig;

