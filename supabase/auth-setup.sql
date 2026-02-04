-- =============================================
-- ORÉA - PHASE 3 : AUTH & STORAGE
-- Trigger création profil + Buckets Storage
-- =============================================

-- =============================================
-- 1. TRIGGER : Création automatique de profil
-- =============================================
-- Quand un utilisateur s'inscrit via Supabase Auth,
-- une ligne est automatiquement créée dans public.profiles

-- Fonction qui sera appelée par le trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, slug, category, whatsapp, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Nouveau Prestataire'),
    -- Générer un slug unique basé sur l'email
    LOWER(REPLACE(SPLIT_PART(NEW.email, '@', 1), '.', '-')) || '-' || SUBSTRING(NEW.id::text, 1, 8),
    -- Catégorie par défaut (sera modifiée par l'utilisateur)
    COALESCE((NEW.raw_user_meta_data->>'category')::category_type, 'coiffure'),
    -- WhatsApp depuis les métadonnées ou placeholder
    COALESCE(NEW.raw_user_meta_data->>'whatsapp', '+225'),
    'pending' -- Statut en attente jusqu'à complétion du profil
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger sur auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 2. BUCKETS STORAGE
-- =============================================

-- Créer le bucket pour les avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true, -- Public : tout le monde peut voir
  2097152, -- 2MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Créer le bucket pour les images portfolio
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio',
  'portfolio',
  true, -- Public : tout le monde peut voir
  5242880, -- 5MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 3. POLITIQUES RLS POUR STORAGE
-- =============================================

-- === BUCKET AVATARS ===

-- Lecture : Tout le monde peut voir les avatars
CREATE POLICY "Avatars visibles par tous"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Upload : Utilisateur peut uploader son propre avatar
-- Le chemin doit être : avatars/{user_id}/{filename}
CREATE POLICY "Utilisateur peut uploader son avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Modification : Utilisateur peut modifier son avatar
CREATE POLICY "Utilisateur peut modifier son avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Suppression : Utilisateur peut supprimer son avatar
CREATE POLICY "Utilisateur peut supprimer son avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- === BUCKET PORTFOLIO ===

-- Lecture : Tout le monde peut voir les images portfolio
CREATE POLICY "Portfolio visible par tous"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

-- Upload : Utilisateur peut uploader ses images
-- Le chemin doit être : portfolio/{user_id}/{filename}
CREATE POLICY "Utilisateur peut uploader ses images portfolio"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Modification : Utilisateur peut modifier ses images
CREATE POLICY "Utilisateur peut modifier ses images portfolio"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'portfolio'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Suppression : Utilisateur peut supprimer ses images
CREATE POLICY "Utilisateur peut supprimer ses images portfolio"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'portfolio'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =============================================
-- VÉRIFICATION
-- =============================================
-- Après exécution, vérifie :
-- 1. Dans Authentication > Providers : Email activé
-- 2. Dans Storage : Buckets "avatars" et "portfolio" créés
-- 3. Dans Database > Triggers : on_auth_user_created visible
