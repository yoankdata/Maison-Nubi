/**
 * Types de la base de données Supabase pour Maison Nubi
 * Générés manuellement à partir du schéma SQL
 */

// Catégories de prestataires
export type Category = "coiffure" | "makeup" | "onglerie" | "regard" | "soins" | "spa" | "henne" | "barber";

// Statut du profil
export type ProfileStatus = "active" | "pending" | "banned";

// Interface du profil prestataire
export interface Profile {
    id: string;
    email: string;
    full_name: string;
    slug: string;
    category: Category;
    bio: string | null;
    city: string;
    neighborhood: string | null;
    address_details: string | null;
    whatsapp: string;
    instagram_handle: string | null;
    tiktok_handle: string | null;
    avatar_url: string | null;
    stripe_customer_id: string | null;
    is_premium: boolean;
    premium_boost_end_at: string | null;
    premium_boost_activated_at: string | null;
    rating: number;
    review_count: number;
    recommendations_count: number;
    status: ProfileStatus;
    created_at: string;
    updated_at: string;
}

// Interface pour créer/modifier un profil
export interface ProfileInsert {
    id: string;
    email: string;
    full_name: string;
    slug: string;
    category: Category;
    bio?: string | null;
    city: string;
    neighborhood?: string | null;
    address_details?: string | null;
    whatsapp: string;
    instagram_handle?: string | null;
    tiktok_handle?: string | null;
    avatar_url?: string | null;
    stripe_customer_id?: string | null;
    is_premium?: boolean;
    premium_boost_end_at?: string | null;
    premium_boost_activated_at?: string | null;
    status?: ProfileStatus;
    recommendations_count?: number;
}

export interface ProfileUpdate {
    full_name?: string;
    slug?: string;
    category?: Category;
    bio?: string | null;
    city?: string;
    neighborhood?: string | null;
    address_details?: string | null;
    whatsapp?: string;
    instagram_handle?: string | null;
    tiktok_handle?: string | null;
    avatar_url?: string | null;
    stripe_customer_id?: string | null;
    status?: ProfileStatus;
    is_premium?: boolean;
    premium_boost_end_at?: string | null;
    premium_boost_activated_at?: string | null;
    recommendations_count?: number;
}

// Interface d'un service/prestation
export interface Service {
    id: string;
    profile_id: string;
    title: string;
    price: number;
    currency: string;
    created_at: string;
}

export interface ServiceInsert {
    profile_id: string;
    title: string;
    price: number;
    currency?: string;
}

export interface ServiceUpdate {
    title?: string;
    price?: number;
    currency?: string;
}

// Interface pour les images du portfolio
export interface PortfolioImage {
    id: string;
    profile_id: string;
    image_url: string;
    created_at: string;
}

export interface PortfolioImageInsert {
    profile_id: string;
    image_url: string;
}

// Interface pour les horaires d'ouverture
export interface OpeningHour {
    id: string;
    profile_id: string;
    day_of_week: number; // 0-6
    open_time: string | null;
    close_time: string | null;
    is_closed: boolean;
    created_at: string;
}

export interface OpeningHourInsert {
    profile_id: string;
    day_of_week: number;
    open_time?: string | null;
    close_time?: string | null;
    is_closed?: boolean;
}

export interface OpeningHourUpdate {
    open_time?: string | null;
    close_time?: string | null;
    is_closed?: boolean;
}

// Interface pour les achats de boost premium
export interface BoostPurchase {
    id: string;
    profile_id: string;
    provider: 'stripe' | 'wave' | 'orange' | 'mtn';
    amount: number;
    currency: string;
    status: 'succeeded' | 'pending' | 'failed';
    stripe_payment_intent_id: string | null;
    activated_at: string | null;
    expires_at: string | null;
    created_at: string;
}

export interface BoostPurchaseInsert {
    profile_id: string;
    provider: 'stripe' | 'wave' | 'orange' | 'mtn';
    amount?: number;
    currency?: string;
    status: 'succeeded' | 'pending' | 'failed';
    stripe_payment_intent_id?: string | null;
    activated_at?: string | null;
    expires_at?: string | null;
}

// Type global pour la base de données - Format compatible @supabase/ssr
export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: Profile;
                Insert: ProfileInsert;
                Update: ProfileUpdate;
                Relationships: [];
            };
            services: {
                Row: Service;
                Insert: ServiceInsert;
                Update: ServiceUpdate;
                Relationships: [];
            };
            portfolio_images: {
                Row: PortfolioImage;
                Insert: PortfolioImageInsert;
                Update: Partial<PortfolioImageInsert>;
                Relationships: [];
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: {
            category_type: Category;
            profile_status: ProfileStatus;
        };
        CompositeTypes: Record<string, never>;
    };
}

// Type helper pour récupérer un profil avec ses services
export interface ProfileWithServices extends Profile {
    services: Service[];
}

// Type helper pour la recherche
export interface ProfileSearchResult extends Profile {
    services: Pick<Service, "title" | "price">[];
}

// ============================================
// TYPE ALIASES DÉRIVÉS DE DATABASE
// Utilisez ces types pour garantir la cohérence
// avec le schéma Supabase
// ============================================

/** Type Row pour profiles - Utilisez ce type au lieu de Profile pour les requêtes */
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

/** Type Row pour services - Utilisez ce type au lieu de Service pour les requêtes */
export type ServiceRow = Database["public"]["Tables"]["services"]["Row"];

/** Type Row pour portfolio_images */
export type PortfolioImageRow = Database["public"]["Tables"]["portfolio_images"]["Row"];

/** Type Insert pour profiles */
export type ProfileInsertRow = Database["public"]["Tables"]["profiles"]["Insert"];

/** Type Insert pour services */
export type ServiceInsertRow = Database["public"]["Tables"]["services"]["Insert"];

/** Type Update pour profiles */
export type ProfileUpdateRow = Database["public"]["Tables"]["profiles"]["Update"];

/** Type Update pour services */
export type ServiceUpdateRow = Database["public"]["Tables"]["services"]["Update"];
