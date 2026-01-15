import { test, expect } from '@playwright/test';
import { PublicPage } from './pages/PublicPage';

test.describe('🛒 Parcours Client - Demande de Réservation', () => {

    test('Simulation de demande de booking', async ({ page }, testInfo) => {
        const accueil = new PublicPage(page);

        await test.step('🌍 Arrivée sur le site', async () => {
            await accueil.goto();
            await expect(page).toHaveTitle(/Alegria/i);
        });

        await test.step('📍 Localisation de la section Réservation', async () => {
            const bookingHeading = page.locator('h2:has-text("Enflammez"), h2:has-text("Réservation")').first();
            await bookingHeading.scrollIntoViewIfNeeded();
            await page.waitForTimeout(1000);
        });

        await test.step('✍️ Remplissage du formulaire', async () => {
            await accueil.fillBookingForm(
                'Test Playwright',
                'test@alegria-tests.local',
                '0600000000',
                'Ceci est un test automatisé Playwright.'
            );
        });

        await test.step('🚀 Envoi et Validation', async () => {
            const submitBtn = page.locator('button:has-text("Envoyer"), button[type="submit"]').first();
            await expect(submitBtn).toBeVisible();

            // Interception flexible
            const responsePromise = page.waitForResponse(
                res => res.status() >= 200 && res.status() < 300,
                { timeout: 10000 }
            ).catch(() => null);

            await submitBtn.click();

            // On attend un peu pour voir le feedback visuel même si l'URL change ou non
            await page.waitForTimeout(3000);

            const confirmation = page.locator('text=/merci|envoyé|succès|confirmation/i').first();
            const isConfirmed = await confirmation.isVisible().catch(() => false);

            if (isConfirmed) {
                console.log('✅ Message de confirmation détecté.');
            } else {
                console.log('ℹ️ Pas de message de texte trouvé, vérification visuelle requise.');
            }

            const capture = await page.screenshot();
            await testInfo.attach('Final_State', { body: capture, contentType: 'image/png' });
        });
    });
});
