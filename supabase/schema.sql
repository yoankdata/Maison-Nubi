-- =============================================
-- SCHÉMA BASE DE DONNÉES ORÉA
-- Plateforme annuaire beauté premium Côte d'Ivoire
-- =============================================

-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TYPES ENUM
-- =============================================

-- Catégories de prestataires beauté
CREATE TYPE category_type AS ENUM (
  'coiffure',
  'makeup',
  'ongles',
  'soins',
  'barber'
);

-- Statut du profil (pour modération)
CREATE TYPE profile_status AS ENUM (
  'active',   -- Profil visible
  'pending',  -- En attente de validation
  'banned'    -- Banni par l'admin
);

-- =============================================
-- TABLE PROFILES (Extension de auth.users)
-- =============================================
CREATE TABLE public.profiles (
  -- Identifiant = UUID (peut être lié à auth.users en production)
  -- Note: En développement, on retire la contrainte FK pour permettre le seed
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Informations de base
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- URL jolie : orea.ci/prestataire/salon-marie
  
  -- Catégorie et localisation
  category category_type NOT NULL,
  city TEXT NOT NULL DEFAULT 'Abidjan',
  neighborhood TEXT, -- Ex: Cocody, Marcory, Yopougon
  
  -- Description
  bio TEXT,
  
  -- Contact
  whatsapp TEXT NOT NULL, -- Format international: +225XXXXXXXXXX
  instagram_handle TEXT, -- Sans le @
  
  -- Avatar/Photo
  avatar_url TEXT,
  
  -- Premium & Modération
  is_premium BOOLEAN DEFAULT FALSE,
  status profile_status DEFAULT 'active',
  
  -- Notation
  rating FLOAT DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour la recherche
CREATE INDEX idx_profiles_category ON public.profiles(category);
CREATE INDEX idx_profiles_city ON public.profiles(city);
CREATE INDEX idx_profiles_is_premium ON public.profiles(is_premium);
CREATE INDEX idx_profiles_status ON public.profiles(status);
CREATE INDEX idx_profiles_slug ON public.profiles(slug);

-- =============================================
-- TABLE SERVICES (Prestations & Prix)
-- =============================================
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL, -- Ex: "Tresses Braids", "Maquillage Mariée"
  price INTEGER NOT NULL, -- Prix en FCFA
  currency TEXT DEFAULT 'FCFA',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes par profil
CREATE INDEX idx_services_profile_id ON public.services(profile_id);

-- =============================================
-- TABLE PORTFOLIO_IMAGES (Galerie Photos)
-- =============================================
CREATE TABLE public.portfolio_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  image_url TEXT NOT NULL, -- URL Supabase Storage
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes par profil
CREATE INDEX idx_portfolio_images_profile_id ON public.portfolio_images(profile_id);

-- =============================================
-- FONCTIONS TRIGGER
-- =============================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger sur profiles
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;

-- === POLICIES PROFILES ===

-- Lecture : Tout le monde peut voir les profils actifs
CREATE POLICY "Profils actifs visibles par tous"
  ON public.profiles FOR SELECT
  USING (status = 'active');

-- Insertion : Utilisateur authentifié peut créer son profil
CREATE POLICY "Utilisateur peut créer son profil"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Modification : Utilisateur peut modifier uniquement son propre profil
CREATE POLICY "Utilisateur peut modifier son profil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Suppression : Utilisateur peut supprimer son propre profil
CREATE POLICY "Utilisateur peut supprimer son profil"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- === POLICIES SERVICES ===

-- Lecture : Tout le monde peut voir les services
CREATE POLICY "Services visibles par tous"
  ON public.services FOR SELECT
  USING (true);

-- Insertion : Propriétaire du profil uniquement
CREATE POLICY "Propriétaire peut créer des services"
  ON public.services FOR INSERT
  WITH CHECK (
    auth.uid() = profile_id
  );

-- Modification : Propriétaire du profil uniquement
CREATE POLICY "Propriétaire peut modifier ses services"
  ON public.services FOR UPDATE
  USING (auth.uid() = profile_id);

-- Suppression : Propriétaire du profil uniquement
CREATE POLICY "Propriétaire peut supprimer ses services"
  ON public.services FOR DELETE
  USING (auth.uid() = profile_id);

-- === POLICIES PORTFOLIO_IMAGES ===

-- Lecture : Tout le monde peut voir les images
CREATE POLICY "Images visibles par tous"
  ON public.portfolio_images FOR SELECT
  USING (true);

-- Insertion : Propriétaire du profil + limite de 3 pour non-premium
CREATE POLICY "Propriétaire peut ajouter des images"
  ON public.portfolio_images FOR INSERT
  WITH CHECK (
    auth.uid() = profile_id
    AND (
      -- Premium : illimité
      EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND is_premium = true)
      OR
      -- Non-premium : max 3 images
      (SELECT COUNT(*) FROM public.portfolio_images WHERE profile_id = auth.uid()) < 3
    )
  );

-- Suppression : Propriétaire du profil uniquement
CREATE POLICY "Propriétaire peut supprimer ses images"
  ON public.portfolio_images FOR DELETE
  USING (auth.uid() = profile_id);

-- =============================================
-- DONNÉES DE DÉMO (Optionnel)
-- =============================================

-- Note: Décommenter ces lignes pour insérer des données de test
-- Vous devrez d'abord créer les utilisateurs via Supabase Auth

/*
-- Exemple d'insertion (remplacer les UUIDs par de vrais IDs auth.users)
INSERT INTO public.profiles (id, email, full_name, slug, category, city, neighborhood, bio, whatsapp)
VALUES 
  ('uuid-user-1', 'marie@example.com', 'Marie Koné', 'salon-marie', 'coiffure', 'Abidjan', 'Cocody', 'Spécialiste tresses et braids depuis 10 ans', '+22507000001'),
  ('uuid-user-2', 'awa@example.com', 'Awa Diallo', 'awa-makeup', 'makeup', 'Abidjan', 'Marcory', 'Makeup artist professionnelle, formée à Paris', '+22507000002');

INSERT INTO public.services (profile_id, title, price)
VALUES
  ('uuid-user-1', 'Tresses Braids', 15000),
  ('uuid-user-1', 'Tissage classique', 25000),
  ('uuid-user-2', 'Maquillage Mariée', 50000),
  ('uuid-user-2', 'Maquillage Soirée', 25000);
*/
