# 🎸 Alegria Gipsy - Notre Infrastructure de Tests E2E

Bienvenue dans l'écosystème technique d'Alegria Gipsy. Ce dépôt contient **notre suite de tests de pointe**, conçue pour garantir une fiabilité absolue à chaque déploiement.

## 📋 Prérequis

- Node.js 18+
- npm

## 🚀 Installation de l'environnement

```bash
npm install
npx playwright install
```

## ⚙️ Configuration de notre infrastructure

### 1. Initialisation du fichier `.env`

Nous utilisons des variables d'environnement pour sécuriser les accès sans les exposer dans le code source :

```bash
cp .env.example .env
```

### 2. Notre Moteur d'Authentification

Notre système utilise un moteur de connexion personnalisé pour bypasser les blocages Google Auth et permettre des tests fluides en espace d'administration :

```bash
node scripts/supabase_auth.js
```

**Ce que fait notre moteur :**
- Initialise l'utilisateur test dans notre instance Supabase.
- Génère les tokens JWT sécurisés.
- Crée le fichier `auth.json` pour la persistance des sessions.

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
