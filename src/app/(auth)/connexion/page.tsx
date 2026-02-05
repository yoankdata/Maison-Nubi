import { Metadata } from 'next';
import LoginClient from './login-client';

export const metadata: Metadata = {
    title: "Connexion Espace Pro | Maison Nubi",
    description: "Accédez à votre espace professionnel pour gérer votre visibilité et vos clients sur Maison Nubi.",
    alternates: {
        canonical: "/connexion",
    },
};

export default function LoginPage() {
    return <LoginClient />;
}
