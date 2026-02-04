import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

// Client Server (Server Components) - Typé avec le schéma Database
export async function createClient(): Promise<SupabaseClient<Database>> {
    const cookieStore = await cookies();

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch (error) {
                        // Dans un Server Component, on ne peut pas définir de cookies.
                        // Cette erreur est attendue si on appelle createClient() dans un composant serveur
                        // qui tente d'écrire (ex: refresh token).
                        // On logue juste en mode développement pour info.
                        if (process.env.NODE_ENV === "development") {
                            // console.warn("Supabase Cookie Warning:", error);
                        }
                    }
                },
            },
        }
    );
}

