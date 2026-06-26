# Instructions GitHub Copilot — FamilyXP

## 📋 Contexte

Tu travailles sur FamilyXP/FamQuest, une application PWA mobile-first de gamification familiale.

**Stack :** Nuxt 3, Vue 3, TypeScript, Tailwind CSS, shadcn-vue, Pinia, Firebase Auth, Firestore.

## 🎯 Style de code

### TypeScript
- Toujours typer explicitement
- Utiliser `interface` pour les objets, `type` pour les unions
- Éviter `any` à tout prix

### Composables
- Exporter une fonction qui retourne un objet
- Utiliser `ref` et `computed` de Vue
- Gérer les erreurs avec try/catch

### Composants Vue
- `<script setup lang="ts">`
- Props typées avec `defineProps<Props>()`
- Événements typés avec `defineEmits<{...}>()`
- Pas de logique métier dans le template

## 🚫 À éviter

- `any` dans les types
- Logique métier dans les composants
- Données familiales en dur
- `console.log` dans le code de production
- Mutations directes du store

## ✅ À privilégier

- `computed` pour les dérivations
- `async/await` plutôt que `.then()`
- Composables pour la logique réutilisable
- Types partagés dans `app/types/`
- Tests pour chaque nouvelle fonctionnalité
