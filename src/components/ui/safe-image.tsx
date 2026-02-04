"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { ImageIcon } from "lucide-react";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
    fallbackSrc?: string;
}

export function SafeImage({ src, alt, fallbackSrc, className, ...props }: SafeImageProps) {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        if (fallbackSrc) {
            return (
                <Image
                    src={fallbackSrc}
                    alt={alt}
                    className={className}
                    {...props}
                    onError={() => { }} // Bloque la boucle infinie si fallback casse aussi
                />
            );
        }

        // Si pas de fallback, on cache l'image ou on affiche un placeholder
        return (
            <div className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}>
                <ImageIcon className="w-8 h-8 opacity-20" />
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            className={className}
            {...props}
            onError={() => setHasError(true)}
        />
    );
}
