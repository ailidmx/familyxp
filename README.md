# FamilyXP / FamQuest 🎮👨‍👩‍👧‍👦

**Transformez la vie de famille en jeu collaboratif.**

FamilyXP (nom provisoire) est une application PWA mobile-first qui transforme la gestion familiale en un jeu motivant et juste. Points bonus/malus, défis, récompenses, contrats familiaux négociés — le tout dans une application installable sur mobile, sans passer par les stores.

## ✨ Concept

Chaque foyer définit **son propre contrat familial** négocié ensemble :

- ✅ Règles bonus (faire ses devoirs, ranger sa chambre, aider à la cuisine…)
- ❌ Règles malus (retard, oubli de corvée, comportement irrespectueux…)
- 🎯 Objectifs individuels et collectifs
- 🏆 Récompenses personnalisées
- 📅 Période de validité
- 👀 Modalités de validation

## 🏠 Public cible

- Parents de 30 à 50 ans
- Familles recomposées
- Familles avec garde alternée
- Grands-parents impliqués
- Familles vivant dans plusieurs foyers

## 📋 Liens utiles

| Lien | URL |
|------|-----|
| **GitHub Project Board** | [https://github.com/ailidmx/familyxp/projects](https://github.com/ailidmx/familyxp/projects) |
| **Budget & Coûts** | [docs/BUDGET.md](./docs/BUDGET.md) |
| **Documentation** | [docs/](./docs/) |
| **Repo GitHub** | [https://github.com/ailidmx/familyxp](https://github.com/ailidmx/familyxp) |

## 🛠 Stack technique

| Technologie | Usage |
|-------------|-------|
| **Nuxt 3** | Framework frontend |
| **Vue 3** | UI components |
| **TypeScript** | Langage (strict) |
| **Tailwind CSS** | Styles |
| **shadcn-vue** | Composants UI |
| **Pinia** | State management |
| **VueUse** | Composables utilitaires |
| **Firebase Auth** | Authentification |
| **Firestore** | Base de données |
| **Firebase Hosting** | Hébergement |
| **Vitest** | Tests unitaires |
| **Vue Test Utils** | Tests composants |
| **Playwright** | Tests E2E |
| **Firebase Emulator Suite** | Développement local |

## 🚀 Démarrage rapide

```bash
# Cloner le repo
git clone https://github.com/casabert/familyxp.git
cd familyxp

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés Firebase

# Lancer les émulateurs Firebase
npm run emulators

# Lancer l'application en développement
npm run dev
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [AGENTS.md](AGENTS.md) | Instructions pour les agents IA |
| [CLAUDE.md](CLAUDE.md) | Instructions spécifiques Claude |
| [COPILOT.md](COPILOT.md) | Instructions spécifiques GitHub Copilot |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Guide de contribution |
| [CHANGELOG.md](CHANGELOG.md) | Historique des versions |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architecture technique |
| [docs/DATA_MODEL.md](docs/DATA_MODEL.md) | Modèle de données Firestore |
| [docs/BUSINESS_RULES.md](docs/BUSINESS_RULES.md) | Règles métier |
| [docs/TESTING.md](docs/TESTING.md) | Guide des tests |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Déploiement |
| [docs/PRODUCT_VISION.md](docs/PRODUCT_VISION.md) | Vision produit |
| [docs/BUSINESS_MODEL.md](docs/BUSINESS_MODEL.md) | Modèle économique |
| [onboarding/INSTALLATION_DEBUTANT.md](onboarding/INSTALLATION_DEBUTANT.md) | Guide débutant |
| [onboarding/INSTALLATION_DEV.md](onboarding/INSTALLATION_DEV.md) | Guide développeur |

## 📦 Structure du projet

```
/
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── COPILOT.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── .env.example
├── app/
│   ├── components/       # Composants Vue
│   ├── pages/            # Pages Nuxt
│   ├── layouts/          # Layouts
│   ├── composables/      # Composables Vue
│   ├── stores/           # Stores Pinia
│   ├── types/            # Types TypeScript
│   ├── lib/firebase/     # Configuration Firebase
│   ├── utils/            # Utilitaires
│   └── middleware/       # Middleware Nuxt
├── docs/                 # Documentation
├── onboarding/           # Guides d'installation
├── prompts/              # Prompts pour agents IA
└── scripts/              # Scripts utilitaires
```

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests avec couverture
npm run test:coverage

# Tests E2E
npm run test:e2e

# Lint
npm run lint
```

## 📱 PWA

L'application est une PWA installable :

1. Ouvrir l'URL dans le navigateur mobile
2. Appuyer sur "Ajouter à l'écran d'accueil"
3. L'application s'ouvre comme une app native

## 🤝 Contribution

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les détails.

## 📄 Licence

Projet privé — Tous droits réservés.
