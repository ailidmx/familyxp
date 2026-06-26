# AGENTS.md — Instructions pour agents IA

## 🎯 Mission

Tu travailles sur **FamilyXP/FamQuest**, une application PWA mobile-first de gamification familiale.

## 📖 Lecture obligatoire avant de coder

1. `README.md` — Vue d'ensemble du projet
2. `docs/ARCHITECTURE.md` — Architecture technique
3. `docs/DATA_MODEL.md` — Modèle de données Firestore
4. `docs/BUSINESS_RULES.md` — Règles métier
5. Vérifier les tests existants avant d'ajouter du code

## 🧱 Stack

- **Nuxt 3** + **Vue 3** + **TypeScript** (strict)
- **Tailwind CSS** + **shadcn-vue**
- **Pinia** pour le state management
- **Firebase Auth** + **Firestore** + **Firebase Hosting**
- **Vitest** + **Vue Test Utils** + **Playwright**
- **Firebase Emulator Suite** pour le développement local

## ⚠️ Règles absolues

### 1. Ne jamais coder une famille spécifique en dur

Les données familiales (Foyer Papa, Foyer Maman, etc.) sont des **seed data de développement uniquement**. La logique produit doit être **totalement générique**.

### 2. Architecture multi-tenant dès le départ

Toutes les données sont organisées par `householdId`. Un utilisateur peut appartenir à plusieurs foyers.

### 3. Mobile-first

L'application est conçue pour être utilisée sur mobile. Penser :
- Navigation simple
- Boutons tactiles larges
- Pas de hover-only interactions
- Performance sur réseau lent

### 4. TypeScript strict

```typescript
// ✅ Bon
interface User {
  id: string
  displayName: string
  email: string
}

// ❌ Mauvais
const user = { id: '123', name: 'John' }
```

### 5. Tests avant tout

- Tests unitaires pour la logique métier
- Tests composants pour l'UI
- Tests E2E pour les parcours critiques
- Firebase Emulator pour les tests d'intégration

### 6. Pas de logique métier dans les composants

```typescript
// ✅ Bon — dans un composable ou store
const { addPoints } = usePoints()

// ❌ Mauvais — dans un composant
const addPoints = async () => { /* logique métier */ }
```

## 📁 Structure du code

```
app/
├── components/       # Composants Vue réutilisables
├── pages/            # Pages Nuxt (routes automatiques)
├── layouts/          # Layouts (default, auth, household)
├── composables/      # Logique réutilisable (useAuth, usePoints...)
├── stores/           # Stores Pinia
├── types/            # Types/interfaces TypeScript
├── lib/firebase/     # Config Firebase, helpers Firestore
├── utils/            # Fonctions utilitaires pures
└── middleware/       # Middleware Nuxt (auth, household selection)
```

## 🔄 Workflow de développement

1. Lire la documentation pertinente
2. Vérifier les tests existants
3. Implémenter la fonctionnalité
4. Écrire les tests
5. Vérifier que tous les tests passent
6. Documenter si nécessaire

## 📝 Conventions de code

### Nommage

- **Composables** : `use[Feature].ts` (ex: `useAuth.ts`, `usePoints.ts`)
- **Stores** : `[feature]Store.ts` (ex: `householdStore.ts`, `pointsStore.ts`)
- **Composants** : `[FeatureName].vue` ou `[FeatureName].ts` (PascalCase)
- **Types** : `I[Entity]` pour interfaces, `T[Entity]` pour types
- **Fichiers** : kebab-case pour les fichiers (ex: `add-points-form.vue`)

### Firebase

- Utiliser les émulateurs en développement
- Ne pas exposer les clés de production
- Utiliser `firebase/app` et `firebase/firestore` (modular SDK v9+)

### Git

- Commits en français ou anglais (choisir et rester cohérent)
- Messages clairs : `feat:`, `fix:`, `docs:`, `test:`, `refactor:`
- Une fonctionnalité = une branche

## 🧪 Tests

```bash
# Lancer les tests
npm run test

# Tests avec couverture
npm run test:coverage

# Tests E2E
npm run test:e2e

# Lancer les émulateurs
npm run emulators
```

## 📋 GitHub Project Board

Le board de suivi est ici : https://github.com/users/ailidmx/projects/3

### Utiliser le board avec les MCP tools GitHub

Les agents IA avec accès aux MCP tools GitHub peuvent interagir avec le board :

```bash
# Lister les items du board
./scripts/board.sh list

# Ajouter un item (statut Todo par défaut)
./scripts/board.sh add "Phase 2: Modèle familial"

# Changer le statut d'un item
./scripts/board.sh status PVTI_xxx "In Progress"
./scripts/board.sh status PVTI_xxx Done
```

### Règles pour les agents IA

1. **Avant de commencer une tâche** → Vérifier le board pour voir ce qui est en cours
2. **En commençant une tâche** → Mettre l'item en "In Progress"
3. **En terminant une tâche** → Mettre l'item en "Done"
4. **Si une nouvelle tâche émerge** → L'ajouter au board en "Todo"

### Synchronisation docs/board

Le fichier `docs/PROJECT_BOARD.md` doit refléter l'état du board GitHub.
Utiliser `./scripts/board.sh list` pour vérifier et mettre à jour manuellement si besoin.

## ❓ Questions fréquentes

**Q: Puis-je modifier la structure du projet ?**
R: Oui, mais documenter dans ARCHITECTURE.md.

**Q: Puis-je ajouter une dépendance ?**
R: Oui, mais justifier dans le commit et mettre à jour la stack dans README.md.

**Q: Comment gérer les données de démo ?**
R: Utiliser `scripts/seed.ts` qui charge les données de démonstration dans les émulateurs.

**Q: Comment mettre à jour le board ?**
R: Utiliser `./scripts/board.sh` ou les MCP tools GitHub (git_status, git_commit, etc.).
Le board est accessible via l'API GraphQL de GitHub.
