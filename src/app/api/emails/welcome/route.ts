import { NextResponse } from 'next/server';
import { resend, FROM_EMAIL } from '@/lib/resend';

/**
 * API Route pour envoyer l'email de bienvenue
 * POST /api/emails/welcome
 */
export async function POST(request: Request) {
    try {
        // Vérifier que Resend est configuré
        if (!resend) {
            console.warn('Resend non configuré - Email de bienvenue ignoré');
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

        // Envoyer l'email de bienvenue
        const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: '✨ Bienvenue sur Maison Nubi !',
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
                            <p style="margin: 8px 0 0; font-size: 12px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 3px;">
                                L'annuaire beauté premium
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 48px 40px;">
                            <h2 style="margin: 0 0 24px; font-size: 28px; color: #1a1a1a; font-family: Georgia, serif; font-weight: normal;">
                                Bienvenue, ${name} !
                            </h2>
                            
                            <p style="margin: 0 0 24px; font-size: 16px; color: #666666; line-height: 1.6;">
                                Félicitations ! Votre profil professionnel a été créé avec succès sur Maison Nubi. 
                                Vous faites désormais partie de la communauté des meilleurs talents beauté d'Abidjan.
                            </p>
                            
                            <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-left: 4px solid #D4AF37; padding: 20px; border-radius: 8px; margin: 32px 0;">
                                <p style="margin: 0; font-size: 14px; color: #1a1a1a;">
                                    <strong style="color: #D4AF37;">💡 Astuce :</strong><br>
                                    Complétez votre profil avec des photos de vos réalisations pour attirer plus de clients !
                                </p>
                            </div>
                            
                            <a href="https://maisonnubi.ci/espace-pro/profil" style="display: inline-block; background-color: #D4AF37; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-top: 16px;">
                                Compléter mon profil
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                                © 2026 Maison Nubi - L'annuaire beauté premium d'Abidjan
                            </p>
                            <p style="margin: 8px 0 0; font-size: 12px; color: #9ca3af;">
                                <a href="https://maisonnubi.ci" style="color: #D4AF37; text-decoration: none;">maisonnubi.ci</a>
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
        console.error('Erreur API welcome:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}
