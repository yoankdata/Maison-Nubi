"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";

interface StripeCheckoutButtonProps {
    planType: "monthly" | "annual";
    className?: string;
    children?: React.ReactNode;
}

/**
 * Bouton de paiement Stripe Checkout
 * Crée une session et redirige vers la page de paiement Stripe
 */
export function StripeCheckoutButton({
    planType,
    className,
    children,
}: StripeCheckoutButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClick = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Créer la session Checkout via l'API
            const response = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planType }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la création de la session');
            }

            // Utiliser l'URL de checkout directement (méthode moderne)
            const { url } = data;

            if (!url) {
                throw new Error('URL de paiement non reçue');
            }

            // Rediriger vers Stripe Checkout
            window.location.href = url;
        } catch (err: any) {
            console.error('Erreur paiement Stripe:', err);
            setError(err.message || 'Une erreur est survenue');
            setIsLoading(false);
        }
        // Note: pas de finally car on redirige, le loading reste actif
    };

    return (
        <div className="space-y-2">
            <Button
                onClick={handleClick}
                disabled={isLoading}
                className={className}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Chargement...
                    </>
                ) : children ? (
                    children
                ) : (
                    <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Payer par carte
                    </>
                )}
            </Button>

            {error && (
                <p className="text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}
