-- Migration: Ajouter le champ address_details pour une localisation plus précise
-- Date: 2026-01-22

-- Ajouter la colonne address_details à la table profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS address_details TEXT;

-- Commentaire pour la documentation
COMMENT ON COLUMN profiles.address_details IS 'Adresse complète ou indications précises (ex: "Riviera Faya, face à la pharmacie centrale")';
