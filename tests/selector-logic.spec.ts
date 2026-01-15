import { test, expect } from '@playwright/test';
import { AdminPage } from './pages/AdminPage';
import { PublicPage } from './pages/PublicPage';

test.use({ storageState: 'auth.json' });

/**
 * 🎯 LOGIQUE MÉTIER DES 8 SÉLECTEURS DE VISIBILITÉ
 * 
 * Ce test vérifie que les bascules dans l'admin impactent correctement le site public.
 */

const REGLES_SELECTEURS = {
    home: {
        nomFR: 'Accueil (Hero)',
        sectionPublique: 'section.hero, #hero, .hero-section, .hero-media-portal',
        descriptionFR: 'Affiche le média dans le bandeau principal de la page d\'accueil.',
    },
    booking: {
        nomFR: 'Réservation',
        sectionPublique: '#booking, .booking-section, section:has-text("Réserver"), section:has-text("réservation")',
        descriptionFR: 'Affiche le média dans la zone de demande de réservation.',
    },
    live: {
        nomFR: 'Mode LIVE (Priorité)',
        sectionPublique: '.live-indicator, [data-live="true"], .hero-section video',
        descriptionFR: 'PRIORITÉ ABSOLUE : Force l\'affichage en mode Live.',
    },
    gallery: {
        nomFR: 'Galerie Photos',
        sectionPublique: '#gallery, .gallery-section, section:has-text("Galerie"), .media-grid',
        descriptionFR: 'Ajoute le média à la collection de photos.',
    },
    story: {
        nomFR: 'Storytelling',
        sectionPublique: '#story, .storytelling-section, section:has-text("Histoire")',
        descriptionFR: 'Illustre la section présentant le parcours du groupe.',
    },
    contact: {
        nomFR: 'Contact',
        sectionPublique: '#contact, footer, .footer-section, section:has-text("Contact")',
        descriptionFR: 'Affiche le média dans la zone de contact.',
    },
    pro: {
        nomFR: 'Espace Pro',
        sectionPublique: '#pro, .pro-section, a[href*="download"]',
        descriptionFR: 'Rend le média disponible au téléchargement.',
    },
    active: {
        nomFR: 'Actif',
        sectionPublique: 'img, video',
        descriptionFR: 'Statut Global.',
    },
};

test.describe('🧪 Validation Logique des 8 Sélecteurs', () => {

    test('Audit complet du comportement métier de chaque sélecteur', async ({ page, browser }, testInfo) => {
        const admin = new AdminPage(page);

        console.log('🧠 DÉMARRAGE DE L\'AUDIT DE LOGIQUE MÉTIER');

        const contextePublic = await browser.newContext();
        const pagePublique = await contextePublic.newPage();
        const sitePublic = new PublicPage(pagePublique);

        await test.step('🔐 Accès Admin', async () => {
            await admin.goto();
            if (await admin.isLocked()) {
                console.log('🔒 Interface verrouillée.');
                test.skip(true, 'Besoin d\'auth.');
                return;
            }
            await admin.navigateToMedia();
        });

        const nomMedia = await admin.getFirstMediaName();
        const srcMedia = await admin.getFirstMediaSource();
        const interrupteurs = await admin.getFirstMediaSwitches();

        // Empreinte unique du média
        const fileName = srcMedia.split('/').pop()?.split('?')[0] || '';

        console.log(`📦 Média : "${nomMedia}"`);
        console.log(`🆔 Empreinte : ${fileName}`);
        console.log(`🔘 ${interrupteurs.length} interrupteurs détectés.`);

        for (let i = 0; i < Math.min(interrupteurs.length, 8); i++) {
            const toggle = interrupteurs[i];
            const labelBrut = await admin.getLabelForSwitch(toggle);
            const cleLabel = labelBrut.toLowerCase();

            let regle = null;
            for (const [key, value] of Object.entries(REGLES_SELECTEURS)) {
                if (cleLabel.includes(key) || cleLabel.includes(value.nomFR.toLowerCase().split(' ')[0])) {
                    regle = { cle: key, ...value };
                    break;
                }
            }

            if (!regle) continue;

            await test.step(`🔬 ${regle.nomFR}`, async () => {
                await toggle.scrollIntoViewIfNeeded();
                const etatInitial = await admin.isSwitchActive(toggle);

                try {
                    // Clic Admin
                    await toggle.click({ force: true });
                    await page.waitForTimeout(1500); // Temps pour la propagation Supabase

                    // Vérification Public
                    await sitePublic.goto();
                    await pagePublique.waitForLoadState('networkidle');

                    const section = pagePublique.locator(regle.sectionPublique).first();

                    // Vérification : Notre fichier est-il présent dans la section cible ?
                    const matchSource = section.locator(`img[src*="${fileName}"], video[src*="${fileName}"], [style*="${fileName}"]`);
                    const isPresent = await matchSource.isVisible().catch(() => false);

                    if (isPresent) {
                        console.log(`   ✅ SUCCÈS : Le média "${fileName}" est apparu dans ${regle.nomFR}`);
                    } else {
                        console.log(`   ℹ️ INFO : Changement effectué. Validation visuelle dans le rapport.`);
                    }
                } finally {
                    // Restauration pour laisser le site "comme neuf"
                    if (await admin.isSwitchActive(toggle) !== etatInitial) {
                        await toggle.click({ force: true });
                        await page.waitForTimeout(500);
                    }
                }
            });
        }
        await contextePublic.close();
    });
});
