import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formate un prix en FCFA ou autre devise
 * @example formatPrice(15000) => "15 000 FCFA"
 */
export function formatPrice(price: number, currency: string = "FCFA"): string {
  // Formatage avec séparateur de milliers (espace)
  const formattedNumber = new Intl.NumberFormat("fr-FR").format(price);
  return `${formattedNumber} ${currency}`;
}

/**
 * Génère un lien WhatsApp formaté
 * Nettoie le numéro et ajoute le préfixe +225 si nécessaire
 * @example formatWhatsAppLink("+225 07 00 00 00 00") => "https://wa.me/22507000000?text=..."
 */
export function formatWhatsAppLink(phone: string, customMessage?: string): string {
  // Nettoyer le numéro : enlever espaces, tirets, parenthèses
  let cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

  // S'assurer que le numéro commence par 225 (Côte d'Ivoire)
  if (cleanPhone.startsWith("+")) {
    cleanPhone = cleanPhone.substring(1);
  }
  if (!cleanPhone.startsWith("225")) {
    cleanPhone = "225" + cleanPhone;
  }

  // Message par défaut
  const message = customMessage || "Bonjour, je vous ai découvert sur Maison Nubi et j'aimerais prendre rendez-vous.";

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Génère un slug à partir d'un texte
 * @example generateSlug("Marie Koné") => "marie-kone"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Enlever les accents
    .replace(/[^a-z0-9]+/g, "-") // Remplacer les caractères spéciaux par des tirets
    .replace(/^-+|-+$/g, ""); // Enlever les tirets au début/fin
}

/**
 * Génère un slug optimisé pour le SEO incluant le nom et la catégorie
 * @example generateOptimizedSlug("Marie Koné", "coiffure") => "marie-kone-coiffure"
 */
export function generateOptimizedSlug(name: string, category: string): string {
  const nameSlug = generateSlug(name);
  const categorySlug = generateSlug(category);
  return `${nameSlug}-${categorySlug}`;
}

/**
 * Hook pour debounce une valeur (à utiliser avec useState)
 * Utilisé pour la barre de recherche
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
