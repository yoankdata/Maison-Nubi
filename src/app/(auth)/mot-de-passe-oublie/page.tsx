"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Sparkles, Loader2, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

// Schéma de validation
const forgotPasswordSchema = z.object({
    email: z.string().email("Veuillez entrer une adresse email valide"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Page de récupération de mot de passe
 * Envoie un email avec un lien pour réinitialiser le mot de passe
 */
export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            if (!supabase) throw new Error("Service d'authentification indisponible");

            const { error: authError } = await supabase.auth.resetPasswordForEmail(
                data.email,
                {
                    redirectTo: `${window.location.origin}/reset-password`,
                }
            );

            if (authError) {
                throw new Error("Une erreur est survenue. Veuillez réessayer.");
            }

            // Succès
            setSuccess(true);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur inconnue");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4 py-12">
            <div className="w-full max-w-md space-y-8">

                {/* En-tête */}
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                        <Sparkles className="h-6 w-6 text-gold transition-transform group-hover:scale-110" />
                        <span className="font-serif text-3xl font-bold text-anthracite tracking-tight">Maison Nubi</span>
                    </Link>
                    <h2 className="text-2xl font-bold text-anthracite tracking-tight">Mot de passe oublié</h2>
                    <p className="text-muted-foreground mt-2">
                        Entrez votre email pour recevoir un lien de réinitialisation
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
                                        Email envoyé !
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Un lien de réinitialisation a été envoyé à{" "}
                                        <strong className="text-anthracite">{getValues("email")}</strong>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-4">
                                        Vérifiez votre boîte de réception (et vos spams).
                                    </p>
                                </div>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full h-11 rounded-full"
                                >
                                    <Link href="/connexion">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Retour à la connexion
                                    </Link>
                                </Button>
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

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-anthracite" htmlFor="email">
                                            Adresse email
                                        </label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-gold transition-colors" />
                                            <Input
                                                {...register("email")}
                                                id="email"
                                                type="email"
                                                placeholder="nom@salon.com"
                                                className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                                                disabled={isLoading}
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
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
                                                Envoi en cours...
                                            </>
                                        ) : (
                                            "Envoyer le lien"
                                        )}
                                    </Button>
                                </form>
                            </>
                        )}
                    </CardContent>

                    {!success && (
                        <CardFooter className="bg-gray-50/50 py-4 px-6 border-t border-gray-100 flex justify-center rounded-b-xl">
                            <Link
                                href="/connexion"
                                className="text-sm text-muted-foreground hover:text-gold transition-colors flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Retour à la connexion
                            </Link>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    );
}
