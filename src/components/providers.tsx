"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

interface ProvidersProps {
    children: ReactNode;
}

/**
 * Providers globaux de l'application Maison Nubi
 * - QueryClientProvider pour TanStack Query (data fetching)
 * - Autres providers peuvent être ajoutés ici (Auth, Toast, etc.)
 */
export function Providers({ children }: ProvidersProps) {
    // Créer un QueryClient par instance pour éviter le partage entre requêtes
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Temps avant qu'une requête soit considérée comme "stale"
                        staleTime: 60 * 1000, // 1 minute
                        // Temps de cache
                        gcTime: 5 * 60 * 1000, // 5 minutes
                        // Retry automatique
                        retry: 1,
                        // Refetch automatique quand la fenêtre reprend le focus
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
