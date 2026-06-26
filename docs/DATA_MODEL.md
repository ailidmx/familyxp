# Modèle de Données — FamilyXP / FamQuest

## 📐 Vue d'ensemble

```
User → Membership → Household → Contract → Rules → PointEvents → Rewards
```

## 🗄 Collections Firestore

### `users`

Stocke les informations de base de chaque utilisateur.

```typescript
interface User {
  id: string                    // Firebase Auth UID
  displayName: string           // Nom affiché
  email: string                 // Email
  photoURL?: string             // Photo de profil
  createdAt: Timestamp          // Date de création
  updatedAt: Timestamp          // Dernière modification
}
```

### `households`

Représente un foyer (famille, groupe).

```typescript
interface Household {
  id: string                    // ID Firestore
  name: string                  // Nom du foyer (ex: "Foyer Papa")
  description?: string          // Description optionnelle
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string             // User ID du créateur
  isPremium: boolean            // true si abonnement premium
  settings: {
    currency: string            // Nom des points (ex: "XP", "Étoiles")
    maxPointsPerDay?: number    // Limite quotidienne de points
    requireValidation: boolean  // Validation parent requise
  }
}
```

### `memberships`

Lie un utilisateur à un foyer avec un rôle.

```typescript
interface Membership {
  id: string
  userId: string                // Référence à users
  householdId: string           // Référence à households
  role: 'admin' | 'parent' | 'child' | 'viewer'
  displayName?: string          // Surnom dans ce foyer
  avatar?: string               // Avatar spécifique au foyer
  points: number                // Points cumulés dans ce foyer
  joinedAt: Timestamp
  isActive: boolean             // Pour gérer les départs
}
```

**Règle importante :** Un utilisateur peut avoir plusieurs memberships (un par foyer).

### `contracts`

Contrat familial négocié pour un foyer.

```typescript
interface Contract {
  id: string
  householdId: string           // Référence à households
  name: string                  // Nom du contrat (ex: "Contrat été 2026")
  description?: string
  status: 'draft' | 'active' | 'paused' | 'archived'
  startDate: Timestamp
  endDate?: Timestamp           // Null si contrat permanent
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string             // User ID
  validatedBy: string[]         // User IDs des validateurs
  rules: Rule[]                 // Règles du contrat (dénormalisées)
  rewards: Reward[]             // Récompenses (dénormalisées)
}
```

### `rules` (sous-collection de contracts)

Règles bonus ou malus.

```typescript
interface Rule {
  id: string
  contractId: string
  type: 'bonus' | 'malus'
  category: 'chores' | 'school' | 'behavior' | 'health' | 'custom'
  name: string                  // Ex: "Faire ses devoirs"
  description?: string
  points: number                // Points gagnés (bonus) ou perdus (malus)
  icon?: string                 // Emoji ou icône
  frequency: 'daily' | 'weekly' | 'monthly' | 'once'
  maxPerDay?: number            // Limite d'application par jour
  requiresValidation: boolean   // Validation parent requise
  isActive: boolean
  createdAt: Timestamp
}
```

### `pointEvents`

Historique des ajouts/retraits de points.

```typescript
interface PointEvent {
  id: string
  householdId: string
  contractId: string
  ruleId?: string               // Référence à la règle (si applicable)
  userId: string                // Qui a reçu/perdu les points
  createdBy: string             // Qui a ajouté les points
  points: number                // Positif (bonus) ou négatif (malus)
  type: 'bonus' | 'malus' | 'manual' | 'reward'
  description: string
  status: 'pending' | 'approved' | 'rejected'
  validatedBy?: string          // User ID du validateur
  validatedAt?: Timestamp
  createdAt: Timestamp
}
```

### `rewards` (sous-collection de contracts)

Récompenses disponibles dans le contrat.

```typescript
interface Reward {
  id: string
  contractId: string
  name: string                  // Ex: "1h d'écran supplémentaire"
  description?: string
  pointsCost: number            // Coût en points
  icon?: string
  category: 'screen_time' | 'activity' | 'treat' | 'money' | 'custom'
  stock?: number                // Null si illimité
  isActive: boolean
  createdAt: Timestamp
}
```

### `rewardClaims`

Demandes de récompense par un membre.

```typescript
interface RewardClaim {
  id: string
  householdId: string
  rewardId: string
  userId: string                // Qui demande
  status: 'pending' | 'approved' | 'rejected' | 'redeemed'
  pointsAtClaim: number         // Points du membre au moment de la demande
  approvedBy?: string           // User ID du validateur
  approvedAt?: Timestamp
  rejectedReason?: string
  redeemedAt?: Timestamp
  createdAt: Timestamp
}
```

### `validations`

Journal des validations parentales.

```typescript
interface Validation {
  id: string
  householdId: string
  targetId: string              // ID de l'élément validé (pointEvent, rewardClaim)
  targetType: 'point_event' | 'reward_claim'
  validatedBy: string           // User ID du validateur
  status: 'approved' | 'rejected'
  comment?: string
  createdAt: Timestamp
}
```

### `invitations`

Invitations en attente pour rejoindre un foyer.

```typescript
interface Invitation {
  id: string
  householdId: string
  invitedEmail: string          // Email de la personne invitée
  invitedBy: string             // User ID de l'inviteur
  role: 'parent' | 'child' | 'viewer'
  status: 'pending' | 'accepted' | 'expired' | 'cancelled'
  expiresAt: Timestamp
  createdAt: Timestamp
}
```

## 🔑 Relations clés

```
User (1) ──< Membership >── (1) Household
User (1) ──< PointEvent
User (1) ──< RewardClaim
User (1) ──< Validation

Household (1) ──< Contract
Household (1) ──< Membership
Household (1) ──< PointEvent
Household (1) ──< Invitation

Contract (1) ──< Rule
Contract (1) ──< Reward
```

## 📊 Indexes Firestore requis

```javascript
// Collection: memberships
// Index: userId + isActive
memberships
  .where('userId', '==', userId)
  .where('isActive', '==', true)

// Collection: pointEvents
// Index: householdId + createdAt (desc)
pointEvents
  .where('householdId', '==', householdId)
  .orderBy('createdAt', 'desc')

// Collection: pointEvents
// Index: householdId + userId + createdAt
pointEvents
  .where('householdId', '==', householdId)
  .where('userId', '==', userId)
  .orderBy('createdAt', 'desc')

// Collection: invitations
// Index: invitedEmail + status
invitations
  .where('invitedEmail', '==', email)
  .where('status', '==', 'pending')
```

## 📝 Notes importantes

1. **Dénormalisation :** Les règles et récompenses sont stockées dans le contrat pour éviter les lectures multiples
2. **Points :** Les points sont stockés sur le membership (lecture rapide) ET dans pointEvents (historique)
3. **Multi-foyers :** Un utilisateur a un membership par foyer, avec des points indépendants
4. **Sécurité :** Les règles Firestore vérifient toujours l'appartenance au foyer
