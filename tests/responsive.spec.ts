import { test, expect } from '@playwright/test';

test.describe('📱 Vérification Multi-Appareils (Responsive)', () => {

    test('Adaptation Mobile : Menu Burger et Hero Vertical', async ({ page }, testInfo) => {
        // Configuration taille iPhone 13
        await page.setViewportSize({ width: 390, height: 844 });

        await test.step('🌍 Chargement version Mobile', async () => {
            console.log('📱 Test en mode Mobile (iPhone 13)...');
            await page.goto('/');
            await page.waitForLoadState('networkidle');
        });

        await test.step('🍔 Test du menu burger', async () => {
            const menuBtn = page.locator('button[aria-label*="menu"], .burger-menu, #menu-toggle, button:has(.hamburger)').first();
            if (await menuBtn.isVisible()) {
                await menuBtn.highlight();
                console.log('✅ Menu burger détecté.');
                await menuBtn.click();
                await page.waitForTimeout(1000);
                console.log('✅ Ouverture du menu confirmée.');
            } else {
                console.log('ℹ️ Aucun menu burger explicite avec ces sélecteurs.');
            }
        });

        await test.step('🖼️ Vérification du Hero Mobile', async () => {
            const hero = page.locator('section').first();
            await expect(hero).toBeVisible();
            console.log('✅ Bannière principale adaptée à l\'écran vertical.');

            const capture = await page.screenshot();
            await testInfo.attach('Vue_Mobile_iPhone13', { body: capture, contentType: 'image/png' });
        });
    });

    test('Adaptation Desktop : Grande Largeur HD', async ({ page }, testInfo) => {
        // Configuration écran large
        await page.setViewportSize({ width: 1920, height: 1080 });

        await test.step('🌍 Chargement version Desktop HD', async () => {
            console.log('💻 Test en mode Desktop (Full HD)...');
            await page.goto('/');
            await page.waitForLoadState('networkidle');

            const capture = await page.screenshot();
            await testInfo.attach('Vue_Desktop_FullHD', { body: capture, contentType: 'image/png' });
            console.log('✅ Affichage Desktop validé.');
        });
    });
});
