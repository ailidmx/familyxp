# Architecture Technique — FamilyXP / FamQuest

## 🌍 Internationalisation (i18n)

FamilyXP est conçu multi-région et multi-langue dès le départ.

### Langues supportées

| Code | Langue       | Région    | Fichier        |
|------|-------------|-----------|----------------|
| `fr` | Français    | France    | `fr.ts`        |
| `es` | Español     | Mexique   | `es.ts`        |

### Fonctionnement

- Module : **@nuxtjs/i18n** (v9)
- Stratégie : `prefix_except_default` (le français est sans préfixe, `/es/` pour l'espagnol)
- Détection automatique : basée sur le navigateur (cookie `i18n_redirected`)
- Persistance : cookie + localStorage
- Fichiers de traduction : `app/i18n/locales/{langue}.ts`
- Utilisation dans les templates : `$t('clef.traduction')`
- Utilisation dans le script : `const { t } = useI18n()`

### Ajouter une langue

1. Créer `app/i18n/locales/{code}.ts`
2. Ajouter l'entrée dans `nuxt.config.ts` → `i18n.locales`
3. Ajouter la traduction dans `app/i18n/locales/fr.ts` et `es.ts` pour `language.{code}`

### Composant LanguageSwitcher

Disponible dans `app/components/LanguageSwitcher.vue`.
Affiche les langues disponibles et permet de basculer instantanément.

---

## 🏗 Vue d'ensemble

```
┌─────────────────────────────────────────────────┐
│                   Client (PWA)                   │
│  ┌───────────────────────────────────────────┐  │
│  │              Nuxt 3 + Vue 3               │  │
│  │  ┌──────┐ ┌────────┐ ┌───────────────┐  │  │
│  │  │Pages │ │Layouts │ │ Components    │  │  │
│  │  └──────┘ └────────┘ └───────────────┘  │  │
│  │  ┌──────────┐ ┌──────┐ ┌───────────┐   │  │
│  │  │Stores    │ │Utils │ │Composables│   │  │
│  │  │(Pinia)   │ │      │ │(use*)     │   │  │
│  │  └──────────┘ └──────┘ └───────────┘   │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │           Firebase SDK (v9 modular)        │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐  │  │
│  │  │Auth      │ │Firestore │ │Storage   │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│              Firebase Backend                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │Auth      │ │Firestore │ │Hosting       │   │
│  │(managed) │ │(NoSQL)   │ │(static)      │   │
│  └──────────┘ └──────────┘ └──────────────┘   │
│  ┌──────────┐ ┌──────────────┐                 │
│  │Storage   │ │Cloud Functions│ (si nécessaire) │
│  └──────────┘ └──────────────┘                 │
└─────────────────────────────────────────────────┘
```

## 📁 Structure détaillée

```
/app
├── components/           # Composants Vue réutilisables
│   ├── ui/              # Composants shadcn-vue
│   ├── household/       # Composants liés aux foyers
│   ├── contract/        # Composants liés aux contrats
│   ├── points/          # Composants liés aux points
│   └── rewards/         # Composants liés aux récompenses
│
├── pages/               # Pages Nuxt (routes automatiques)
│   ├── index.vue        # Page d'accueil / Dashboard
│   ├── login.vue        # Connexion
│   ├── register.vue     # Inscription
│   ├── household/       # Pages foyer
│   │   ├── index.vue    # Liste des foyers
│   │   ├── [id].vue     # Détail d'un foyer
│   │   └── create.vue   # Création d'un foyer
│   ├── contract/        # Pages contrat
│   │   ├── [id].vue     # Détail du contrat
│   │   └── create.vue   # Création du contrat
│   ├── points/          # Pages points
│   │   └── history.vue  # Historique des points
│   └── rewards/         # Pages récompenses
│       └── [id].vue     # Détail récompense
│
├── layouts/             # Layouts Nuxt
│   ├── default.vue      # Layout par défaut
│   ├── auth.vue         # Layout pour pages non connectées
│   └── household.vue    # Layout avec sélecteur de foyer
│
├── composables/         # Composables Vue
│   ├── useAuth.ts       # Authentification
│   ├── useHousehold.ts  # Gestion des foyers
│   ├── useMembership.ts # Gestion des membres
│   ├── useContract.ts   # Gestion des contrats
│   ├── useRules.ts      # Gestion des règles
│   ├── usePoints.ts     # Gestion des points
│   ├── useRewards.ts    # Gestion des récompenses
│   └── useValidation.ts # Gestion des validations
│
├── stores/              # Stores Pinia
│   ├── authStore.ts     # État de l'authentification
│   ├── householdStore.ts # État des foyers
│   ├── contractStore.ts # État des contrats
│   └── pointsStore.ts   # État des points
│
├── types/               # Types TypeScript
│   ├── user.ts
│   ├── household.ts
│   ├── membership.ts
│   ├── contract.ts
│   ├── rule.ts
│   ├── pointEvent.ts
│   ├── reward.ts
│   └── invitation.ts
│
├── lib/
│   └── firebase/
│       ├── client.ts    # Initialisation Firebase
│       ├── auth.ts      # Helpers Auth
│       └── firestore.ts # Helpers Firestore
│
├── utils/
│   ├── points.ts        # Calculs de points
│   ├── validation.ts    # Logique de validation
│   └── format.ts        # Formatage (dates, nombres)
│
└── middleware/
    ├── auth.ts          # Redirection si non connecté
    └── household.ts     # Vérification sélection foyer
```

## 🔄 Flux de données

### Authentification
```
User → Login → Firebase Auth → User Record → Redirect to Dashboard
```

### Création de foyer
```
User → Create Household → Firestore (households) → Create Membership (admin) → Redirect
```

### Ajout de points
```
User → Select Rule → Add Points → Firestore (pointEvents) → Update Member Points → UI Update
```

### Validation parent
```
Child → Add Points (pending) → Parent Validates → Firestore (validations) → Points Confirmed
```

## 🏛 Principes d'architecture

### 1. Multi-tenant
Toutes les données sont organisées par `householdId`. Les requêtes Firestore filtrent toujours par foyer.

### 2. Logique métier dans les composables
Les composants Vue ne contiennent que de la logique de présentation. La logique métier est dans les composables et stores.

### 3. Firebase SDK v9 (modular)
Utilisation de l'API modulaire Firebase v9+ :
```typescript
import { collection, query, where, getDocs } from 'firebase/firestore'
```

### 4. Émulateurs en développement
Tout le développement utilise Firebase Emulator Suite. Pas de connexion à la production.

### 5. TypeScript strict
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

## 🔐 Sécurité

### Firestore Security Rules
- Lecture : membre du foyer uniquement
- Écriture : selon le rôle (admin, parent, enfant)
- Validation : règles côté serveur pour les points

### Rôles
- **admin** : gère les membres, le contrat, les règles
- **parent** : valide les points, gère les récompenses
- **child** : ajoute des points (en attente de validation), voit son historique
- **viewer** : voit le tableau de bord (grands-parents)
