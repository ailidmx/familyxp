# Déploiement — FamilyXP / FamQuest

## 🚀 Firebase Hosting

### Prérequis

- Compte Firebase avec projet créé
- Firebase CLI installé : `npm install -g firebase-tools`
- Connecté à Firebase : `firebase login`

### Configuration Firebase

```bash
# Initialiser Firebase dans le projet
firebase init

# Sélectionner :
# ☐ Firestore
# ☐ Hosting
# ☐ Storage
# ☐ Emulators
```

### Fichier firebase.json

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "sw.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      }
    ]
  },
  "storage": {
    "rules": "storage.rules"
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "hosting": {
      "port": 5000
    },
    "storage": {
      "port": 9199
    },
    "ui": {
      "enabled": true,
      "port": 4000
    }
  }
}
```

### Déploiement

```bash
# Build de production
npm run build

# Déploiement vers Firebase Hosting
firebase deploy

# Déploiement uniquement hosting
firebase deploy --only hosting

# Déploiement uniquement Firestore rules
firebase deploy --only firestore:rules

# Déploiement uniquement indexes
firebase deploy --only firestore:indexes

# Preview (environnement de test)
firebase hosting:channel:dev
```

### Variables d'environnement

Les variables d'environnement sont gérées via `.env` en développement et via la console Firebase en production.

**Production :**
```bash
# Dans la console Firebase > Hosting > Configure > Environment variables
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_USE_FIREBASE_EMULATORS=false
```

## 🔄 CI/CD avec GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
```

## 📱 PWA

### Configuration PWA (nuxt.config.ts)

```typescript
export default defineNuxtConfig({
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'FamilyXP',
      short_name: 'FamilyXP',
      description: 'Application de gamification familiale',
      theme_color: '#4F46E5',
      background_color: '#FFFFFF',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    }
  }
})
```

## 🌐 Environnements

FamilyXP utilise **3 projets Firebase distincts** pour séparer les environnements de développement, recette et production.

| Environnement | Projet Firebase | Site Hosting | URL |
|---------------|----------------|--------------|-----|
| **Dev** | `famillyxp` | `famillyxp` | [https://famillyxp-dev.web.app](https://famillyxp-dev.web.app) |
| **UAT** | `familyxp-uat` | `familyxp-uat` | [https://familyxp-uat.web.app](https://familyxp-uat.web.app) |
| **Prod** | `familyxp-prod` | `familyxp-prod` | [https://familyxp-prod.web.app](https://familyxp-prod.web.app) |

### Déploiement par environnement

```bash
# Dev (développement local + emulators)
npm run dev

# Build pour un environnement spécifique
npm run build:dev      # → .output/public (dev)
npm run build:uat      # → .output/public (uat)
npm run build:prod     # → .output/public (prod)

# Déploiement vers un environnement spécifique
firebase deploy --project famillyxp --only hosting:dev
firebase deploy --project familyxp-uat --only hosting:uat
firebase deploy --project familyxp-prod --only hosting:prod

# Déploiement complet (Firestore rules + hosting)
firebase deploy --project familyxp-prod
```

### Configuration .firebaserc

```json
{
  "projects": {
    "default": "famillyxp",
    "dev": "famillyxp",
    "uat": "familyxp-uat",
    "prod": "familyxp-prod"
  },
  "targets": {
    "famillyxp": {
      "hosting": { "dev": ["famillyxp"] }
    },
    "familyxp-uat": {
      "hosting": { "uat": ["familyxp-uat"] }
    },
    "familyxp-prod": {
      "hosting": { "prod": ["familyxp-prod"] }
    }
  }
}
```

### Variables d'environnement par environnement

Chaque projet Firebase a ses propres clés de configuration. Les fichiers `.env` :

```
.env.development    → Projet famillyxp (dev)
.env.uat            → Projet familyxp-uat
.env.production     → Projet familyxp-prod
```

### Domaine personnalisé (plus tard)
- `familyxp.app` ou `famquest.app`
- Configuration DNS via Firebase Hosting

## 📊 Monitoring

### Firebase Performance Monitoring
- Activer dans la console Firebase
- Surveiller les temps de chargement
- Identifier les ralentissements

### Firebase Crashlytics
- Activer dans la console Firebase
- Surveiller les erreurs JavaScript

### Google Analytics
- Activer dans la console Firebase
- Suivre l'engagement utilisateur
- Analyser les parcours
