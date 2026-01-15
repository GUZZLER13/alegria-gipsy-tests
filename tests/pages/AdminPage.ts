import { Page, Locator, expect } from '@playwright/test';

export class AdminPage {
    readonly page: Page;
    readonly loginButton: Locator;
    readonly mediaLink: Locator;
    readonly teamLink: Locator;
    readonly switches: Locator;

    readonly menuButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginButton = page.locator('button.google-login-btn--ultra');
        this.menuButton = page.locator('button:has(svg.lucide-menu), .sidebar-toggle, button[aria-label*="menu"]');
        // Mise à jour des sélecteurs pour le Dashboard Premium (Boutons au lieu de liens)
        this.mediaLink = page.locator('button.sidebar-tab-premium:has-text("Médiathèque")');
        this.teamLink = page.locator('button.sidebar-tab-premium:has-text("Line-Up")');
        this.switches = page.locator('button.toggle-btn, button[role="switch"], input[type="checkbox"]');
    }

    async goto() {
        await this.page.goto('/admin', { timeout: 60000 });
        await this.page.waitForLoadState('domcontentloaded');
    }

    async isLocked() {
        return await this.loginButton.isVisible({ timeout: 5000 }).catch(() => false);
    }

    async ensureSidebarOpen() {
        if (!await this.mediaLink.isVisible()) {
            await this.menuButton.click();
            await this.page.waitForTimeout(500);
        }
    }

    async navigateToMedia() {
        await this.ensureSidebarOpen();
        // Utilisation de force: true pour cliquer même si le bouton est techniquement "caché" par une transition CSS
        await this.mediaLink.click({ force: true, timeout: 5000 }).catch(() => console.log('      ⚠️ Clic forcé sur Médiathèque'));
        // On attend que le contenu apparaisse
        await this.page.waitForTimeout(2000);
    }

    async getFirstMediaName() {
        const mediaCard = this.page.locator('.media-card, [class*="card"]').filter({ has: this.page.locator('h3, h4, .media-title, span') }).first();
        if (await mediaCard.isVisible({ timeout: 5000 }).catch(() => false)) {
            const nameElement = mediaCard.locator('h3, h4, .media-title, span').first();
            return (await nameElement.textContent() || 'Média Inconnu').trim();
        }
        return 'Média Non Trouvé';
    }

    async getFirstMediaSource() {
        const mediaCard = this.page.locator('.media-card, [class*="card"]').filter({ has: this.page.locator('img, video') }).first();
        const media = mediaCard.locator('img, video').first();
        return await media.getAttribute('src') || await media.getAttribute('data-src') || '';
    }

    async getFirstMediaSwitches() {
        const mediaCard = this.page.locator('.media-card, [class*="card"]').filter({ has: this.switches }).first();
        if (await mediaCard.isVisible({ timeout: 5000 }).catch(() => false)) {
            return await mediaCard.locator(this.switches).all();
        }
        return await this.switches.all().catch(() => []);
    }

    async getLabelForSwitch(toggle: Locator) {
        try {
            // Dans le nouveau design, le label est dans .toggle-label à côté du bouton (frère suivant)
            const labelElement = toggle.locator('xpath=./following-sibling::span[@class="toggle-label"]');
            if (await labelElement.isVisible()) {
                return (await labelElement.textContent() || 'Inconnu').trim();
            }
            // Fallback sur le texte du parent si span non trouvé
            const parentText = await toggle.locator('xpath=..').textContent() || 'Sélecteur Inconnu';
            return parentText.trim();
        } catch {
            return 'Sélecteur Inconnu';
        }
    }

    async isSwitchActive(toggle: Locator) {
        const classes = await toggle.getAttribute('class') || '';
        return classes.includes('active');
    }
    async getStatValue(label: string) {
        // Recherche souple du texte (ex: "Visites" trouve "VISITES (30J)")
        const statCard = this.page.locator('.stat-card', { hasText: label }).first();
        if (await statCard.isVisible({ timeout: 4000 }).catch(() => false)) {
            // Tentative 1 : Classe explicite .stat-value
            const valueElement = statCard.locator('.stat-value');
            let valueText = '';
            if (await valueElement.isVisible({ timeout: 1000 }).catch(() => false)) {
                valueText = await valueElement.textContent() || '0';
            } else {
                // Tentative 2 : Prendre tout le texte de la carte et extraire les chiffres
                const fullText = await statCard.textContent() || '0';
                // On cherche la partie qui ressemble à un nombre (ex: "148")
                const match = fullText.match(/\d+/);
                valueText = match ? match[0] : '0';
            }
            return parseInt(valueText.replace(/[^\d]/g, ''), 10) || 0;
        }
        return 0;
    }
}
