import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Politique de Cookies | Maison Nubi",
    description: "Informations sur l'utilisation des cookies sur Maison Nubi.",
};

export default function CookiesPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-anthracite mb-8">
                Politique de Gestion des Cookies
            </h1>

            <div className="prose prose-slate max-w-none space-y-8">
                <section>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Chez Maison Nubi, nous privilégions la transparence. Cette politique explique comment nous utilisons les cookies pour améliorer votre expérience sur notre plateforme de beauté.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-anthracite mb-4">1. Qu'est-ce qu'un cookie ?</h2>
                    <p className="text-slate-600">
                        Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, mobile, tablette) lors de la visite de notre site. Il permet de mémoriser vos préférences et de faciliter votre navigation.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-anthracite mb-4">2. Les cookies que nous utilisons</h2>
                    <div className="space-y-4">
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <h3 className="font-bold text-anthracite mb-2">Cookies Essentiels (Techniques)</h3>
                            <p className="text-sm text-slate-600">
                                Indispensables au bon fonctionnement du site (connexion à votre compte, sécurité des paiements, mémorisation du panier). Ils ne peuvent pas être désactivés.
                            </p>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <h3 className="font-bold text-anthracite mb-2">Cookies de Performance (Analytiques)</h3>
                            <p className="text-sm text-slate-600">
                                Nous aident à comprendre comment le site est utilisé (pages les plus visitées, temps passé) afin d'améliorer l'expérience utilisateur. Ces données sont anonymes.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-anthracite mb-4">3. Vos choix concernant les cookies</h2>
                    <p className="text-slate-600 mb-4">
                        Vous pouvez à tout moment configurer votre navigateur pour accepter ou refuser les cookies. Cependant, le refus des cookies essentiels peut altérer certaines fonctionnalités du site (comme la connexion pro).
                    </p>
                    <ul className="list-disc pl-5 text-slate-600 space-y-2">
                        <li>Pour Chrome : Paramètres {'>'} Confidentialité et sécurité</li>
                        <li>Pour Safari : Préférences {'>'} Confidentialité</li>
                        <li>Pour Firefox : Options {'>'} Vie privée et sécurité</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-anthracite mb-4">4. Mise à jour</h2>
                    <p className="text-slate-600">
                        Cette politique peut être mise à jour en fonction des évolutions légales ou techniques.
                        Dernière mise à jour : Février 2026.
                    </p>
                </section>
            </div>
        </div>
    );
}
