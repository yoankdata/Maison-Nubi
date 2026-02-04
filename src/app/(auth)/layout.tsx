import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
    title: "Connexion | Maison Nubi",
    description: "Accédez à votre espace professionnel",
};

/**
 * Layout "Immersif" pour les pages d'authentification
 * Split Screen : Image d'ambiance à gauche, Formulaire à droite
 */
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container relative h-screen max-w-none flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-white">
            {/* Lien retour mobile */}
            <div className="absolute left-4 top-4 z-50 lg:hidden">
                <Link href="/" className="flex items-center gap-2 text-sm font-medium text-anthracite">
                    <ArrowLeft className="h-4 w-4" /> Retour
                </Link>
            </div>

            {/* Partie Gauche : Visuel Immersif */}
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-anthracite" />
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=2574&auto=format&fit=crop')" }}
                />

                {/* Logo */}
                <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
                    <Sparkles className="h-6 w-6 text-gold" />
                    <span className="font-serif text-2xl font-bold tracking-tight">Maison Nubi</span>
                </div>

                {/* Citation */}
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="font-serif text-3xl font-light italic leading-snug">
                            &ldquo;L'élégance ivoirienne n'est pas un choix, c'est un héritage.&rdquo;
                        </p>
                        <footer className="text-sm text-gold mt-4 uppercase tracking-widest font-bold">
                            L'Esprit d'Abidjan
                        </footer>
                    </blockquote>
                </div>
            </div>

            {/* Partie Droite : Formulaire */}
            <div className="lg:p-8 h-full flex items-center justify-center bg-surface lg:bg-white animate-in slide-in-from-right-10 duration-700">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
                    {/* Lien retour desktop */}
                    <Link
                        href="/"
                        className="absolute right-8 top-8 hidden items-center gap-2 text-sm font-medium text-muted-foreground hover:text-anthracite lg:flex transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
                    </Link>

                    {children}
                </div>
            </div>
        </div>
    );
}
