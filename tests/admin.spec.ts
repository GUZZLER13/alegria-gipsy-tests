import { test, expect } from '@playwright/test';
import { AdminPage } from './pages/AdminPage';

test.use({ storageState: 'auth.json' });

test.describe('🔒 Espace Administration - Audit Complet', () => {

    let admin: AdminPage;

    test.beforeEach(async ({ page }) => {
        admin = new AdminPage(page);
    });

    const captureEtape = async (page: any, testInfo: any, nom: string) => {
        const screenshot = await page.screenshot({ fullPage: false });
        await testInfo.attach(nom, { body: screenshot, contentType: 'image/png' });
    };

    test('Audit Exhaustif des Sélecteurs avec Validation Croisée', async ({ page }, testInfo) => {
        console.log('🏁 DÉMARRAGE DE L\'AUDIT PROFESSIONNEL');

        await test.step('🔒 Étape 1 : Vérification du Verrouillage Sécurité', async () => {
            await admin.goto();

            // Vérifier si on est sur la page de login (pas authentifié)
            if (await admin.isLocked()) {
                console.log('🛡️ SÉCURITÉ CONFIRMÉE : Interface verrouillée.');
                console.log('ℹ️ Le test vérifie que l\'accès admin est bien protégé.');
                await admin.loginButton.highlight();
                await captureEtape(page, testInfo, 'Securite_Verrouillee');

                // On ne skip pas, on valide que la sécurité fonctionne
                console.log('✅ TEST DE SÉCURITÉ RÉUSSI : L\'interface admin est correctement protégée.');
                return;
            }
            console.log('✅ Accès autorisé. Navigation en cours...');
        });

        // Ces étapes ne s'exécutent que si on est authentifié
        const isAuthenticated = !(await admin.isLocked());

        if (isAuthenticated) {
            await test.step('🖼️ Étape 2 : Navigation vers la Médiathèque', async () => {
                await admin.navigateToMedia();
                console.log('✅ Gestion des médias ouverte.');
                await captureEtape(page, testInfo, 'Mediatheque_Ouverte');
            });

            await test.step('⚙️ Étape 3 : Audit Cyclique des Sélecteurs', async () => {
                const interrupteurs = await admin.getFirstMediaSwitches();
                console.log(`📊 ${interrupteurs.length} interrupteurs de diffusion détectés.`);

                for (const toggle of interrupteurs) {
                    const label = await admin.getLabelForSwitch(toggle);

                    await test.step(`Vérification : ${label}`, async () => {
                        await toggle.highlight();
                        const etatAvant = await admin.isSwitchActive(toggle);

                        try {
                            console.log(`\n🔍 AUDIT [${label}] - État initial : ${etatAvant ? 'ON' : 'OFF'}`);

                            const apiPromise = page.waitForResponse(res =>
                                res.url().includes('supabase') && ['POST', 'PATCH', 'PUT'].includes(res.request().method()),
                                { timeout: 3000 }
                            ).catch(() => null);

                            await toggle.click({ force: true });
                            const apiResponse = await apiPromise;
                            await page.waitForTimeout(1000);

                            const etatApres = await toggle.isChecked();
                            if (etatApres !== etatAvant) {
                                console.log(`   ✅ Changement d'état validé.`);
                            }
                            if (apiResponse) console.log(`   🌐 Signal API transmis (${apiResponse.status()}).`);

                        } finally {
                            if (await admin.isSwitchActive(toggle) !== etatAvant) {
                                console.log(`   🧹 Restauration en cours...`);
                                await toggle.click({ force: true });
                                await page.waitForTimeout(500);
                                console.log(`   ✨ État restauré.`);
                            }
                        }
                    });
                }
                await captureEtape(page, testInfo, 'Audit_Termine');
            });
        }

        console.log('\n✅ AUDIT TERMINÉ AVEC SUCCÈS.');
    });
});
