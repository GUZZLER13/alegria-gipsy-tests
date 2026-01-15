# 🩺 Architecture Technique & Stratégie de Test - Alegria Gipsy

Ce document détaille l'ingénierie derrière la suite de tests E2E Playwright. L'objectif est de transformer un simple script de test en une infrastructure de **QA (Quality Assurance)** robuste, maintenable et rapide.

---

## 🏗️ 1. L'Architecture du Projet

Le projet suit le standard **Page Object Model (POM)**, une architecture de référence dans l'industrie.

### Pourquoi séparer les fichiers ?
Plutôt que d'avoir un "monolithe" de code illisible, nous divisons selon trois axes :
1.  **Séparation par Domaine** : `homepage`, `booking`, `admin`. Chaque fichier teste un périmètre fonctionnel précis.
2.  **Parallélisation** : En mode "Headless" (CI/CD), Playwright lance ces fichiers sur plusieurs processeurs en même temps, divisant le temps de test par 4.
3.  **Maintenabilité** : Si le bouton de réservation change de nom, on ne le modifie qu'à un seul endroit (le POM), et tous les tests qui l'utilisent sont réparés instantanément.

### Structure des dossiers :
- `tests/pages/` : Le cerveau du projet. Contient les **Locators** (où sont les éléments) et les **Actions** (comment on interagit).
- `tests/*.spec.ts` : Les scénarios de test. Ils racontent une "histoire" (ex: "Un client veut réserver un concert").
- `scripts/` : Outils d'infrastructure (authentification, extraction de données).

---

## 🔐 2. Le Moteur d'Authentification (Auth Engine)

Le plus gros défi technique était de contourner **Google OAuth** qui bloque les outils d'automatisation.

### La Solution "API-First" :
Au lieu d'essayer de cliquer sur "Se connecter avec Google" (ce qui déclencherait un CAPTCHA), nous avons créé un canal de secours :
1.  Le script `supabase_auth.js` communique directement avec le **serveur d'authentification Supabase via REST API**.
2.  Il récupère un **JWT (JSON Web Token)** valide pour l'utilisateur de test.
3.  Ce token est injecté dans un fichier `auth.json`.
4.  Playwright charge ce fichier au démarrage : le navigateur "croit" qu'il est déjà connecté. **Résultat : 0 seconde perdue sur les pages de login.**

---

## 🔬 3. Analyse pas à pas des Tests Critiques

### A. L'Audit d'Audience (Intelligence Dashboard)
Ce test vérifie l'intelligence de données du système.
*   **Action Client** : Playwright simule un visiteur réel (scroll, clics sociaux).
*   **Validation Dashboard** : Il retourne en admin pour s'assurer que les compteurs de visites s'incrémentent.
*   **Pourquoi ?** Pour garantir que les outils de marketing et d'analyse d'audience d'Alegria sont fiables et précis.

### B. L'Interception Réseau (booking.spec.ts)
Ce test ne regarde pas seulement l'écran, il "écoute" les câbles réseau.
*   **Spying** : Playwright intercepte l'appel `POST` envoyé vers Supabase ou l'API d'email.
*   **Validation** : On vérifie que le serveur répond un code `200 OK`.
*   **Intêret** : Même si un développeur oublie d'afficher un message de succès sur le site, le test sait que la réservation est bien arrivée en base de données.

---

## 🛠️ 4. La Suite de Démonstration (Unified Demo)

Le fichier `demo-complet.spec.ts` est une exception technique volontaire.
*   **Le Mode Serial** : Normalement, Playwright repart de zéro à chaque test. Ici, on utilise `test.describe.serial` pour garder la **même fenêtre de navigateur ouverte**.
*   **Single Context** : On partage le même "State" entre les tests. Cela permet une démo fluide, comme si un humain utilisait le site pendant 2 minutes, parcourant toutes les pages sans jamais fermer son navigateur.

---

## 📊 5. Robustesse : Le "Safe-Mode"

Chaque test sensible est encapsulé dans une logique de sécurité :
```typescript
try {
  // Action de test (ex: activer "Mode Live")
} finally {
  // Restauration (ex: désactiver "Mode Live")
}
```
**C'est cette rigueur qui permet de lancer des tests sur un site en production sans jamais laisser de "déchets" ou de données de test visibles par les vrais clients.**

---

## 🚀 Conclusion Technique

L'infrastructure mise en place pour Alegria Gipsy n'est pas qu'une vérification de bugs. C'est un **système de documentation vivante**. Tout changement majeur dans le code source qui ne respecterait pas ces tests bloquerait le déploiement, protégeant ainsi l'intégrité du site 24h/24.
