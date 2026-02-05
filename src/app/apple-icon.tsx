import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
    width: 180,
    height: 180,
};
export const contentType = 'image/png';

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FDFCF8',
                    borderRadius: '35px', // iOS style rounded corners imitation (masked by OS anyway)
                }}
            >
                {/* Texture noise imitation via radial gradients if needed, or plain minimal luxury beige */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.4) 0%, transparent 60%)',
                }} />

                <svg width="110" height="110" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#D4AF37" />
                            <stop offset="50%" stopColor="#F5E08E" />
                            <stop offset="100%" stopColor="#B4922B" />
                        </linearGradient>
                        <filter id="shadow">
                            <feDropShadow dx="2" dy="4" stdDeviation="6" floodOpacity="0.15" />
                        </filter>
                    </defs>
                    <path d="M256 0 C256 0 286 195 480 256 C276 295 256 512 256 512 C256 512 236 295 32 256 C226 195 256 0 256 0 Z" fill="url(#g)" style={{ filter: 'url(#shadow)' }} />
                    {/* Small decorative stars */}
                    <path d="M100 300 L110 320 L130 330 L110 340 L100 360 L90 340 L70 330 L90 320 Z" fill="#D4AF37" opacity="0.8" />
                    <path d="M400 120 L410 140 L430 150 L410 160 L400 180 L390 160 L370 150 L390 140 Z" fill="#D4AF37" opacity="0.8" />
                </svg>
            </div>
        ),
        { ...size }
    );
}
