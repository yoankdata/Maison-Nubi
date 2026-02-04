import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Page 404 personnalisée
 */
export default function NotFound() {
    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-surface px-4">
            <div className="text-center max-w-md">
                {/* Illustration 404 */}
                <div className="mb-8">
                    <span className="text-8xl font-serif font-bold bg-gradient-to-r from-gold to-gold-dark bg-clip-text text-transparent">
                        404
                    </span>
                </div>

                {/* Message */}
                <h1 className="mb-4 font-serif text-2xl font-bold text-anthracite">
                    Oups, cette beauté semble introuvable
                </h1>
                <p className="mb-8 text-muted-foreground">
                    La page que vous recherchez n&apos;existe pas ou a été déplacée.
                    Pas de panique, vous pouvez retrouver votre chemin vers la beauté.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button
                        asChild
                        className="rounded-full bg-gold hover:bg-gold-dark text-white"
                    >
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Retour à l&apos;accueil
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="rounded-full">
                        <Link href="/recherche">
                            <Search className="mr-2 h-4 w-4" />
                            Rechercher un pro
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
