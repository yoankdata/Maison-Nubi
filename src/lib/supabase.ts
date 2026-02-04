import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

// Client Browser (Client Components) - Typé avec le schéma Database
export const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function isSupabaseReady(): boolean {
    return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
