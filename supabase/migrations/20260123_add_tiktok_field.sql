-- =============================================
-- Migration : Ajout du champ TikTok pour les prestataires
-- Date : 2026-01-23
-- =============================================

-- Ajouter une colonne pour le nom d'utilisateur TikTok
ALTER TABLE public.profiles 
ADD COLUMN tiktok_handle TEXT;

-- Commentaire explicatif
COMMENT ON COLUMN public.profiles.tiktok_handle IS 'Nom d''utilisateur TikTok (sans le @)';
