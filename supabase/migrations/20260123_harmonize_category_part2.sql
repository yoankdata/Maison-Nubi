-- Migration PARTIE 2/2: Migrer les données "ongles" vers "onglerie"
-- Date: 2026-01-23
-- IMPORTANT: Exécuter APRÈS avoir exécuté la partie 1

-- Mettre à jour tous les profils "ongles" vers "onglerie"
UPDATE profiles 
SET category = 'onglerie' 
WHERE category = 'ongles';

-- Vérifier le résultat
SELECT category, COUNT(*) 
FROM profiles 
GROUP BY category 
ORDER BY category;
