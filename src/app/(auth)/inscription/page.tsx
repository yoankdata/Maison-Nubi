"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    Phone,
    Sparkles,
    Loader2,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

// Validation schema
const registerSchema = z.object({
    full_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Veuillez entrer une adresse email valide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    whatsapp: z.string().regex(/^(\+225)?[0-9]{10}$/, "Format invalide. Ex: 0701020304 ou +2250701020304"),
    category: z.enum(["coiffure", "makeup", "onglerie", "regard", "soins", "spa", "henne", "barber"]),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const CATEGORIES = [
    { value: "coiffure", label: "Coiffure" },
    { value: "makeup", label: "Maquillage" },
    { value: "ongles", label: "Ongles" },
    { value: "soins", label: "Soins" },
    { value: "barber", label: "Barber" },
];

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            category: "coiffure",
        },
    });

    const selectedCategory = watch("category");

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            if (!supabase) throw new Error("Service d'authentification indisponible");

            // Register user with metadata
            const { error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: data.full_name,
                        whatsapp: data.whatsapp,
                        category: data.category,
                    },
                },
            });

            if (authError) {
                if (authError.message.includes("User already registered")) {
                    throw new Error("Cet email est déjà utilisé. Essayez de vous connecter.");
                }
                throw new Error(authError.message);
            }

            // Success state
            setSuccess(true);

            // Optional: Welcome email trigger (non-blocking)
            // fetch('/api/emails/welcome', { ... }).catch(console.error);

            // Redirect after delay
            setTimeout(() => {
                router.refresh();
                router.push("/espace-pro/profil");
            }, 2000);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue");
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4">
                <Card className="w-full max-w-md border-0 shadow-xl shadow-green-100">
                    <CardContent className="p-8 text-center space-y-6">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 animate-in zoom-in duration-300">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <div>
                            <h2 className="font-serif text-2xl font-bold text-anthracite mb-2">
                                Compte créé !
                            </h2>
                            <p className="text-muted-foreground">
                                Bienvenue sur Maison Nubi. <br /> Redirection vers votre tableau de bord...
                            </p>
                        </div>
                        <Loader2 className="h-6 w-6 animate-spin text-gold mx-auto" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4 py-12">
            <div className="w-full max-w-md space-y-8">

                {/* Header */}
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                        <Sparkles className="h-6 w-6 text-gold transition-transform group-hover:scale-110" />
                        <span className="font-serif text-3xl font-bold text-anthracite tracking-tight">Maison Nubi</span>
                    </Link>
                    <h2 className="text-2xl font-bold text-anthracite tracking-tight">Créer mon profil pro</h2>
                    <p className="text-muted-foreground mt-2">Rejoignez l'élite de la beauté ivoirienne</p>
                </div>

                <Card className="border-border/40 shadow-xl shadow-gray-200/50">
                    <CardContent className="pt-8 px-6 sm:px-8">

                        {/* Value Props */}
                        <div className="mb-8 p-4 rounded-xl bg-gold/5 border border-gold/10">
                            <ul className="space-y-2.5">
                                {[
                                    "Visibilité auprès de milliers de clients",
                                    "Réservations directes via WhatsApp",
                                    "100% Gratuit, sans engagement"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-sm text-anthracite/80">
                                        <CheckCircle2 className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {error && (
                            <Alert variant="destructive" className="mb-6 bg-red-50 text-red-900 border-red-200">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Erreur</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-anthracite" htmlFor="full_name">Nom complet / Salon</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-gold transition-colors" />
                                    <Input
                                        {...register("full_name")}
                                        id="full_name"
                                        placeholder="Ex: Marie Koné ou Salon Prestige"
                                        className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.full_name && <p className="text-xs text-red-500 font-medium">{errors.full_name.message}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-anthracite" htmlFor="email">Email professionnel</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-gold transition-colors" />
                                    <Input
                                        {...register("email")}
                                        id="email"
                                        type="email"
                                        placeholder="contact@salon.com"
                                        className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
                            </div>

                            {/* WhatsApp */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-anthracite" htmlFor="whatsapp">Numéro WhatsApp</label>
                                <div className="relative group">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-gold transition-colors" />
                                    <Input
                                        {...register("whatsapp")}
                                        id="whatsapp"
                                        type="tel"
                                        placeholder="07 00 00 00 00"
                                        className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.whatsapp && <p className="text-xs text-red-500 font-medium">{errors.whatsapp.message}</p>}
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-anthracite">Spécialité principale</label>
                                <Select
                                    value={selectedCategory}
                                    onValueChange={(value) => setValue("category", value as RegisterFormData["category"])}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger className="h-11 bg-gray-50/50 border-gray-200 focus:bg-white">
                                        <SelectValue placeholder="Sélectionnez votre domaine" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((cat) => (
                                            <SelectItem key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && <p className="text-xs text-red-500 font-medium">{errors.category.message}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-anthracite" htmlFor="password">Mot de passe</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-gold transition-colors" />
                                    <Input
                                        {...register("password")}
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Minimum 6 caractères"
                                        className="pl-10 pr-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-anthracite p-1"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 rounded-full bg-gold hover:bg-gold-dark text-white font-bold shadow-lg shadow-gold/20 hover:shadow-gold/30 transition-all duration-300 mt-2"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Création du compte...
                                    </>
                                ) : (
                                    "Créer mon profil gratuit"
                                )}
                            </Button>

                            <p className="text-center text-xs text-muted-foreground px-4">
                                En continuant, vous acceptez nos{" "}
                                <Link href="/cgu" className="text-anthracite hover:underline">Conditions</Link>
                                {" "}et notre{" "}
                                <Link href="/confidentialite" className="text-anthracite hover:underline">Politique de confidentialité</Link>.
                            </p>

                            {/* Séparateur */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-3 text-muted-foreground font-medium tracking-wider">Ou</span>
                                </div>
                            </div>

                            {/* Bouton Google */}
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-11 rounded-full border-gray-200 hover:bg-gray-50 hover:text-anthracite transition-colors"
                                disabled={isLoading}
                                onClick={async () => {
                                    setIsLoading(true);
                                    setError(null);
                                    try {
                                        if (!supabase) throw new Error("Service d'authentification indisponible");
                                        const { error } = await supabase.auth.signInWithOAuth({
                                            provider: 'google',
                                            options: {
                                                redirectTo: `${window.location.origin}/espace-pro/profil`,
                                            },
                                        });
                                        if (error) throw error;
                                    } catch (err) {
                                        setError(err instanceof Error ? err.message : "Erreur avec Google");
                                        setIsLoading(false);
                                    }
                                }}
                            >
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                S'inscrire avec Google
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="bg-gray-50/50 py-4 px-6 border-t border-gray-100 flex justify-center rounded-b-xl">
                        <p className="text-sm text-muted-foreground">
                            Vous avez déjà un compte ?{" "}
                            <Link href="/connexion" className="font-semibold text-gold hover:text-gold-dark hover:underline transition-all">
                                Connectez-vous
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
