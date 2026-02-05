import { Metadata } from 'next';
import PricingClient from './pricing-client';

export const metadata: Metadata = {
    title: "Nos Tarifs | Maison Nubi Pro",
    description: "Découvrez nos offres pour les professionnels de la beauté. Boostez votre visibilité à Abidjan avec Maison Nubi Gold.",
    alternates: {
        canonical: "/tarifs",
    },
};

export default function PricingPage() {
    return <PricingClient />;
}