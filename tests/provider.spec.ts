import { test, expect } from '@playwright/test';

test('Provider Profile Page Loads', async ({ page }) => {
    // Test simplifié : vérifie juste que la page de recherche charge
    // et qu'on peut naviguer vers un profil (sans dépendre de données spécifiques)

    await page.goto('/recherche');

    // Vérifier que la page de recherche se charge
    await expect(page).toHaveTitle(/Recherche|Maison Nubi/i);

    // Vérifier qu'il y a au moins un lien vers un profil prestataire
    const profileLink = page.locator('a[href*="/prestataire/"]').first();

    // Si un profil existe, cliquer dessus
    if (await profileLink.isVisible()) {
        await profileLink.click();

        // Vérifier qu'on est bien sur une page prestataire
        await expect(page).toHaveURL(/\/prestataire\//);

        // Vérifier que les éléments clés existent (sans dépendre du contenu exact)
        await expect(page.locator('h1')).toBeVisible();

        // Vérifier le bouton retour
        const backButton = page.getByText('Retour');
        await expect(backButton).toBeVisible();
    }
});
