"use client";

import { Heart } from "lucide-react";
import { useAnonymousLike } from "@/hooks/use-anonymous-like";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
    profileId: string;
    initialCount?: number;
    className?: string;
    showCount?: boolean;
}

/**
 * Bouton de recommandation anonyme
 * Coeur vide -> Coeur plein (Gold) au clic
 * Utilise useOptimistic pour feedback instantane
 */
export function LikeButton({
    profileId,
    initialCount = 0,
    className,
    showCount = true
}: LikeButtonProps) {
    const { isLiked, count, isPending, toggle, isReady } = useAnonymousLike(profileId, initialCount);

    return (
        <button
            onClick={toggle}
            disabled={!isReady || isPending}
            className={cn(
                "group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
                "border border-gray-200 hover:border-gold/50",
                "bg-white hover:bg-gold/5",
                isLiked && "border-gold bg-gold/10",
                isPending && "opacity-70",
                className
            )}
            aria-label={isLiked ? "Retirer la recommandation" : "Je recommande"}
        >
            <Heart
                className={cn(
                    "h-5 w-5 transition-all duration-300",
                    isLiked
                        ? "fill-gold text-gold scale-110"
                        : "text-gray-400 group-hover:text-gold group-hover:scale-110"
                )}
            />

            {showCount && (
                <span className={cn(
                    "text-sm font-medium transition-colors",
                    isLiked ? "text-gold" : "text-gray-600"
                )}>
                    {count > 0 ? count : ""}
                </span>
            )}

            <span className={cn(
                "text-sm transition-colors hidden sm:inline",
                isLiked ? "text-gold" : "text-gray-600 group-hover:text-gold"
            )}>
                {isLiked ? "Recommande" : "Je recommande"}
            </span>
        </button>
    );
}
