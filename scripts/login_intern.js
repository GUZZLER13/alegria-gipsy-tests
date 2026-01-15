require('dotenv').config();
const fs = require('fs');

/**
 * 🔐 SCRIPT DE CONNEXION SÉCURISÉ (INTERFACE CLIENT)
 * 
 * Ce script permet de générer le fichier auth.json sans avoir besoin des clés "Service Role".
 * Il utilise l'API publique de Supabase, exactement comme le ferait un utilisateur sur le site web.
 * 
 * Usage: node scripts/login_intern.js <email> <password>
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://votre-url.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY; // Clé publique (sans danger)

if (!SUPABASE_KEY) {
    console.error("❌ ERREUR: La variable SUPABASE_ANON_KEY est manquante dans le fichier .env");
    process.exit(1);
}

// Récupération des arguments ligne de commande ou .env
const email = process.argv[2] || process.env.PLAYWRIGHT_EMAIL;
const password = process.argv[3] || process.env.PLAYWRIGHT_PASSWORD;

if (!email || !password) {
    console.error("❌ Usage: node scripts/login_intern.js <email> <password>");
    console.log("   (Ou définissez PLAYWRIGHT_EMAIL et PLAYWRIGHT_PASSWORD dans le .env)");
    process.exit(1);
}

async function login() {
    console.log(`🔐 Tentative de connexion pour : ${email}`);

    try {
        // Simple requête REST vers l'API d'authentification de Supabase
        // Pas besoin de librairie lourde, un fetch suffit
        const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error_description || data.msg || 'Erreur inconnue');
        }

        console.log(`✅ Connexion réussie ! (ID: ${data.user.id})`);

        // Structure compatible avec Playwright (auth.json)
        const authFile = {
            cookies: [],
            origins: [
                {
                    origin: "https://alegria.guzzler-bot.cloud", // Adapter si besoin
                    localStorage: [
                        {
                            name: `sb-${new URL(SUPABASE_URL).hostname.split('.')[0]}-auth-token`,
                            value: JSON.stringify(data)
                        }
                    ]
                }
            ]
        };

        // Sauvegarde
        fs.writeFileSync('auth.json', JSON.stringify(authFile, null, 2));
        console.log("💾 Session sauvegardée dans 'auth.json'");
        console.log("🚀 L'alternant peut maintenant lancer 'npm run test:demo'");

    } catch (error) {
        console.error("❌ ÉCHEC DE CONNEXION :", error.message);
        console.log("   -> Vérifiez l'email et le mot de passe.");
        console.log("   -> Vérifiez que l'utilisateur a bien été confirmé (Email Confirm).");
        process.exit(1);
    }
}

login();
