import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

export const alt = "Aperçu Profil Maison Nubi";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

// On utilise une police standard pour l'instant pour éviter les erreurs de fetch en edge si pas configuré
// Idéalement, charger une police Google Fonts :
// const font = await fetch(new URL('...', import.meta.url)).then((res) => res.arrayBuffer())

export default async function Image({ params }: { params: { slug: string } }) {
    const slug = params.slug;

    // 1. Récupérer les données via Supabase URL/KEY (car edge runtime)
    // Note: on utilise process.env directement
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!profile) {
        return new ImageResponse(
            (
                <div
                    style={{
                        fontSize: 48,
                        background: "#1a1a1a",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                    }}
                >
                    Maison Nubi
                </div>
            ),
            { ...size }
        );
    }

    const initials = profile.full_name?.slice(0, 2).toUpperCase() || "MN";
    const avatarUrl = profile.avatar_url; // TODO: Optimiser/Proxy si nécessaire pour cors ?

    // Couleurs "Premium"
    const bgDark = "#121212"; // Anthracite très sombre
    const gold = "#D4AF37";
    const textLight = "#F5F5F5";

    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: bgDark,
                    backgroundImage: `linear-gradient(to bottom right, #1a1b1e, #000000)`,
                    padding: "60px 80px",
                    fontFamily: '"Times New Roman", Times, serif', // Fallback serif pour "luxe"
                }}
            >
                {/* Décoration Or */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "8px",
                        background: `linear-gradient(90deg, ${gold}, #AA8A2E)`,
                    }}
                />

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        width: "60%",
                    }}
                >
                    {/* Badge Catégorie */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "20px",
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: "rgba(212, 175, 55, 0.1)",
                                border: `1px solid ${gold}`,
                                color: gold,
                                padding: "8px 24px",
                                borderRadius: "50px",
                                fontSize: 20,
                                textTransform: "uppercase",
                                letterSpacing: "2px",
                                fontWeight: "bold",
                            }}
                        >
                            {profile.category || "Beauté"}
                        </div>
                    </div>

                    {/* Nom */}
                    <div
                        style={{
                            fontSize: 72,
                            fontWeight: "bold",
                            color: textLight,
                            marginBottom: "16px",
                            lineHeight: 1.1,
                            textShadow: "0 4px 4px rgba(0,0,0,0.5)",
                        }}
                    >
                        {profile.full_name}
                    </div>

                    {/* Ville / Localisation */}
                    <div
                        style={{
                            fontSize: 32,
                            color: "#888",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {profile.neighborhood ? `${profile.neighborhood}, ` : ""}Abidjan
                    </div>

                    {/* Note / Reco */}
                    {(profile.recommendations_count || 0) > 0 && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: "30px",
                                color: gold,
                                fontSize: 28,
                            }}
                        >
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill={gold}
                                style={{ marginRight: 12 }}
                            >
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <span style={{ fontWeight: "bold", marginRight: 8 }}>
                                {profile.recommendations_count}
                            </span>
                            <span style={{ color: "#aaa" }}>Recommandations</span>
                        </div>
                    )}
                </div>

                {/* Avatar Area */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                    }}
                >
                    {/* Cercle Or décoratif */}
                    <div
                        style={{
                            position: "absolute",
                            width: "420px",
                            height: "420px",
                            borderRadius: "50%",
                            border: `2px solid ${gold}`,
                            opacity: 0.3,
                        }}
                    />

                    {/* Avatar Container */}
                    <div
                        style={{
                            width: "380px",
                            height: "380px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "8px solid #2a2a2a",
                            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#333",
                        }}
                    >
                        {avatarUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={avatarUrl}
                                alt={profile.full_name}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    fontSize: 120,
                                    color: "#555",
                                    fontFamily: "sans-serif",
                                }}
                            >
                                {initials}
                            </div>
                        )}
                    </div>
                </div>

                {/* Logo footer */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "40px",
                        left: "80px",
                        fontSize: 24,
                        color: "#444",
                        textTransform: "uppercase",
                        letterSpacing: "4px",
                        fontFamily: "sans-serif",
                    }}
                >
                    Maison Nubi
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
