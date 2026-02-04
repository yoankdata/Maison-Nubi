"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Page d'erreur personnalisée (Error Boundary)
 */
export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log l'erreur (en production, envoyer à un service de monitoring)
        console.error("Error:", error);
    }, [error]);

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-surface px-4">
            <div className="text-center max-w-md">
                {/* Icône d'erreur */}
                <div className="mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>

                {/* Message */}
                <h1 className="mb-4 font-serif text-2xl font-bold text-anthracite">
                    Une erreur est survenue
                </h1>
                <p className="mb-8 text-muted-foreground">
                    Nous sommes désolés, quelque chose s&apos;est mal passé. Vous pouvez
                    réessayer ou retourner à l&apos;accueil.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button
                        onClick={reset}
                        className="rounded-full bg-gold hover:bg-gold-dark text-white"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Réessayer
                    </Button>
                    <Button asChild variant="outline" className="rounded-full">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Retour à l&apos;accueil
                        </Link>
                    </Button>
                </div>

                {/* Digest (debug) */}
                {error.digest && (
                    <p className="mt-8 text-xs text-muted-foreground">
                        Code erreur : {error.digest}
                    </p>
                )}
            </div>
        </div>
    );
}
