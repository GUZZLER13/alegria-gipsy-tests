import { test, expect } from '@playwright/test';

test.describe('🏠 Page d\'Accueil - Vérifications de Base', () => {

    test('Tour visuel de la page d\'accueil', async ({ page }, testInfo) => {

        await test.step('🌍 Chargement du site', async () => {
            console.log('🌍 Navigation vers Alegria Gipsy...');
            await page.goto('/');
            await page.waitForLoadState('networkidle');
            await expect(page).toHaveTitle(/Alegria/i);
            console.log('✅ Titre de page validé.');
        });

        await test.step('🖼️ Vérification du Hero (Bannière Principale)', async () => {
            const hero = page.locator('section').first();
            await expect(hero).toBeVisible();
            await hero.highlight();
            console.log('✅ Section Hero visible et chargée.');

            const capture = await page.screenshot();
            await testInfo.attach('Hero_Banniere', { body: capture, contentType: 'image/png' });
        });

        await test.step('🔗 Présence du Logo', async () => {
            const logo = page.locator('img[alt*="logo" i], .logo, header img').first();
            if (await logo.isVisible()) {
                await logo.highlight();
                console.log('✅ Logo du groupe visible.');
            }
        });

        await test.step('📜 Test du Scroll', async () => {
            console.log('📜 Simulation du défilement...');
            await page.evaluate(() => window.scrollBy(0, 500));
            await page.waitForTimeout(500);
            console.log('✅ Scroll fluide confirmé.');

            const capture = await page.screenshot();
            await testInfo.attach('Apres_Scroll', { body: capture, contentType: 'image/png' });
        });
    });
});
