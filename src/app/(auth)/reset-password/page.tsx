"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Sparkles, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

// Schéma de validation
const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
        .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Page de réinitialisation du mot de passe
 * L'utilisateur arrive ici après avoir cliqué sur le lien dans l'email
 */
export default function ResetPasswordPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    // Vérifier qu'on a une session valide (l'utilisateur a cliqué sur le lien email)
    useEffect(() => {
        const checkSession = async () => {
            if (!supabase) {
                setIsValidSession(false);
                return;
            }

            const { data: { session } } = await supabase.auth.getSession();
            setIsValidSession(!!session);
        };

        checkSession();
    }, []);

    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            if (!supabase) throw new Error("Service d'authentification indisponible");

            const { error: authError } = await supabase.auth.updateUser({
                password: data.password,
            });

            if (authError) {
                throw new Error("Une erreur est survenue. Le lien a peut-être expiré.");
            }

            // Succès
            setSuccess(true);

            // Rediriger après 3 secondes
            setTimeout(() => {
                router.push("/espace-pro/profil");
            }, 3000);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur inconnue");
        } finally {
            setIsLoading(false);
        }
    };

    // Chargement en cours de vérification
    if (isValidSession === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
        );
    }

    // Lien invalide ou expiré
    if (!isValidSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4 py-12">
                <div className="w-full max-w-md text-center space-y-6">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-anthracite">Lien invalide</h2>
                        <p className="text-muted-foreground">
                            Ce lien de réinitialisation a expiré ou est invalide.
                        </p>
                    </div>
                    <Button asChild className="rounded-full bg-gold hover:bg-gold-dark">
                        <Link href="/mot-de-passe-oublie">
                            Demander un nouveau lien
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4 py-12">
            <div className="w-full max-w-md space-y-8">

                {/* En-tête */}
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                        <Sparkles className="h-6 w-6 text-gold transition-transform group-hover:scale-110" />
                        <span className="font-serif text-3xl font-bold text-anthracite tracking-tight">Maison Nubi</span>
                    </Link>
                    <h2 className="text-2xl font-bold text-anthracite tracking-tight">
                        Nouveau mot de passe
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        Choisissez un nouveau mot de passe sécurisé
                    </p>
                </div>

                <Card className="border-border/40 shadow-xl shadow-gray-200/50">
                    <CardContent className="pt-8 px-6 sm:px-8">

                        {/* Message de succès */}
                        {success ? (
                            <div className="text-center space-y-6 py-4">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-anthracite">
                                        Mot de passe mis à jour !
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Vous allez être redirigé vers votre espace pro...
                                    </p>
                                </div>
                                <Loader2 className="h-6 w-6 animate-spin text-gold mx-auto" />
                            </div>
                        ) : (
                            <>
                                {/* Message d'erreur */}
                                {error && (
                                    <Alert variant="destructive" className="mb-6 bg-red-50 text-red-900 border-red-200">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Erreur</AlertTitle>
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                                    {/* Nouveau mot de passe */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-anthracite" htmlFor="password">
                                            Nouveau mot de passe
                                        </label>
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-gold transition-colors" />
                                            <Input
                                                {...register("password")}
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="pl-10 pr-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                                                disabled={isLoading}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-anthracite transition-colors p-1"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            8 caractères min., 1 majuscule, 1 chiffre
                                        </p>
                                    </div>

                                    {/* Confirmation */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-anthracite" htmlFor="confirmPassword">
                                            Confirmer le mot de passe
                                        </label>
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-gold transition-colors" />
                                            <Input
                                                {...register("confirmPassword")}
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="pl-10 pr-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                                                disabled={isLoading}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-anthracite transition-colors p-1"
                                                tabIndex={-1}
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-11 rounded-full bg-gold hover:bg-gold-dark text-white font-semibold shadow-lg shadow-gold/20 hover:shadow-gold/30 transition-all duration-300"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Mise à jour...
                                            </>
                                        ) : (
                                            "Mettre à jour le mot de passe"
                                        )}
                                    </Button>
                                </form>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
