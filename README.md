# 🎸 Alegria Gipsy - Notre Infrastructure de Tests E2E

Bienvenue dans l'écosystème technique d'Alegria Gipsy. Ce dépôt contient **notre suite de tests de pointe**, conçue pour garantir une fiabilité absolue à chaque déploiement.

## 📋 Prérequis

- Node.js 18+
- npm

## 🚀 Installation de l'environnement

### Pour Windows (Powershell)
```powershell
# 1. Installe les dépendances
npm install

# 2. Installe les navigateurs de test
npx playwright install
```

## ⚙️ Configuration de notre infrastructure

### 1. Initialisation du fichier `.env`

Nous utilisons des variables d'environnement pour sécuriser les accès sans les exposer dans le code source :

```bash
cp .env.example .env
```

### 2. Notre Moteur d'Authentification (Bypass Google)

Notre système utilise un mécanisme de copie de session pour contourner la sécurité OAuth (Google/GitHub) qui bloque les robots.
Voir la section **Setup Alternant** ci-dessous pour la procédure manuelle simplifiée (extraction de Cookies/LocalStorage).

## 🎓 🚀 Setup Alternant (Onboarding)

Si tu viens de cloner le repo, suis ces étapes pour configurer ton accès sécurisé :

### Option A : Connexion Automatique (Recommandé)
Si tu as reçu ton mot de passe Admin :
```bash
# Remplace par tes identifiants
node scripts/login_intern.js sapson210@gmail.com TonMotDePasse
```
*Le script va générer automatiquement ton `auth.json`. C'est fini !*

### Option B : Extraction Manuelle (Fallback)
Si la commande ci-dessus ne marche pas (ex: MFA activé), utilise la méthode manuelle :
1.  Connecte-toi sur [L'Admin du Site](https://alegria.guzzler-bot.cloud/admin).
2.  Appuie sur `F12` > Console.
3.  Colle le contenu de `scripts/manual_auth_extract.js`.
4.  Copie le résultat dans `auth.json`.

---
## 🧪 Lancement de nos suites de tests

### Notre Suite de Démonstration (6 étapes clés)
Optimisée pour la fluidité et le contrôle visuel :
```bash
npm run test:demo
```

### Notre Débugger Interactif (UI)
Pour une analyse pas à pas de nos sélecteurs :
```bash
npm run test:ui
```

### Notre Validation de Production (Headless)
Utilisée pour nos audits automatisés :
```bash
npm test
```

## 🏗️ Architecture et Philosophie (POM)

Nous avons adopté le **Page Object Model (POM)** pour structurer nos tests de manière modulaire et maintenable :

```
tests/
├── demo-complet.spec.ts    # Notre démonstration intégrale (6 étapes)
├── booking.spec.ts         # Validation de notre tunnel client
├── admin.spec.ts           # Vérification de nos accès critiques
└── pages/
    ├── AdminPage.ts        # Notre interface Admin modélisée
    └── PublicPage.ts       # Notre interface Public modélisée
```

## � Nos Rapports d'Audit

Chaque passage de test génère un rapport de conformité complet :
```bash
npx playwright show-report
```

---

## 📖 Documentation Interne

- [TECHNICAL_DOC.html](./TECHNICAL_DOC.html) - Notre architecture technique détaillée
- [PRESENTATION.html](./PRESENTATION.html) - Présentation métier de la suite de tests

---

*L'excellence technique au service de la musique. Propulsé par Alegria Gipsy Engineering.*
