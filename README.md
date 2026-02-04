# Maison Nubi - Application Web

Application Next.js pour la plateforme de réservation de beauté Maison Nubi.

## 🛠️ Stack Technique

- **Framework** : Next.js 14+ (App Router)
- **Langage** : TypeScript
- **Style** : Tailwind CSS + Shadcn/ui
- **Base de données** : Supabase (PostgreSQL)
- **Tests** : Vitest (Unit), Playwright (E2E)

## 🚀 Installation

1.  **Pré-requis** : Node.js 18+
2.  **Cloner le repo** :
    ```bash
    git clone <repo_url>
    cd orea-app
    ```
3.  **Installer les dépendances** :
    ```bash
    npm install
    ```
4.  **Configuration** :
    Copier `.env.example` vers `.env.local` et remplir les clés Supabase.

## 📜 Scripts Disponibles

- `npm run dev` : Lance le serveur de développement (http://localhost:3000)
- `npm run build` : Construit l'application pour la production
- `npm run start` : Lance le serveur de production
- `npm test` : Lance les tests unitaires (Vitest)
- `npx playwright test` : Lance les tests E2E
- `npx supabase db push` : Applique les migrations locales vers Supabase

## 🧪 Tests

### Unitaires (Vitest)
Les tests unitaires couvrent les utilitaires et les composants isolés.
```bash
npm test
```

### End-to-End (Playwright)
Les tests E2E valident les parcours critiques (ex: accès profil prestataire).
**Note** : Le serveur de dev doit être accessible ou sera lancé automatiquement.
```bash
npx playwright test
```

## 📂 Structure du Projet

- `/src/app` : Pages et routes (Next.js App Router)
- `/src/components` : Composants React réutilisables
- `/src/lib` : Utilitaires, hooks, et configuration (Supabase, Utils)
- `/supabase/migrations` : Fichiers SQL pour la structure de la DB
- `/tests` : Tests E2E Playwright

## ✨ Fonctionnalités Clés

- **Profils Prestataires** : Page dédiée avec portfolio, services et horaires.
- **Système "Premium"** : Badges, vues illimitées, tracking.
- **Design System** : Thème personnalisé (Anthracite/Gold) pour une image de marque luxe.
- **Analytics** : Tracking des vues de profil et clics WhatsApp.