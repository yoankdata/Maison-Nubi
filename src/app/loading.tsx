"use client";

import { Sparkles } from "lucide-react";

/**
 * Page de chargement globale
 * Affiché automatiquement par Next.js lors des navigations
 */
export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white">
            {/* Animation du logo */}
            <div className="relative">
                {/* Halo lumineux */}
                <div className="absolute inset-0 bg-gold/20 blur-2xl rounded-full animate-pulse scale-150" />

                {/* Logo avec animation */}
                <div className="relative flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-8 w-8 text-gold animate-pulse" />
                        <span className="font-serif text-3xl font-bold text-anthracite">
                            Maison Nubi
                        </span>
                    </div>

                    {/* Barre de chargement */}
                    <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-gold via-amber-400 to-gold animate-[loading_1.5s_ease-in-out_infinite] bg-[length:200%_100%]" />
                    </div>

                    <p className="text-sm text-muted-foreground mt-2">
                        Chargement...
                    </p>
                </div>
            </div>
        </div>
    );
}
