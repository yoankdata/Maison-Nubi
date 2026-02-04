-- Migration PARTIE 1/2: Ajouter "onglerie" à l'enum category_type
-- Date: 2026-01-23
-- IMPORTANT: Exécuter cette partie SEULE, puis exécuter la partie 2

-- Ajouter "onglerie" à l'enum category_type si pas déjà présent
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

-- STOP ICI - Exécuter cette partie, puis exécuter la partie 2 séparément
