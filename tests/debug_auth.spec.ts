import { test } from '@playwright/test';
import fs from 'fs';

test.use({ storageState: 'auth.json' });

test('Extract Admin Selectors', async ({ page }) => {
    console.log('Navigating to Admin for inspection...');
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000); // Wait for React/Hydration

    // Dump the body HTML to analyze structure
    const content = await page.content();
    console.log('--- HTML DUMP START ---');
    console.log(content); // succinct enough for me to grep? simpler to write to file?
    // writting to file is better
    fs.writeFileSync('admin_dump.html', content);
    console.log('--- HTML DUMP END ---');
});
