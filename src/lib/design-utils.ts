export function getProfileGradient(seed: string) {
    // Liste de palettes inspirées de l'identité Maison Nubi
    // Mélange de Gold, Rose, Anthracite et couleurs neutres chaudes
    const palettes = [
        "from-[#D4AF37] to-[#1A1A1A]", // Or vers Anthracite
        "from-[#FDF2F2] to-[#E8C94B]", // Rose pâle vers Or clair
        "from-[#1A1A1A] to-[#404040]", // Anthracite profond
        "from-[#E8C94B] to-[#D4AF37]", // Or vibrant
        "from-[#F5D0D0] to-[#FDF2F2]", // Rose poudré
        "from-[#D4AF37] via-[#FDF2F2] to-[#D4AF37]", // Or avec touche rosée
        "from-[#2D2D2D] to-[#1A1A1A]", // Gris foncé
    ];

    // Calcul d'un hash simple pour l'index
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % palettes.length;
    const direction = Math.abs(hash) % 2 === 0 ? "bg-gradient-to-br" : "bg-gradient-to-tr";

    return `${direction} ${palettes[index]}`;
}
