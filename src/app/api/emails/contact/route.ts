import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { createClient } from '@/lib/supabase-server';

// ============================================
// RATE LIMITING EN MÉMOIRE
// Note: En prod sur Vercel, utiliser upstash/ratelimit
// pour un rate limiting persistant entre les instances
// ============================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;     // 10 requêtes max par minute par IP

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
        // Nouvelle fenêtre ou première requête
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
        return false;
    }

    if (record.count >= MAX_REQUESTS_PER_WINDOW) {
        return true; // Limite atteinte
    }

    record.count++;
    return false;
}

// Nettoyer périodiquement les anciennes entrées (évite les fuites mémoire)
setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rateLimitMap.entries()) {
        if (now > record.resetTime) {
            rateLimitMap.delete(ip);
        }
    }
}, 60 * 1000); // Nettoyage toutes les minutes

/**
 * API Route pour notifier un prestataire qu'un client l'a contacté
 * POST /api/emails/contact
 * 
 * Protections :
 * - Validation de l'origine (CORS)
 * - Rate limiting (10 req/min par IP)
 * - Vérification que le prestataire existe en base
 */
export async function POST(request: Request) {
    try {
        // ========== 1. VALIDATION DE L'ORIGINE ==========
        const headersList = await headers();
        const origin = headersList.get('origin') || headersList.get('referer') || '';
        const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        // Vérifier que la requête vient de notre domaine
        if (!origin.startsWith(allowedOrigin)) {
            console.warn(`Requête bloquée - Origine non autorisée: ${origin}`);
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        // ========== 2. RATE LIMITING ==========
        const forwarded = headersList.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

        if (isRateLimited(ip)) {
            console.warn(`Rate limit atteint pour IP: ${ip}`);
            return NextResponse.json(
                { error: 'Trop de requêtes. Réessayez dans une minute.' },
                { status: 429 }
            );
        }

        // ========== 3. VÉRIFIER QUE RESEND EST CONFIGURÉ ==========
        if (!resend) {
            console.warn('Resend non configuré - Email de contact ignoré');
            return NextResponse.json({ success: true, skipped: true });
        }

        const body = await request.json();
        const { providerEmail, providerName, clientInterest } = body;

        if (!providerEmail || !providerName) {
            return NextResponse.json(
                { error: 'Email et nom du prestataire requis' },
                { status: 400 }
            );
        }

        // ========== 4. VÉRIFIER QUE LE PRESTATAIRE EXISTE ==========
        const supabase = await createClient();
        if (supabase) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', providerEmail)
                .eq('status', 'active')
                .single();

            if (!profile) {
                console.warn(`Prestataire non trouvé: ${providerEmail}`);
                return NextResponse.json(
                    { error: 'Prestataire non trouvé' },
                    { status: 404 }
                );
            }
        }

        // Envoyer la notification
        const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: providerEmail,
            subject: '🎉 Un client s\'intéresse à vous sur Maison Nubi !',
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px; text-align: center;">
                            <h1 style="margin: 0; font-size: 32px; color: #D4AF37; font-family: Georgia, serif; letter-spacing: 2px;">
                                Maison Nubi
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 48px 40px; text-align: center;">
                            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #D4AF37 0%, #f59e0b 100%); border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
                                <span style="font-size: 36px;">🎉</span>
                            </div>
                            
                            <h2 style="margin: 0 0 16px; font-size: 24px; color: #1a1a1a; font-family: Georgia, serif; font-weight: normal;">
                                Bonne nouvelle, ${providerName} !
                            </h2>
                            
                            <p style="margin: 0 0 32px; font-size: 18px; color: #666666; line-height: 1.6;">
                                Un client vient de cliquer sur votre profil pour vous contacter via WhatsApp !
                            </p>
                            
                            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 24px; border-radius: 12px; margin: 0 0 32px;">
                                <p style="margin: 0; font-size: 14px; color: #166534;">
                                    <strong>💬 Restez réactif !</strong><br>
                                    Une réponse rapide augmente vos chances de décrocher ce client.
                                </p>
                            </div>
                            
                            ${clientInterest ? `
                            <p style="margin: 0 0 24px; font-size: 14px; color: #9ca3af;">
                                Le client s'intéresse à : <strong style="color: #1a1a1a;">${clientInterest}</strong>
                            </p>
                            ` : ''}
                            
                            <a href="https://maisonnubi.com/espace-pro/profil" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                                Voir mon tableau de bord
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Tip -->
                    <tr>
                        <td style="padding: 0 40px 40px;">
                            <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); padding: 20px; border-radius: 12px; text-align: center;">
                                <p style="margin: 0; font-size: 14px; color: #92400e;">
                                    <strong>💡 Astuce Pro :</strong> Passez à <span style="color: #D4AF37; font-weight: bold;">NUBI GOLD</span> pour apparaître en premier et attirer plus de clients !
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                                © ${new Date().getFullYear()} Maison Nubi - L'annuaire beauté premium d'Abidjan
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
            `,
        });

        if (error) {
            console.error('Erreur Resend:', error);
            return NextResponse.json(
                { error: 'Erreur lors de l\'envoi de l\'email' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erreur API contact:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}
