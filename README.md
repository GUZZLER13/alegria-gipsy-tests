# 🧪 Alegria Gipsy - Tests de Bout en Bout (E2E)

Bienvenue sur le dépôt de tests automatisés du projet **Alegria Gipsy**.
Ce projet utilise **Playwright**, un outil moderne pour simuler un utilisateur réel sur le site web et vérifier que tout fonctionne correctement.

## 🎯 Objectif
Le but de ce projet est de tester le vrai site en ligne (Production) pour s'assurer qu'il n'y a pas de bugs.
L'URL de production configurée par défaut est :
👉 **[https://alegria.guzzler-bot.cloud/](https://alegria.guzzler-bot.cloud/)**

---

## 🛠️ Prérequis
Avant de commencer, assure-toi d'avoir installé sur ta machine :
1.  **Node.js** (version 16 ou supérieure) : [Télécharger ici](https://nodejs.org/).
2.  **Git** : Pour gérer le code source.
3.  **VS Code** (recommandé) : L'éditeur de code idéal pour Playwright.

---

## 🚀 Installation (Premier démarrage)

Voici les étapes à suivre pas à pas pour installer le projet sur ton ordinateur :

### 1. Cloner le projet
Ouvre ton terminal (PowerShell ou CMD) et lance la commande suivante pour récupérer le code :
```bash
git clone https://github.com/GUZZLER13/alegria-gipsy-tests.git
cd alegria-gipsy-tests
```

### 2. Installer les dépendances
Installe les librairies nécessaires (Playwright, Typescript, etc.) qui sont listées dans le `package.json` :
```bash
npm install
```

### 3. Installer les navigateurs de test
Playwright a besoin de ses propres versions de Chrome, Firefox et Safari pour tester. Lance cette commande pour les télécharger :
```bash
npx playwright install
```

---

## 🔐 Tester la partie Admin (Connexion Google)

Pour tester la partie Admin, Playwright ne peut pas se connecter "tout seul" à cause de la sécurité Google (2FA, etc.).
La solution est de **sauvegarder ta session de connexion** une seule fois et de la réutiliser.

### Étape 1 : Générer le fichier de connexion
Lance cette commande spéciale. Elle va ouvrir un navigateur où tu devras te connecter manuellement à l'Admin.
```bash
npx playwright codegen --save-storage=auth.json https://alegria.guzzler-bot.cloud/admin
```
1.  Connecte-toi avec ton compte Google dans la fenêtre qui s'ouvre.
2.  Une fois sur le Dashboard Admin, ferme le navigateur Playwright.
3.  Un file `auth.json` a été créé à la racine ! C'est ta "clé" d'accès.

### Étape 2 : Utiliser la connexion dans les tests
Dans tes fichiers de test (ex: `admin.spec.ts`), dis à Playwright d'utiliser ce fichier :

```typescript
test.use({ storageState: 'auth.json' });

test('Accès Dashboard Admin', async ({ page }) => {
  await page.goto('/admin');
  // Tu es déjà connecté !
});
```

> [!DANGER]
> **⚠️ TRÈS IMPORTANT : SÉCURITÉ ⚠️**
>
> **NE JAMAIS** mettre le fichier `auth.json` sur GitHub.
> Ce fichier contient tes accès personnels (cookies de connexion). Si tu le partages, nimporte qui peut se connecter à ta place !
>
> 👉 **Vérifie toujours** qu'il est bien ignoré (grisé) par VS Code avant de faire un commit.

---

## 🎮 Lancer les Tests

Il y a plusieurs façons de lancer les tests. En tant qu'alternant, je te conseille le **Mode UI** qui est très visuel.

### Option 1 : Le Mode Interactif (Recommandé) ✨
C'est le plus simple pour comprendre ce qu'il se passe. Une fenêtre va s'ouvrir où tu pourras voir les tests, les lancer un par un, et voir le navigateur en temps réel sur le site de production.
```bash
npx playwright test --ui
```

### Option 2 : Lancer tous les tests (Mode rapide)
Cette commande lance tous les tests en fond (sans ouvrir de fenêtre) et te donne juste le résultat final (Succès ou Échec).
```bash
npx playwright test
```

### Option 3 : Voir le rapport
Si des tests ont échoué, tu peux voir un rapport HTML détaillé avec :
```bash
npx playwright show-report
```

---

## 📂 Organisation du projet

Voici comment les fichiers sont rangés :

*   **`tests/`** : C'est ici que tu écriras tes tests. Chaque fichier `.spec.ts` est un scénario de test.
    *   Exemple : `homepage.spec.ts` teste la page d'accueil.
*   **`playwright.config.ts`** : Le fichier de config principal. L'URL `baseURL` est réglée sur la prod (`https://alegria.guzzler-bot.cloud/`).
*   **`package.json`** : La liste des outils utilisés par le projet.

---

## 💡 Astuce pour tester en local
Par défaut, les tests tapent sur le site en ligne.
Si tu veux tester une version locale (ex: `http://localhost:5173`), tu peux changer la `baseURL` dans `playwright.config.ts` ou dans ton fichier de test.

Bon courage pour les tests ! 🚀
