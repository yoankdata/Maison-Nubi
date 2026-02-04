import { NextResponse } from 'next/server';
import { resend, FROM_EMAIL } from '@/lib/resend';

/**
 * API Route pour envoyer l'email de confirmation NUBI GOLD
 * POST /api/emails/nubi-gold
 */
export async function POST(request: Request) {
    try {
        // Vérifier que Resend est configuré
        if (!resend) {
            console.warn('Resend non configuré - Email NUBI GOLD ignoré');
            return NextResponse.json({ success: true, skipped: true });
        }

        const body = await request.json();
        const { email, name } = body;

        if (!email || !name) {
            return NextResponse.json(
                { error: 'Email et nom requis' },
                { status: 400 }
            );
        }

        // Envoyer l'email de confirmation NUBI GOLD
        const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: '👑 Bienvenue dans le club NUBI GOLD !',
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #1a1a1a; font-family: 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 40px rgba(212,175,55,0.3);">
                    
                    <!-- Header Premium -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #D4AF37 0%, #B8972E 100%); padding: 48px 40px; text-align: center;">
                            <div style="font-size: 48px; margin-bottom: 16px;">👑</div>
                            <h1 style="margin: 0; font-size: 32px; color: #ffffff; font-family: Georgia, serif; letter-spacing: 2px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                                NUBI GOLD
                            </h1>
                            <p style="margin: 8px 0 0; font-size: 14px; color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 3px;">
                                Bienvenue dans l'élite
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 48px 40px;">
                            <h2 style="margin: 0 0 24px; font-size: 26px; color: #1a1a1a; font-family: Georgia, serif; font-weight: normal;">
                                Félicitations, ${name} ! 🎉
                            </h2>
                            
                            <p style="margin: 0 0 24px; font-size: 16px; color: #666666; line-height: 1.6;">
                                Votre abonnement <strong style="color: #D4AF37;">NUBI GOLD</strong> est maintenant actif ! 
                                Vous faites désormais partie des professionnels premium de Maison Nubi.
                            </p>
                            
                            <!-- Avantages -->
                            <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 12px; padding: 24px; margin: 32px 0;">
                                <p style="margin: 0 0 16px; font-size: 14px; color: #1a1a1a; font-weight: bold;">
                                    ✨ Vos avantages exclusifs :
                                </p>
                                <table cellpadding="0" cellspacing="0" style="width: 100%;">
                                    <tr>
                                        <td style="padding: 8px 0; font-size: 14px; color: #666666;">
                                            <span style="color: #D4AF37; margin-right: 8px;">✓</span>
                                            Badge Premium visible sur votre profil
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-size: 14px; color: #666666;">
                                            <span style="color: #D4AF37; margin-right: 8px;">✓</span>
                                            Apparition en tête des résultats de recherche
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-size: 14px; color: #666666;">
                                            <span style="color: #D4AF37; margin-right: 8px;">✓</span>
                                            Galerie photos illimitée
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-size: 14px; color: #666666;">
                                            <span style="color: #D4AF37; margin-right: 8px;">✓</span>
                                            Profil vérifié et recommandé
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <p style="margin: 0 0 24px; font-size: 14px; color: #999999; line-height: 1.6;">
                                Votre abonnement sera renouvelé chaque mois. Pour toute question, 
                                contactez-nous sur WhatsApp au <strong style="color: #1a1a1a;">07 07 75 62 97</strong>.
                            </p>
                            
                            <a href="https://maisonnubi.ci/espace-pro/profil" style="display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #B8972E 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 16px rgba(212,175,55,0.3);">
                                Accéder à mon espace
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #1a1a1a; padding: 24px 40px; text-align: center;">
                            <p style="margin: 0; font-size: 14px; color: #D4AF37; font-family: Georgia, serif;">
                                Maison Nubi
                            </p>
                            <p style="margin: 8px 0 0; font-size: 12px; color: #666666;">
                                L'annuaire beauté premium d'Abidjan
                            </p>
                            <p style="margin: 16px 0 0; font-size: 11px; color: #444444;">
                                © 2026 Maison Nubi - Tous droits réservés
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
        console.error('Erreur API nubi-gold:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}
