const fs = require('fs');

async function createSetup() {
    console.log("🔒 CRÉATION DU FICHIER AUTH.JSON (MODE MANUEL)");
    console.log("----------------------------------------------");
    console.log("Pour des raisons de sécurité, nous ne pouvons pas mettre vos identifiants dans GitHub.");

    // Contenu "placeholder" si l'utilisateur n'a pas encore de fichier
    const exampleAuth = {
        cookies: [],
        origins: [
            {
                origin: "https://alegria.guzzler-bot.cloud",
                localStorage: [
                    {
                        name: "sb-refresh-token",
                        value: "INSÉRER_LE_TOKEN_ICI"
                    }
                ]
            }
        ]
    };

    if (!fs.existsSync('auth.json')) {
        fs.writeFileSync('auth.json', JSON.stringify(exampleAuth, null, 2));
        console.log("✅ Fichier 'auth.json' créé.");
    } else {
        console.log("ℹ️ Le fichier 'auth.json' existe déjà. On ne l'écrase pas.");
    }

    console.log("\n🚀 PROCÉDURE POUR L'ALTERNANT :");
    console.log("1. Connecte-toi manuellement sur https://alegria.guzzler-bot.cloud/admin avec Chrome.");
    console.log("2. Ouvre la console développeur (F12).");
    console.log("3. Colle le contenu du fichier 'scripts/manual_auth_extract.js'.");
    console.log("4. Une fenêtre va s'ouvrir : Copie le texte JSON.");
    console.log("5. Colle ce texte dans ce fichier 'auth.json'.");
    console.log("\nC'est tout ! Tu peux maintenant lancer 'npm run test:demo'.");
}

createSetup();
