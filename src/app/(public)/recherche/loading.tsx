import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton de chargement pour la page de recherche
 * Affiche une fausse grille de résultats pendant le chargement
 */
export default function SearchLoading() {
    return (
        <div className="min-h-screen bg-surface">
            <div className="container mx-auto px-4 py-8">
                {/* Titre skeleton */}
                <div className="mb-8">
                    <Skeleton className="h-10 w-64 mb-2" />
                    <Skeleton className="h-5 w-96" />
                </div>

                {/* Filtres skeleton */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <Skeleton className="h-10 w-full max-w-md rounded-full" />
                    <Skeleton className="h-10 w-32 rounded-lg" />
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>

                {/* Grille de résultats skeleton */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                            <CardContent className="p-0">
                                {/* Image skeleton */}
                                <Skeleton className="aspect-[4/3] w-full" />

                                {/* Contenu skeleton */}
                                <div className="p-4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-5 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-8 w-20 rounded-full" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
