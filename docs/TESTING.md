# Guide des Tests — FamilyXP / FamQuest

## 🧪 Stack de test

- **Vitest** — Tests unitaires et d'intégration
- **Vue Test Utils** — Tests de composants Vue
- **Playwright** — Tests E2E
- **Firebase Emulator Suite** — Tests d'intégration Firebase

## 📋 Structure des tests

```
/tests
├── unit/               # Tests unitaires
│   ├── utils/          # Tests des utilitaires
│   │   ├── points.test.ts
│   │   └── validation.test.ts
│   └── composables/    # Tests des composables
│       ├── usePoints.test.ts
│       └── useHousehold.test.ts
│
├── components/         # Tests des composants Vue
│   ├── AddPointsForm.test.ts
│   ├── HouseholdSelector.test.ts
│   └── PointHistory.test.ts
│
├── integration/        # Tests d'intégration Firebase
│   ├── auth.test.ts
│   ├── household.test.ts
│   └── points.test.ts
│
├── e2e/                # Tests E2E Playwright
│   ├── auth.spec.ts
│   ├── household.spec.ts
│   └── points.spec.ts
│
└── setup/              # Configuration des tests
    ├── firebase.ts     # Setup Firebase Emulator
    └── seed.ts         # Données de test
```

## 🚀 Lancer les tests

```bash
# Tous les tests
npm run test

# Tests unitaires uniquement
npm run test:unit

# Tests composants
npm run test:components

# Tests d'intégration (nécessite émulateurs)
npm run test:integration

# Tests E2E (nécessite app + émulateurs)
npm run test:e2e

# Avec couverture
npm run test:coverage

# Mode watch
npm run test:watch
```

## 📝 Écrire des tests

### Tests unitaires (Vitest)

```typescript
// tests/unit/utils/points.test.ts
import { describe, it, expect } from 'vitest'
import { calculatePoints, canAffordReward } from '~/utils/points'

describe('calculatePoints', () => {
  it('should add bonus points correctly', () => {
    const result = calculatePoints(100, 50, 'bonus')
    expect(result).toBe(150)
  })

  it('should not go below zero for malus', () => {
    const result = calculatePoints(10, 20, 'malus')
    expect(result).toBe(0)
  })
})

describe('canAffordReward', () => {
  it('should return true if user has enough points', () => {
    expect(canAffordReward(100, 50)).toBe(true)
  })

  it('should return false if user does not have enough points', () => {
    expect(canAffordReward(30, 50)).toBe(false)
  })
})
```

### Tests composants (Vue Test Utils)

```typescript
// tests/components/AddPointsForm.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AddPointsForm from '~/components/points/AddPointsForm.vue'

describe('AddPointsForm', () => {
  it('should render rule options', () => {
    const wrapper = mount(AddPointsForm, {
      props: {
        rules: [
          { id: '1', name: 'Faire ses devoirs', points: 10 }
        ]
      }
    })
    expect(wrapper.text()).toContain('Faire ses devoirs')
  })

  it('should emit add-points event on submit', async () => {
    const wrapper = mount(AddPointsForm, {
      props: {
        rules: [
          { id: '1', name: 'Faire ses devoirs', points: 10 }
        ]
      }
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('add-points')).toBeTruthy()
  })
})
```

### Tests d'intégration Firebase

```typescript
// tests/integration/household.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { initializeTestEnvironment } from '@firebase/rules-unit-testing'

describe('Household CRUD', () => {
  let testEnv: any

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'familyxp-test',
      firestore: {
        rules: fs.readFileSync('firestore.rules', 'utf8')
      }
    })
  })

  afterAll(async () => {
    await testEnv.cleanup()
  })

  it('should create a household', async () => {
    const db = testEnv.authenticatedContext('user1').firestore()
    await db.collection('households').add({
      name: 'Test Household',
      createdAt: new Date()
    })
    const snapshot = await db.collection('households').get()
    expect(snapshot.size).toBe(1)
  })
})
```

### Tests E2E (Playwright)

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test('should login successfully', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[data-testid="email"]', 'test@example.com')
  await page.fill('[data-testid="password"]', 'password123')
  await page.click('[data-testid="login-button"]')
  await expect(page).toHaveURL('/dashboard')
})

test('should show error on invalid credentials', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[data-testid="email"]', 'wrong@example.com')
  await page.fill('[data-testid="password"]', 'wrong')
  await page.click('[data-testid="login-button"]')
  await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
})
```

## 🔧 Configuration

### Vitest (vitest.config.ts)

```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup/firebase.ts'],
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['app/**/*.ts', 'app/**/*.vue'],
      exclude: ['app/types/**']
    }
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, 'app')
    }
  }
})
```

### Playwright (playwright.config.ts)

```typescript
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI
  }
})
```

## 📊 Bonnes pratiques

1. **Tester la logique métier, pas l'implémentation**
2. **Un test = un comportement**
3. **Nommer clairement** : `should do something when condition`
4. **Éviter les tests fragiles** (pas de sélecteurs CSS complexes)
5. **Utiliser les data-testid** pour les sélecteurs E2E
6. **Seeder les données de test** plutôt que de les créer dans chaque test
7. **Nettoyer après chaque test** (surtout Firebase)
