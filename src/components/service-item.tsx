import type { Service } from "@/lib/database.types";
import { formatPrice } from "@/lib/utils";

interface ServiceItemProps {
    service: Service;
    /** Affichage compact (une ligne) vs étendu */
    compact?: boolean;
}

/**
 * Affiche une prestation avec son prix
 * Utilisé dans les pages de profil et les cartes prestataire
 */
export function ServiceItem({ service, compact = false }: ServiceItemProps) {
    if (compact) {
        return (
            <div className="flex items-center justify-between py-1.5 text-sm">
                <span className="text-muted-foreground">{service.title}</span>
                <span className="font-medium text-anthracite">
                    {formatPrice(service.price, service.currency)}
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
            <div>
                <h4 className="font-medium text-anthracite">{service.title}</h4>
            </div>
            <PriceTag price={service.price} currency={service.currency} />
        </div>
    );
}

interface PriceTagProps {
    price: number;
    currency?: string;
    /** Taille : sm, md, lg */
    size?: "sm" | "md" | "lg";
}

/**
 * Affiche un prix formaté avec style badge
 */
export function PriceTag({ price, currency = "FCFA", size = "md" }: PriceTagProps) {
    const sizeClasses = {
        sm: "text-sm px-2 py-0.5",
        md: "text-base px-3 py-1",
        lg: "text-lg px-4 py-1.5 font-semibold",
    };

    return (
        <span className={`rounded-full bg-gold/10 text-gold font-medium ${sizeClasses[size]}`}>
            {formatPrice(price, currency)}
        </span>
    );
}
