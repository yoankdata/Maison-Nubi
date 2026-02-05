import { Metadata } from 'next';
import RegisterClient from './register-client';

export const metadata: Metadata = {
    title: "Inscription Pro | Maison Nubi",
    description: "Créez votre profil professionnel gratuitement et boostez votre visibilité. Rejoignez l'élite de la beauté en Côte d'Ivoire.",
    alternates: {
        canonical: "/inscription",
    },
};

export default function RegisterPage() {
    return <RegisterClient />;
}
