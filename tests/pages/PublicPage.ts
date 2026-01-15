import { Page, Locator } from '@playwright/test';

export class PublicPage {
    readonly page: Page;
    readonly bookingSection: Locator;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly phoneInput: Locator;
    readonly messageInput: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // Selectors basés sur la structure réelle du site
        this.bookingSection = page.locator('text=/Booking|Enflammez/i').first();
        this.nameInput = page.locator('textbox[placeholder*="Agence"], input[placeholder*="Agence"]').first();
        this.emailInput = page.locator('textbox[placeholder*="email"], input[type="email"]').first();
        this.phoneInput = page.locator('textbox[placeholder*="numéro"], input[placeholder*="numéro"]').first();
        this.messageInput = page.locator('textbox[placeholder*="Lieu"], textarea[placeholder*="Lieu"]').first();
        this.submitButton = page.locator('button:has-text("Envoyer")');
    }

    async goto() {
        await this.page.goto('/');
        await this.page.waitForLoadState('networkidle');
    }

    async scrollToBooking() {
        await this.bookingSection.scrollIntoViewIfNeeded();
    }

    async fillBookingForm(name: string, email: string, phone: string, message: string) {
        // NOM / STRUCTURE
        const nomInput = this.page.getByPlaceholder('Agence');
        if (await nomInput.isVisible()) {
            await nomInput.fill(name);
        }

        // EMAIL
        const emailInput = this.page.getByPlaceholder('email@example.com');
        if (await emailInput.isVisible()) {
            await emailInput.fill(email);
        }

        // TÉLÉPHONE
        const telInput = this.page.getByPlaceholder('Votre numéro');
        if (await telInput.isVisible()) {
            await telInput.fill(phone);
        }

        // MESSAGE / DÉTAILS
        const detailsInput = this.page.getByPlaceholder('Lieu');
        if (await detailsInput.isVisible()) {
            await detailsInput.fill(message);
        }
    }

    async isMediaVisible(name: string) {
        const media = this.page.locator(`img[alt*="${name}" i], div:has-text("${name}")`).first();
        return await media.isVisible();
    }

    async clickSocial(network: string) {
        const link = this.page.locator(`.social-badge.${network}, a[href*="${network}"]`).first();
        if (await link.isVisible()) {
            await link.click({ modifiers: ['Control'] }); // Ouverture dans un nouvel onglet (simulé)
        }
    }

    async clickProSpace() {
        const link = this.page.locator('a:has-text("Pro"), a:has-text("Kit Presse")').first();
        if (await link.isVisible()) {
            await link.click();
            await this.page.goBack();
        }
    }

    async playAudio() {
        const playBtn = this.page.locator('button[aria-label*="play" i], .play-button, .audio-player button').first();
        if (await playBtn.isVisible()) {
            await playBtn.click();
            await this.page.waitForTimeout(1000);
            await playBtn.click(); // Stop
        }
    }
}
