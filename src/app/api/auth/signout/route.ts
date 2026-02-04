import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

/**
 * API Route pour la déconnexion
 * POST /api/auth/signout
 */
export async function POST() {
    const supabase = await createClient();

    if (supabase) {
        await supabase.auth.signOut();
    }

    // Rediriger vers la page d'accueil après déconnexion
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
}
