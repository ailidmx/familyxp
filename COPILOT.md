# COPILOT.md — Instructions pour GitHub Copilot

## 🎯 Contexte du projet

Tu aides à développer **FamilyXP/FamQuest**, une application PWA mobile-first de gamification familiale.

**Stack :** Nuxt 3, Vue 3, TypeScript, Tailwind CSS, shadcn-vue, Pinia, Firebase Auth, Firestore, Firebase Hosting.

## 📐 Style de code attendu

### TypeScript

```typescript
// Toujours typer explicitement les interfaces et fonctions publiques
export interface User {
  id: string
  displayName: string
  email: string
  createdAt: Timestamp
}

// Utiliser les types génériques quand approprié
export async function getDocument<T>(path: string, id: string): Promise<T | null>
```

### Composables

```typescript
// Toujours exporter une fonction qui retourne un objet
export function usePoints() {
  const addPoints = async (householdId: string, memberId: string, points: number) => {
    // ...
  }
  return { addPoints }
}
```

### Composants Vue

```vue
<script setup lang="ts">
// Props typées
interface Props {
  householdId: string
  memberId: string
}
const props = defineProps<Props>()

// Événements typés
const emit = defineEmits<{
  (e: 'points-added', amount: number): void
}>()
</script>
```

## 🔧 Snippets utiles

### Store Pinia

```typescript
export const useHouseholdStore = defineStore('household', () => {
  const households = ref<Household[]>([])
  const currentHouseholdId = ref<string | null>(null)

  const currentHousehold = computed(() =>
    households.value.find(h => h.id === currentHouseholdId.value)
  )

  async function fetchHouseholds(userId: string) {
    // ...
  }

  return { households, currentHouseholdId, currentHousehold, fetchHouseholds }
})
```

### Firebase query

```typescript
import { collection, query, where, getDocs } from 'firebase/firestore'

const q = query(
  collection(db, 'memberships'),
  where('userId', '==', userId),
  where('householdId', '==', householdId)
)
const snapshot = await getDocs(q)
```

## 🚫 Éviter

- ❌ `any` — Toujours typer
- ❌ Logique métier dans les templates Vue
- ❌ Données familiales en dur
- ❌ `console.log` dans le code de production
- ❌ Mutations directes du store sans passer par les actions

## ✅ Privilégier

- ✅ `computed` pour les dérivations
- ✅ `watch` pour les effets de bord
- ✅ `async/await` plutôt que `.then()`
- ✅ Les composables pour la logique réutilisable
- ✅ Les types partagés dans `app/types/`
