import Link from "next/link";
import { Instagram, MapPin, Mail, Sparkles } from "lucide-react";

// Liens du footer organisés par catégorie
const footerLinks = {
    navigation: [
        { href: "/recherche", label: "Rechercher un talent" },
        { href: "/a-propos", label: "Notre mission" },
        { href: "/tarifs", label: "Espace Professionnel" },
        { href: "/connexion", label: "Mon compte" },
    ],
    categories: [
        { href: "/recherche?category=coiffure", label: "Coiffure & Tresses" },
        { href: "/recherche?category=makeup", label: "Maquillage" },
        { href: "/recherche?category=onglerie", label: "Onglerie" },
        { href: "/recherche?category=regard", label: "Regard (Cils & Sourcils)" },
        { href: "/recherche?category=soins", label: "Soins & Esthétique" },
        { href: "/recherche?category=spa", label: "Bien-être & Spa" },
        { href: "/recherche?category=henne", label: "Henné" },
        { href: "/recherche?category=barber", label: "Barber Shop" },
    ],
    legal: [
        { href: "/mentions-legales/cgu", label: "Conditions Générales" },
        { href: "/mentions-legales/confidentialite", label: "Politique de Confidentialité" },
        { href: "/mentions-legales/cookies", label: "Gestion des cookies" },
    ],
};

/**
 * Footer Maison Nubi - Version améliorée
 */
export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-anthracite text-white border-t border-gold/10 font-sans">
            {/* Section principale */}
            <div className="container mx-auto px-4 py-16 md:py-20">
                <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Colonne 1 : Marque */}
                    <div className="space-y-6 sm:col-span-2 lg:col-span-1">
                        <Link href="/" className="inline-flex items-center gap-2 group">
                            <Sparkles className="h-5 w-5 text-gold transition-transform group-hover:scale-110 group-hover:rotate-12 duration-300" />
                            <span className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-gold transition-colors duration-300">
                                Maison Nubi
                            </span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed text-sm max-w-xs">
                            La première plateforme digitale dédiée à l'excellence de la beauté en Côte d'Ivoire.
                        </p>
                    </div>

                    {/* Colonne 2 : Navigation */}
                    <div className="space-y-5">
                        <h4 className="font-semibold text-base text-white tracking-wide relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-gold/60">
                            Explorer
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.navigation.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-400 hover:text-gold hover:translate-x-1 inline-block transition-all duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Colonne 3 : Catégories */}
                    <div className="space-y-5">
                        <h4 className="font-semibold text-base text-white tracking-wide relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-gold/60">
                            Services
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.categories.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-400 hover:text-gold hover:translate-x-1 inline-block transition-all duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Colonne 4 : Contact */}
                    <div className="space-y-5">
                        <h4 className="font-semibold text-base text-white tracking-wide relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-gold/60">
                            Contact
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-gray-400 group">
                                <MapPin className="h-4 w-4 flex-shrink-0 text-gold mt-0.5 group-hover:scale-110 transition-transform" />
                                <span>Cocody Riviera 2, Abidjan</span>
                            </li>
                        </ul>

                        <a
                            href="https://instagram.com/maisonnubi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-10 w-10 rounded-full bg-white/5 items-center justify-center text-gray-400 hover:bg-gold hover:text-white hover:scale-110 transition-all duration-300 border border-white/10 hover:border-gold"
                            aria-label="Instagram"
                        >
                            <Instagram className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-white/10 bg-black/20">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-6">
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                        <span>© {currentYear}</span>
                        <span className="text-gold">•</span>
                        <span className="font-semibold text-gray-400">Maison Nubi</span>
                        <span className="text-gold">•</span>
                        <span>Tous droits réservés</span>
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        {footerLinks.legal.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-xs text-gray-500 hover:text-gold transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-gold hover:after:w-full after:transition-all after:duration-300"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
