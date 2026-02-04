-- Migration: Harmoniser la catégorie "ongles" vers "onglerie"
-- Date: 2026-01-23

-- Étape 1: Ajouter "onglerie" à l'enum category_type si pas déjà présent
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'onglerie' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'category_type')
    ) THEN
        ALTER TYPE category_type ADD VALUE 'onglerie';
    END IF;
END $$;

-- Étape 2: Mettre à jour tous les profils "ongles" vers "onglerie"
UPDATE profiles 
SET category = 'onglerie' 
WHERE category = 'ongles';

-- Note: On ne peut pas supprimer "ongles" de l'enum facilement en PostgreSQL
-- Il faudrait recréer l'enum et la colonne, ce qui est risqué
-- On laisse donc "ongles" dans l'enum mais on ne l'utilise plus côté code
