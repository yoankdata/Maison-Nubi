import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton de chargement pour la page profil prestataire
 * Affiche une fausse structure pendant le chargement des données
 */
export default function ProviderLoading() {
    return (
        <div className="min-h-screen bg-surface">
            <div className="container mx-auto px-4 py-8">
                {/* Retour skeleton */}
                <Skeleton className="h-6 w-32 mb-6" />

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Colonne principale */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header profil skeleton */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-6">
                                    {/* Avatar */}
                                    <Skeleton className="h-24 w-24 rounded-full flex-shrink-0" />

                                    {/* Infos */}
                                    <div className="flex-1 space-y-3">
                                        <Skeleton className="h-8 w-64" />
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-6 w-24 rounded-full" />
                                            <Skeleton className="h-6 w-20 rounded-full" />
                                        </div>
                                        <Skeleton className="h-4 w-32" />
                                        <div className="pt-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-3/4 mt-2" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Services skeleton */}
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-7 w-40" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between py-2">
                                        <Skeleton className="h-5 w-48" />
                                        <Skeleton className="h-6 w-24" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Galerie skeleton */}
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-7 w-32" />
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {[...Array(6)].map((_, i) => (
                                        <Skeleton key={i} className="aspect-square rounded-xl" />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar skeleton */}
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <Skeleton className="h-12 w-full rounded-full" />
                                <Skeleton className="h-10 w-full rounded-full" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
