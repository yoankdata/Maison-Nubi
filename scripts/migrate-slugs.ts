/**
 * Script de migration des slugs pour les profils existants
 * Transforme les slugs génériques (user-xxx) en slugs optimisés SEO (nom-categorie)
 * 
 * Utilisation:
 * 1. Assurez-vous que les variables d'environnement sont configurées (.env.local)
 * 2. Installez ts-node si nécessaire: npm install -D ts-node
 * 3. Lancez: npx ts-node --esm scripts/migrate-slugs.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Charger les variables d'environnement
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Fonction generateSlug (copie depuis utils.ts)
function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Enlever les accents
        .replace(/[^a-z0-9]+/g, "-") // Remplacer les caractères spéciaux par des tirets
        .replace(/^-+|-+$/g, ""); // Enlever les tirets au début/fin
}

// Fonction generateOptimizedSlug (copie depuis utils.ts)
function generateOptimizedSlug(name: string, category: string): string {
    const nameSlug = generateSlug(name);
    const categorySlug = generateSlug(category);
    return `${nameSlug}-${categorySlug}`;
}

// Configuration Supabase avec Service Role Key (bypass RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Erreur: Variables d\'environnement manquantes');
    console.error('   Vérifiez que NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont dans .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface Profile {
    id: string;
    full_name: string;
    category: string;
    slug: string;
}

async function migrateSlug(profile: Profile): Promise<boolean> {
    try {
        // Générer le nouveau slug optimisé
        const newSlug = generateOptimizedSlug(profile.full_name, profile.category);

        // Si le slug est déjà optimal (contient la catégorie), on passe
        if (profile.slug === newSlug) {
            console.log(`✓ ${profile.full_name}: Déjà optimisé (${newSlug})`);
            return true;
        }

        // Vérifier si le nouveau slug existe déjà
        let finalSlug = newSlug;
        let counter = 1;

        while (true) {
            const { count } = await supabase
                .from('profiles')
                .select('id', { count: 'exact', head: true })
                .eq('slug', finalSlug)
                .neq('id', profile.id); // Exclure le profil actuel

            if (count === 0) break; // Slug disponible

            finalSlug = `${newSlug}-${counter++}`;
        }

        // Mettre à jour le slug
        const { error } = await supabase
            .from('profiles')
            .update({ slug: finalSlug })
            .eq('id', profile.id);

        if (error) {
            console.error(`❌ ${profile.full_name}: Erreur mise à jour`, error.message);
            return false;
        }

        console.log(`✓ ${profile.full_name}: ${profile.slug} → ${finalSlug}`);
        return true;
    } catch (err) {
        console.error(`❌ ${profile.full_name}: Erreur inattendue`, err);
        return false;
    }
}

async function main() {
    console.log('🚀 Migration des slugs vers format optimisé SEO\n');
    console.log('═'.repeat(60));

    // Récupérer tous les profils
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, category, slug')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('❌ Erreur récupération profils:', error.message);
        process.exit(1);
    }

    if (!profiles || profiles.length === 0) {
        console.log('⚠️  Aucun profil trouvé dans la base de données');
        process.exit(0);
    }

    console.log(`📊 ${profiles.length} profil(s) trouvé(s)\n`);

    let successCount = 0;
    let errorCount = 0;

    // Migrer chaque profil
    for (const profile of profiles as Profile[]) {
        const success = await migrateSlug(profile);
        if (success) {
            successCount++;
        } else {
            errorCount++;
        }
    }

    console.log('\n' + '═'.repeat(60));
    console.log(`✅ Migration terminée: ${successCount} succès, ${errorCount} erreurs`);

    if (errorCount > 0) {
        process.exit(1);
    }
}

main();
