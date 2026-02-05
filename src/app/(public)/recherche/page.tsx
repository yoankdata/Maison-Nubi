import { Metadata } from 'next';
import SearchClient from './search-client';

export const metadata: Metadata = {
    title: "Recherche - Trouvez votre prestataire beauté | Maison Nubi",
    description: "Recherchez parmi les meilleurs coiffeurs, maquilleurs et instituts à Abidjan. Filtrez par quartier, prix et avis pour trouver la perle rare.",
    alternates: {
        canonical: "/recherche",
    },
    openGraph: {
        title: "Recherche Maison Nubi | Trouvez les meilleurs Pros",
        description: "Coiffure, Maquillage, Oncglere... Trouvez et réservez les meilleurs talents d'Abidjan.",
        url: "https://maisonnubi.com/recherche",
    }
};

export default function SearchPage() {
    return <SearchClient />;
}
