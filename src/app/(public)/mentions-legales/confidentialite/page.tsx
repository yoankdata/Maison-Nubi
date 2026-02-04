import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Politique de Confidentialité | Maison Nubi",
    description: "Politique de confidentialité et protection des données personnelles sur Maison Nubi",
};

/**
 * Page de Politique de Confidentialité - Style Luxe Éditorial
 */
export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header Minimaliste */}
            <div className="w-full bg-maison-nubi-gradient py-20 md:py-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-[url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 blur-sm mix-blend-multiply" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <span className="text-xs font-bold tracking-[0.3em] text-gold uppercase mb-4 block">
                        Protection des données
                    </span>
                    <h1 className="font-serif text-5xl md:text-6xl text-anthracite mb-6">
                        Confidentialité
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

                <article className="prose prose-lg prose-slate max-w-none prose-headings:font-serif prose-headings:text-anthracite prose-a:text-gold hover:prose-a:text-gold-dark">
                    <p className="lead font-serif text-xl text-anthracite/80 italic mb-12">
                        Votre confiance est précieuse. Voici comment nous protégeons vos données sur Maison Nubi.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-8 not-prose mb-16">
                        <div className="p-6 bg-surface/30 rounded-xl">
                            <Shield className="h-8 w-8 text-gold mb-4" />
                            <h3 className="font-serif text-lg font-bold text-anthracite mb-2">Protection</h3>
                            <p className="text-sm text-muted-foreground">Chiffrement SSL et protocoles de sécurité avancés pour toutes vos données.</p>
                        </div>
                        <div className="p-6 bg-surface/30 rounded-xl">
                            <Lock className="h-8 w-8 text-gold mb-4" />
                            <h3 className="font-serif text-lg font-bold text-anthracite mb-2">Confidentialité</h3>
                            <p className="text-sm text-muted-foreground">Vos données privées ne sont jamais vendues à des tiers.</p>
                        </div>
                    </div>

                    <h2 className="flex items-center gap-3 text-2xl">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 text-gold text-sm font-serif">1</span>
                        Données Collectées
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
                        <div className="border border-border/50 rounded-lg p-5">
                            <h4 className="font-serif font-bold text-anthracite mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Inscription
                            </h4>
                            <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                                <li>Nom complet / Commercial</li>
                                <li>Adresse email</li>
                                <li>Numéro WhatsApp</li>
                                <li>Catégorie pro</li>
                            </ul>
                        </div>
                        <div className="border border-border/50 rounded-lg p-5">
                            <h4 className="font-serif font-bold text-anthracite mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Profil Public
                            </h4>
                            <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                                <li>Photo de profil</li>
                                <li>Biographie & Portfolio</li>
                                <li>Services & Tarifs</li>
                                <li>Localisation</li>
                            </ul>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground italic bg-gray-50 p-4 rounded-lg border border-gray-100">
                        Note : Les paiements se font par Mobile Money (Wave/Orange Money). Nous ne stockons aucune information bancaire.
                    </p>

                    <h2 className="flex items-center gap-3 text-2xl mt-12">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 text-gold text-sm font-serif">2</span>
                        Utilisation des Données
                    </h2>
                    <ul className="list-none space-y-2 pl-0">
                        <li className="flex items-center gap-3">
                            <Eye className="h-4 w-4 text-gold shrink-0" />
                            <span>Afficher votre profil aux clients potentiels</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Database className="h-4 w-4 text-gold shrink-0" />
                            <span>Gérer votre compte et vos abonnements</span>
                        </li>
                    </ul>

                    <h2 className="flex items-center gap-3 text-2xl mt-12">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 text-gold text-sm font-serif">3</span>
                        Partage & Tiers
                    </h2>
                    <p>
                        Vos données de profil sont publiques par nature. Pour le reste, nous partageons uniquement le strict nécessaire avec nos partenaires techniques :
                    </p>
                    <ul>
                        <li><strong>Supabase</strong> : Hébergement sécurisé des données</li>
                        <li><strong>Vercel</strong> : Hébergement de l'infrastructure web</li>
                    </ul>

                    <h2 className="flex items-center gap-3 text-2xl mt-12">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 text-gold text-sm font-serif">4</span>
                        Vos Droits
                    </h2>
                    <p>Conformément à la réglementation, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.</p>
                    <p>
                        Pour exercer ces droits ou supprimer votre compte, contactez simplement notre DPO à : <br />
                        <a href="mailto:contact@maisonnubi.ci" className="font-serif text-gold text-lg no-underline hover:underline">contact@maisonnubi.ci</a>
                    </p>

                    <div className="mt-16 pt-8 border-t border-border/50 flex flex-col items-center">
                        <p className="text-sm text-muted-foreground mb-4">Dernière mise à jour : Décembre 2024</p>
                    </div>
                </article>
            </div>
        </div>
    );
}
