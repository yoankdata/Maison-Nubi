import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Heart, Users, Star, Award, CheckCircle2, TrendingUp, MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
    title: "À propos d'Maison Nubi | L'annuaire beauté d'Abidjan",
    description:
        "Découvrez Maison Nubi, la plateforme qui révolutionne la beauté en Côte d'Ivoire. Notre mission : connecter les meilleurs talents d'Abidjan avec leurs futurs clients.",
    keywords: ["Maison Nubi", "mission", "valeurs", "startup Abidjan", "beauté Côte d'Ivoire"],
};

const values = [
    {
        icon: Heart,
        title: "Passion",
        description:
            "Nous célébrons l'art et la créativité des talents de la beauté ivoirienne et africaine.",
    },
    {
        icon: Users,
        title: "Accessibilité",
        description:
            "Démocratiser l'accès aux soins de qualité pour tous, du Plateau à Yopougon.",
    },
    {
        icon: Star,
        title: "Excellence",
        description:
            "Une sélection rigoureuse pour garantir des prestations à la hauteur de vos attentes.",
    },
    {
        icon: Award,
        title: "Confiance",
        description:
            "La transparence des prix et des avis vérifiés pour une relation client sereine.",
    },
];

const stats = [
    { label: "Focus Abidjan", value: "Abidjan", icon: MapPin },
    { label: "Sélection Rigoureuse", value: "Vérifiés", icon: ShieldCheck },
    { label: "Zéro Frais de Service", value: "0 FCFA", icon: Sparkles },
    { label: "Expansion en cours", value: "Lancement", icon: TrendingUp },
];

/**
 * Page À propos - Présentation d'Maison Nubi
 */
export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-background py-20 md:py-32">
                {/* Background Gradient Luxueux */}
                <div className="absolute inset-0 bg-white" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent opacity-80" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent opacity-60" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/5 rounded-[100%] blur-3xl -z-10" />

                <div className="container relative mx-auto px-4">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 text-sm font-medium text-gold backdrop-blur-sm">
                            <Sparkles className="h-4 w-4" />
                            <span>L'histoire d'une ambition</span>
                        </div>

                        <h1 className="mb-6 font-serif text-4xl font-bold tracking-tight text-anthracite md:text-6xl lg:leading-tight">
                            Redéfinir <br />
                            <span className="relative inline-block">
                                <span className="relative z-10 bg-gradient-to-r from-gold to-gold-dark bg-clip-text text-transparent">
                                    l'excellence beauté
                                </span>
                                {/* Soulignement artistique */}
                                <svg className="absolute -bottom-2 left-0 w-full h-3 text-gold/30 -z-0" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            </span> <br />
                            en Côte d'Ivoire
                        </h1>

                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
                            Nous aidons les clients à découvrir les meilleurs pros de beauté à Abidjan — et aidons les pros à remplir leur agenda chaque semaine.
                        </p>
                    </div>
                </div>
            </section>

            {/* Notre mission - Design Premium */}
            <section className="py-20 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid gap-16 lg:grid-cols-2 items-center">
                        {/* Texte */}
                        <div className="order-2 lg:order-1 space-y-8">
                            <div>
                                <h2 className="mb-6 font-serif text-3xl md:text-4xl font-bold text-anthracite">
                                    Plus qu'un annuaire, <br /> un <span className="text-gold">accélérateur de réussite</span>.
                                </h2>
                                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                                    <p>
                                        En Côte d'Ivoire, le secteur de la beauté regorge de pépites : coiffeuses expertes en tresses, maquilleuses artistiques, barbiers de précision... Pourtant, le bouche-à-oreille ne suffit plus.
                                    </p>
                                    <p>
                                        <strong className="text-anthracite font-medium">Maison Nubi change la donne.</strong> Nous digitalisons la beauté ivoirienne. Nous transformons la façon dont les services sont découverts et réservés.
                                    </p>
                                </div>
                            </div>

                            <ul className="space-y-4">
                                {[
                                    "Visibilité accrue pour les professionnels",
                                    "Réservation simplifiée pour les clients",
                                    "Transparence totale sur les tarifs"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-anthracite">
                                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gold/20 flex items-center justify-center">
                                            <CheckCircle2 className="h-4 w-4 text-gold" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Image avec effets de composition */}
                        <div className="order-1 lg:order-2 relative">
                            {/* Éléments décoratifs d'arrière-plan */}
                            <div className="absolute -top-12 -right-12 w-64 h-64 bg-gold/10 rounded-full blur-3xl opacity-60" />
                            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl opacity-60" />

                            <div className="relative">
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border/50">
                                    {/* Placeholder pour l'image - À remplacer par votre image */}
                                    <Image
                                        src="/about-hero.jpg"
                                        alt="Professionnelle de la beauté à Abidjan"
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                </div>

                                {/* Badge flottant "Impact" */}
                                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 flex items-center gap-4 max-w-xs ring-1 ring-black/5">
                                    <div className="h-12 w-12 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <TrendingUp className="h-6 w-6 text-gold" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-anthracite text-lg">100%</p>
                                        <p className="text-sm text-muted-foreground leading-tight">Dédié au marché local</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Chiffres Clés (Nouvelle Section) */}
            <section className="border-y border-border/50 bg-white">
                <div className="container mx-auto px-4 py-12 md:py-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-surface text-gold group-hover:scale-110 transition-transform">
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <div className="text-3xl font-bold text-anthracite mb-1">{stat.value}</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wide font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Nos valeurs */}
            <section className="bg-anthracite py-20 md:py-28 relative overflow-hidden">
                {/* Texture bruit subtile */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.svg')] mix-blend-overlay"></div>

                <div className="container relative mx-auto px-4">
                    <div className="mb-16 text-center">
                        <span className="text-gold font-medium tracking-widest text-sm uppercase mb-3 block">ADN Maison Nubi</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">Nos piliers fondamentaux</h2>
                        <p className="mx-auto max-w-2xl text-gray-400 text-lg">
                            Ces valeurs ne sont pas juste des mots sur un mur. Elles guident chaque fonctionnalité que nous développons et chaque partenaire que nous accueillons.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map((value, index) => (
                            <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-gold/50 transition-all duration-500 hover:-translate-y-2 group rounded-2xl">
                                <CardContent className="p-8 text-center h-full flex flex-col items-center">
                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/20 to-transparent border border-gold/10 group-hover:border-gold/60 group-hover:scale-110 transition-all duration-300">
                                        <value.icon className="h-9 w-9 text-gold" />
                                    </div>
                                    <h3 className="mb-3 text-xl font-serif font-semibold text-white group-hover:text-gold transition-colors">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
                                        {value.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-24 bg-gradient-to-b from-surface via-white to-white">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-4xl bg-white rounded-[2rem] shadow-2xl shadow-gold/5 border border-gold/10 overflow-hidden relative p-8 md:p-12 text-center">
                        {/* Décoration d'arrière-plan */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold via-gold-light to-gold" />

                        <h2 className="mb-6 font-serif text-3xl md:text-4xl font-bold text-anthracite">
                            Prêt à faire partie de l'histoire ?
                        </h2>
                        <p className="mx-auto mb-10 max-w-2xl text-muted-foreground text-lg">
                            Que vous soyez un professionnel cherchant à développer sa clientèle ou un passionné de beauté en quête de perfection, votre place est ici.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                asChild
                                size="lg"
                                className="h-12 px-8 rounded-full bg-gold hover:bg-gold-dark text-white shadow-lg shadow-gold/20 hover:shadow-gold/40 transition-all text-base"
                            >
                                <Link href="/inscription">
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Inscrire mon salon
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="h-12 px-8 rounded-full border-2 border-anthracite text-anthracite hover:bg-anthracite hover:text-white transition-all text-base font-medium"
                            >
                                <Link href="/recherche">Découvrir les talents</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
