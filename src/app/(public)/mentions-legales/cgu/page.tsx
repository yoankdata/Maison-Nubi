import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Conditions Générales d'Utilisation | Maison Nubi",
    description: "Conditions générales d'utilisation de la plateforme Maison Nubi - L'annuaire beauté d'Abidjan",
};

/**
 * Page des Conditions Générales d'Utilisation - Style Luxe Éditorial
 */
export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header Minimaliste */}
            <div className="w-full bg-maison-nubi-gradient py-20 md:py-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-[url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 blur-sm" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <span className="text-xs font-bold tracking-[0.3em] text-gold uppercase mb-4 block">
                        Juridique
                    </span>
                    <h1 className="font-serif text-5xl md:text-6xl text-anthracite mb-6">
                        Conditions Générales
                    </h1>
                    <div className="w-24 h-px bg-gold/50 mx-auto" />
                </div>
            </div>

            <div className="container max-w-4xl mx-auto px-6 -mt-12 relative z-20 bg-white rounded-t-3xl shadow-xl shadow-gold/5 p-8 md:p-16">
                {/* Navigation retour */}
                <div className="mb-12">
                    <Button asChild variant="ghost" className="hover:bg-transparent hover:text-gold p-0">
                        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            Retour à l'accueil
                        </Link>
                    </Button>
                </div>

                <article className="prose prose-lg prose-slate max-w-none prose-headings:font-serif prose-headings:text-anthracite prose-a:text-gold hover:prose-a:text-gold-dark prose-blockquote:border-l-gold">
                    <p className="lead font-serif text-xl text-anthracite/80 italic">
                        Dernière mise à jour : Décembre 2024
                    </p>

                    <h2 className="flex items-center gap-3 text-2xl mt-12">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 text-gold text-sm font-serif">1</span>
                        Objet
                    </h2>
                    <p>
                        Les présentes Conditions Générales d'Utilisation (CGU) définissent les modalités
                        d'accès et d'utilisation de la plateforme Maison Nubi, accessible à l'adresse maisonnubi.ci
                        (ci-après "le Site").
                    </p>
                    <p>
                        Maison Nubi est une plateforme de mise en relation entre des professionnels de la beauté
                        (coiffeurs, maquilleurs, esthéticiennes, etc.) et des clients potentiels situés
                        principalement à Abidjan, Côte d'Ivoire.
                    </p>

                    <h2 className="flex items-center gap-3 text-2xl mt-12">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 text-gold text-sm font-serif">2</span>
                        Acceptation des CGU
                    </h2>
                    <p>
                        L'utilisation du Site implique l'acceptation pleine et entière des présentes CGU.
                        Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le Site.
                    </p>

                    <h2 className="flex items-center gap-3 text-2xl mt-12">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 text-gold text-sm font-serif">3</span>
                        Inscription et Compte
                    </h2>
                    <h3>3.1 Création de compte</h3>
                    <p>
                        Pour accéder à certaines fonctionnalités (création de profil prestataire,
                        abonnement premium), vous devez créer un compte en fournissant des informations
                        exactes et complètes.
                    </p>
                    <h3>3.2 Responsabilité du compte</h3>
                    <p>
                        Vous êtes responsable de la confidentialité de vos identifiants de connexion
                        et de toutes les activités effectuées depuis votre compte.
                    </p>

                    <h2 className="flex items-center gap-3 text-2xl mt-12">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 text-gold text-sm font-serif">4</span>
                        Services Proposés
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 not-prose my-8">
                        <div className="p-6 bg-surface/50 rounded-xl border border-transparent hover:border-gold/20 transition-colors">
                            <h4 className="font-serif text-lg font-bold text-anthracite mb-3">Offre Gratuite</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex gap-2"><span className="text-gold">•</span> Création profil prestataire</li>
                                <li className="flex gap-2"><span className="text-gold">•</span> Affichage services et tarifs</li>
                                <li className="flex gap-2"><span className="text-gold">•</span> Jusqu'à 3 photos galerie</li>
                            </ul>
                        </div>
                        <div className="p-6 bg-anthracite text-white rounded-xl shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gold/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                            <h4 className="font-serif text-lg font-bold text-gold mb-3 flex items-center gap-2">
                                NUBI GOLD <Scale className="h-4 w-4" />
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li className="flex gap-2"><span className="text-gold">•</span> Badge Premium distinctif</li>
                                <li className="flex gap-2"><span className="text-gold">•</span> Priorité résultats recherche</li>
                                <li className="flex gap-2"><span className="text-gold">•</span> Photos illimitées & Vérifié</li>
                            </ul>
                        </div>
                    </div>

                    <h2 className="flex items-center gap-3 text-2xl mt-12">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 text-gold text-sm font-serif">5</span>
                        Paiements
                    </h2>
                    <p>
                        L'abonnement NUBI GOLD est payable mensuellement via Mobile Money (Wave ou Orange Money).
                        Les paiements sont effectués au numéro 07 07 75 62 97. L'activation se fait sous 24h après réception du paiement.
                    </p>

                    <h2 className="flex items-center gap-3 text-2xl mt-12">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 text-gold text-sm font-serif">6</span>
                        Contenu Utilisateur
                    </h2>
                    <p>
                        Vous conservez tous les droits sur le contenu que vous publiez. En publiant sur Maison Nubi, vous accordez au Site une licence
                        non-exclusive pour afficher ce contenu. Vous vous engagez à ne publier que du contenu dont vous êtes l'auteur.
                    </p>

                    <div className="bg-red-50 p-6 rounded-xl border-l-4 border-red-400 my-8">
                        <h3 className="text-red-800 font-serif text-lg mt-0">7. Comportement Interdit</h3>
                        <p className="text-red-700 text-sm mb-0">
                            Il est strictement interdit de publier du contenu illégal, d'usurper l'identité d'un tiers ou d'utiliser le site à des fins frauduleuses.
                        </p>
                    </div>

                    <h2 className="flex items-center gap-3 text-2xl mt-12">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 text-gold text-sm font-serif">8</span>
                        Limitation de Responsabilité
                    </h2>
                    <p>
                        Maison Nubi agit en tant qu'intermédiaire et ne peut être tenu responsable des
                        prestations effectuées par les professionnels inscrits sur la plateforme.
                    </p>

                    <div className="mt-16 pt-8 border-t border-border/50 text-center">
                        <p className="text-lg font-serif text-anthracite mb-4">Une question sur nos conditions ?</p>
                        <Button asChild size="lg" className="rounded-full bg-anthracite text-white hover:bg-gold transition-colors px-8">
                            <a href="mailto:contact@maisonnubi.ci">Nous contacter</a>
                        </Button>
                    </div>
                </article>
            </div>
        </div>
    );
}
