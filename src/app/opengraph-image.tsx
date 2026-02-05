import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const alt = 'Maison Nubi - L\'excellence de la beauté ivoirienne';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FDFCF8', // Fond crème/beige très clair
                    backgroundImage: 'radial-gradient(circle at 25px 25px, #E5E5E5 2%, transparent 0%), radial-gradient(circle at 75px 75px, #E5E5E5 2%, transparent 0%)',
                    backgroundSize: '100px 100px',
                }}
            >
                {/* Star Icon Symbol */}
                <div style={{ display: 'flex', marginBottom: 20 }}>
                    <svg width="120" height="120" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M256 0 C256 0 286 195 480 256 C276 295 256 512 256 512 C256 512 236 295 32 256 C226 195 256 0 256 0 Z" fill="#D4AF37" />
                    </svg>
                </div>

                {/* Text */}
                <div
                    style={{
                        display: 'flex',
                        fontSize: 130,
                        fontFamily: 'Times New Roman', // Serif font standard available in edge
                        color: '#D4AF37', // Gold color
                        fontWeight: 'bold',
                        letterSpacing: '-0.05em',
                        lineHeight: 1,
                    }}
                >
                    Maison
                </div>
                <div
                    style={{
                        display: 'flex',
                        fontSize: 130,
                        fontFamily: 'Times New Roman',
                        color: '#D4AF37',
                        marginBottom: 40,
                        fontWeight: 'bold',
                        letterSpacing: '-0.05em',
                        lineHeight: 1,
                    }}
                >
                    Nubi
                </div>

                {/* Tagline */}
                <div
                    style={{
                        display: 'flex',
                        fontSize: 32,
                        color: '#525252',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        marginTop: 20,
                    }}
                >
                    L'annuaire beauté premium
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
