// Supabase Edge Function : Expiration automatique des boosts
// À exécuter via cron job quotidien (ex: 02:00 UTC)
//
// Pour déployer :
// cd orea-app && npx supabase functions deploy expire-boosts
//
// Pour configurer le cron (via Supabase Dashboard > Database > Scheduled Jobs) :
// SELECT cron.schedule('expire-boosts-daily', '0 2 * * *', 
//   $$SELECT net.http_post(url := 'https://<project>.supabase.co/functions/v1/expire-boosts', 
//     headers := '{"Authorization": "Bearer <anon_key>"}'::jsonb)$$);

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    // Gestion CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Créer client Supabase avec service role pour bypass RLS
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        const now = new Date().toISOString()
        console.log(`[expire-boosts] Exécution à ${now}`)

        // Trouver les profils avec boosts expirés
        const { data: expiredProfiles, error: fetchError } = await supabase
            .from('profiles')
            .select('id, full_name, email, premium_boost_end_at')
            .lt('premium_boost_end_at', now)
            .not('premium_boost_end_at', 'is', null)

        if (fetchError) {
            console.error('[expire-boosts] Erreur récupération profils:', fetchError)
            throw fetchError
        }

        if (!expiredProfiles || expiredProfiles.length === 0) {
            console.log('[expire-boosts] Aucun boost expiré trouvé')
            return new Response(
                JSON.stringify({ message: 'Aucun boost expiré', processed: 0 }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        console.log(`[expire-boosts] ${expiredProfiles.length} boost(s) expiré(s) à traiter`)

        // Réinitialiser les boosts expirés
        const expiredIds = expiredProfiles.map(p => p.id)

        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                premium_boost_end_at: null,
                premium_boost_activated_at: null,
            })
            .in('id', expiredIds)

        if (updateError) {
            console.error('[expire-boosts] Erreur mise à jour profils:', updateError)
            throw updateError
        }

        // Log les profils traités
        for (const profile of expiredProfiles) {
            console.log(`[expire-boosts] ✅ Boost expiré pour: ${profile.full_name} (${profile.email})`)

            // TODO: Envoyer notification email
            // await sendBoostExpiredEmail(profile.email, profile.full_name)
        }

        return new Response(
            JSON.stringify({
                message: 'Boosts expirés traités avec succès',
                processed: expiredProfiles.length,
                profiles: expiredProfiles.map(p => ({ id: p.id, name: p.full_name }))
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('[expire-boosts] Erreur:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
