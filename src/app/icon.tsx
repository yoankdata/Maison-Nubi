import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
    width: 32,
    height: 32,
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
                    background: 'transparent',
                }}
            >
                <svg width="32" height="32" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#D4AF37" />
                            <stop offset="50%" stopColor="#F5E08E" />
                            <stop offset="100%" stopColor="#B4922B" />
                        </linearGradient>
                    </defs>
                    <path d="M256 0 C256 0 286 195 480 256 C276 295 256 512 256 512 C256 512 236 295 32 256 C226 195 256 0 256 0 Z" fill="url(#g)" />
                </svg>
            </div>
        ),
        { ...size }
    );
}
