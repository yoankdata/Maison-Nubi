/**
 * Validation des variables d'environnement critiques au démarrage
 * Empêche le déploiement avec une configuration incomplète
 */

const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'NEXT_PUBLIC_APP_URL',
] as const;

const optionalEnvVars = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'RESEND_API_KEY',
    'ADMIN_EMAILS',
] as const;

export function validateEnv() {
    const missing: string[] = [];
    const warnings: string[] = [];

    // Vérifier les variables requises
    requiredEnvVars.forEach(varName => {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    });

    // Vérifier les variables optionnelles (warning seulement)
    optionalEnvVars.forEach(varName => {
        if (!process.env[varName]) {
            warnings.push(varName);
        }
    });

    // Erreur fatale si variables critiques manquantes
    if (missing.length > 0) {
        console.error('❌ Variables d\'environnement manquantes:');
        missing.forEach(v => console.error(`   - ${v}`));
        throw new Error('Configuration incomplète. Vérifiez votre fichier .env');
    }

    // Warnings pour variables optionnelles
    if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
        console.warn('⚠️  Variables d\'environnement optionnelles manquantes:');
        warnings.forEach(v => console.warn(`   - ${v}`));
    }

    if (process.env.NODE_ENV === 'development') {
        console.log('✅ Variables d\'environnement validées');
    }
}
