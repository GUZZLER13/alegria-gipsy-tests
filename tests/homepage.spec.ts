import { test, expect } from '@playwright/test';

test('Homepage loads successfully', async ({ page }) => {
    // Replace with the actual production URL or localhost for testing
    // For now using the placeholder as per README instructions, or localhost if available
    const targetUrl = 'http://localhost:5173'; // Default to dev for local test, user can change to prod

    await page.goto(targetUrl);

    // Check that the page has a title (basic availability check)
    await expect(page).toHaveTitle(/Alegria/i);

    // Check for a main element or specific content to ensure proper rendering
    // await expect(page.locator('body')).toBeVisible();
});
