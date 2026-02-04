import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

interface PublicLayoutProps {
    children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    return (
        // 1. Définition des couleurs de base pour éviter le flash de contenu non stylisé
        <div className="flex min-h-screen flex-col bg-white text-anthracite font-sans selection:bg-gold/20 selection:text-anthracite">

            {/* 2. Lien d'évitement (Accessibilité Standard Web) */}
            {/* Permet aux utilisateurs clavier de passer la navigation */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-6 focus:py-2 focus:bg-anthracite focus:text-white focus:rounded-full focus:outline-none focus:ring-2 focus:ring-gold transition-transform"
            >
                Aller au contenu principal
            </a>

            <Navbar />

            {/* 3. Zone Principale */}
            {/* Relative pour contenir d'éventuels éléments décoratifs en background */}
            <main id="main-content" className="flex-1 w-full relative flex flex-col">
                {/* 4. Texture de bruit (Optionnel mais très "Luxe") */}
                {/* Si vous n'avez pas l'image noise.png, supprimez cette div, mais c'est un détail qui ajoute de la "matière" */}
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.02] pointer-events-none mix-blend-multiply -z-10" />

                {children}
            </main>

            <Footer />
        </div>
    );
}
