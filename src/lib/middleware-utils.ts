import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes qui nécessitent une authentification
const PROTECTED_ROUTES = [
    "/espace-pro",
    "/account",
];

// Routes publiques d'authentification (ne pas rediriger)
const AUTH_ROUTES = [
    "/connexion",
    "/inscription",
    "/auth",
    "/login",
    "/register",
];

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser().
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Vérifier si la route est protégée
    const isProtectedRoute = PROTECTED_ROUTES.some(route =>
        pathname.startsWith(route)
    );

    // Vérifier si c'est une route d'authentification
    const isAuthRoute = AUTH_ROUTES.some(route =>
        pathname.startsWith(route)
    );

    // Rediriger les utilisateurs non connectés vers /connexion
    if (!user && isProtectedRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/connexion";
        // Ajouter l'URL de retour pour rediriger après connexion
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
    }

    // Rediriger les utilisateurs connectés qui tentent d'accéder aux pages d'auth
    if (user && isAuthRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/espace-pro";
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}

