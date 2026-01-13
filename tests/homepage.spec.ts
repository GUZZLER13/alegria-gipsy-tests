import { test, expect } from '@playwright/test';

test('Homepage loads successfully', async ({ page }) => {
    // Test runs against the baseURL configured in playwright.config.ts (Production by default)
    await page.goto('/');

    // Check that the page has a title (basic availability check)
    await expect(page).toHaveTitle(/Alegria/i);

    // Check for a main element or specific content to ensure proper rendering
    // await expect(page.locator('body')).toBeVisible();
});
