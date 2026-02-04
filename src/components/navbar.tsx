"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, Search, User, X, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

// Liens de navigation avec icones
const navLinks = [
    { href: "/recherche", label: "Explorer" },
    { href: "/a-propos", label: "Notre mission" },
    { href: "/tarifs", label: "Premium" },
];

/**
 * Navbar Premium pour Maison Nubi
 * Design glassmorphism avec micro-interactions
 */
export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    // Evite l'erreur d'hydratation avec les composants Radix
    useEffect(() => {
        setMounted(true);
    }, []);

    // Effet de scroll pour densifier la navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Fermer le menu mobile au changement de page
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-500 ${scrolled
                ? "bg-white/90 backdrop-blur-xl border-b border-gray-100 py-2 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.05)]"
                : "bg-transparent border-b border-transparent py-4"
                }`}
        >
            <nav className="container mx-auto flex items-center justify-between px-4 md:px-8">

                {/* Logo Maison Nubi - Premium avec icône */}
                <Link href="/" className="flex items-center gap-2 group relative z-50">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gold/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Sparkles className="h-5 w-5 text-gold relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                    </div>
                    <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-anthracite group-hover:text-gold transition-colors duration-300">
                        Maison Nubi
                    </span>
                </Link>

                {/* Navigation Desktop */}
                <div className="hidden md:flex md:items-center md:gap-1 bg-gray-50/80 backdrop-blur-sm rounded-full px-2 py-1.5">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 rounded-full ${isActive
                                    ? "text-anthracite"
                                    : "text-muted-foreground hover:text-anthracite"
                                    }`}
                            >
                                {/* Pill Background pour page active */}
                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-pill"
                                        className="absolute inset-0 bg-white rounded-full shadow-sm"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{link.label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Actions Desktop */}
                <div className="hidden md:flex md:items-center md:gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="hover:bg-gold/10 hover:text-gold transition-all duration-300 rounded-full h-10 w-10"
                    >
                        <Link href="/recherche">
                            <Search className="h-4 w-4" />
                            <span className="sr-only">Rechercher</span>
                        </Link>
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="hover:bg-gray-100 transition-all duration-300 font-medium text-muted-foreground hover:text-anthracite rounded-full px-4"
                    >
                        <Link href="/connexion">
                            Connexion
                        </Link>
                    </Button>

                    <Button
                        asChild
                        className="rounded-full bg-anthracite text-white hover:bg-gold transition-all duration-300 px-6 h-10 text-sm font-semibold shadow-lg shadow-black/10 hover:shadow-gold/20 hover:scale-[1.02]"
                    >
                        <Link href="/inscription" className="flex items-center gap-1.5">
                            Rejoindre
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Menu Mobile Trigger - Rendu seulement cote client pour eviter l'erreur d'hydratation */}
                {mounted && (
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-gold/10 rounded-full h-10 w-10 transition-colors"
                            >
                                <Menu className="h-5 w-5 text-anthracite" />
                                <span className="sr-only">Menu</span>
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="right" className="w-full sm:w-[380px] border-l-0 bg-white p-0">
                            <SheetTitle className="sr-only">Menu de navigation</SheetTitle>

                            <div className="flex flex-col h-full">
                                {/* Header Mobile */}
                                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-gold" />
                                        <span className="font-serif text-xl font-bold text-anthracite">Maison Nubi</span>
                                    </div>
                                    <SheetClose asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 h-10 w-10">
                                            <X className="h-5 w-5" />
                                        </Button>
                                    </SheetClose>
                                </div>

                                {/* Liens Mobile */}
                                <nav className="flex-1 flex flex-col py-8 px-6">
                                    {navLinks.map((link, index) => {
                                        const isActive = pathname === link.href;
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setIsOpen(false)}
                                                className={`flex items-center justify-between py-4 border-b border-gray-50 group ${isActive ? "text-gold" : "text-anthracite"
                                                    }`}
                                            >
                                                <motion.span
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 + index * 0.08 }}
                                                    className="text-2xl font-serif group-hover:text-gold transition-colors"
                                                >
                                                    {link.label}
                                                </motion.span>
                                                <ChevronRight className={`h-5 w-5 transition-all duration-300 ${isActive
                                                    ? "text-gold"
                                                    : "text-gray-300 group-hover:text-gold group-hover:translate-x-1"
                                                    }`} />
                                            </Link>
                                        );
                                    })}
                                </nav>

                                {/* Actions Mobile Footer */}
                                <div className="p-6 space-y-3 bg-gray-50/50 border-t border-gray-100">
                                    <Button variant="outline" asChild className="w-full rounded-full border-gray-200 h-12 text-base font-medium hover:bg-white hover:border-gold transition-all">
                                        <Link href="/connexion" onClick={() => setIsOpen(false)}>
                                            <User className="mr-2 h-4 w-4" />
                                            Se connecter
                                        </Link>
                                    </Button>
                                    <Button asChild className="w-full rounded-full bg-anthracite hover:bg-gold text-white h-12 text-base font-bold shadow-lg transition-all duration-300">
                                        <Link href="/inscription" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2">
                                            <Sparkles className="h-4 w-4" />
                                            Créer mon profil gratuit
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                )}
            </nav>
        </header>
    );
}
