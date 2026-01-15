import { defineConfig, devices } from '@playwright/test';

// Configuration spéciale pour une démonstration fluide et imposante
export default defineConfig({
    testMatch: '**/demo-complet.spec.ts',
    workers: 1,
    fullyParallel: false,
    timeout: 300000,
    use: {
        baseURL: 'https://alegria.guzzler-bot.cloud/',
        // Taille Desktop Full HD par défaut
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
            slowMo: 1000,
            headless: false,
            // Mode plein écran pour un effet maximum
            args: ['--start-maximized']
        },
        screenshot: 'on',
        trace: 'on',
        storageState: 'auth.json',
    },
    reporter: [['line'], ['html', { open: 'always' }]],
    projects: [
        {
            name: 'DÉMO PRÉCISION',
            use: {
                ...devices['Desktop Chrome'],
                // On force le viewport à 1920x1080 ici aussi
                viewport: { width: 1920, height: 1080 },
                deviceScaleFactor: 1,
            },
        },
    ],
});
