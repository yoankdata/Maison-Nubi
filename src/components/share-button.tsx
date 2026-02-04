"use client";

import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ShareButtonProps {
    url: string;
    title: string;
}

export function ShareButton({ url, title }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        // Essayer l'API Share native (Mobile)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `Découvrez ${title} sur Maison Nubi`,
                    url: url,
                });
                return;
            } catch (err) {
                console.log("Erreur partage natif ou annulation:", err);
            }
        }

        // Fallback: Copier le lien
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Impossible de copier", err);
        }
    };

    return (
        <Button
            size="icon"
            variant="outline"
            className="rounded-full h-10 w-10 md:h-12 md:w-12 border-gray-200"
            onClick={handleShare}
            title="Partager"
        >
            {copied ? (
                <Check className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
            ) : (
                <Share2 className="h-4 w-4 md:h-5 md:w-5" />
            )}
        </Button>
    );
}
