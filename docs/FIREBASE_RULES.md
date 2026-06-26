# Règles Firebase — FamilyXP / FamQuest

## 🔥 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ==========================================
    // Helper functions
    // ==========================================

    function isAuthenticated() {
      return request.auth != null;
    }

    function getUserRole(householdId) {
      return get(/databases/$(database)/documents/memberships/$(request.auth.uid)_$(householdId)).data.role;
    }

    function isMemberOf(householdId) {
      return exists(/databases/$(database)/documents/memberships/$(request.auth.uid)_$(householdId));
    }

    function hasRole(householdId, role) {
      return getUserRole(householdId) == role;
    }

    function hasMinRole(householdId, minRole) {
      let roles = ['viewer', 'child', 'parent', 'admin'];
      let userRole = getUserRole(householdId);
      let minIndex = roles.indexOf(minRole);
      let userIndex = roles.indexOf(userRole);
      return userIndex >= minIndex;
    }

    // ==========================================
    // Users collection
    // ==========================================

    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isAuthenticated() && request.auth.uid == userId;
      allow delete: if isAuthenticated() && request.auth.uid == userId;
    }

    // ==========================================
    // Households collection
    // ==========================================

    match /households/{householdId} {
      allow read: if isAuthenticated() && isMemberOf(householdId);
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && hasMinRole(householdId, 'admin');
      allow delete: if isAuthenticated() && hasRole(householdId, 'admin');
    }

    // ==========================================
    // Memberships collection
    // ==========================================

    match /memberships/{membershipId} {
      allow read: if isAuthenticated() && (
        resource.data.userId == request.auth.uid ||
        isMemberOf(resource.data.householdId)
      );
      allow create: if isAuthenticated() && (
        request.resource.data.userId == request.auth.uid ||
        hasMinRole(request.resource.data.householdId, 'admin')
      );
      allow update: if isAuthenticated() && (
        resource.data.userId == request.auth.uid ||
        hasMinRole(resource.data.householdId, 'admin')
      );
      allow delete: if isAuthenticated() && hasMinRole(resource.data.householdId, 'admin');
    }

    // ==========================================
    // Contracts collection
    // ==========================================

    match /contracts/{contractId} {
      allow read: if isAuthenticated() && isMemberOf(resource.data.householdId);
      allow create: if isAuthenticated() && hasMinRole(request.resource.data.householdId, 'admin');
      allow update: if isAuthenticated() && hasMinRole(resource.data.householdId, 'parent');
      allow delete: if isAuthenticated() && hasMinRole(resource.data.householdId, 'admin');
    }

    // ==========================================
    // Rules (subcollection of contracts)
    // ==========================================

    match /contracts/{contractId}/rules/{ruleId} {
      allow read: if isAuthenticated() && isMemberOf(get(/databases/$(database)/documents/contracts/$(contractId)).data.householdId);
      allow create: if isAuthenticated() && hasMinRole(get(/databases/$(database)/documents/contracts/$(contractId)).data.householdId, 'parent');
      allow update: if isAuthenticated() && hasMinRole(get(/databases/$(database)/documents/contracts/$(contractId)).data.householdId, 'parent');
      allow delete: if isAuthenticated() && hasMinRole(get(/databases/$(database)/documents/contracts/$(contractId)).data.householdId, 'admin');
    }

    // ==========================================
    // PointEvents collection
    // ==========================================

    match /pointEvents/{eventId} {
      allow read: if isAuthenticated() && isMemberOf(resource.data.householdId);
      allow create: if isAuthenticated() && isMemberOf(request.resource.data.householdId);
      allow update: if isAuthenticated() && hasMinRole(resource.data.householdId, 'parent');
      allow delete: if isAuthenticated() && hasMinRole(resource.data.householdId, 'admin');
    }

    // ==========================================
    // Rewards (subcollection of contracts)
    // ==========================================

    match /contracts/{contractId}/rewards/{rewardId} {
      allow read: if isAuthenticated() && isMemberOf(get(/databases/$(database)/documents/contracts/$(contractId)).data.householdId);
      allow create: if isAuthenticated() && hasMinRole(get(/databases/$(database)/documents/contracts/$(contractId)).data.householdId, 'parent');
      allow update: if isAuthenticated() && hasMinRole(get(/databases/$(database)/documents/contracts/$(contractId)).data.householdId, 'parent');
      allow delete: if isAuthenticated() && hasMinRole(get(/databases/$(database)/documents/contracts/$(contractId)).data.householdId, 'admin');
    }

    // ==========================================
    // RewardClaims collection
    // ==========================================

    match /rewardClaims/{claimId} {
      allow read: if isAuthenticated() && isMemberOf(resource.data.householdId);
      allow create: if isAuthenticated() && isMemberOf(request.resource.data.householdId);
      allow update: if isAuthenticated() && hasMinRole(resource.data.householdId, 'parent');
      allow delete: if isAuthenticated() && hasMinRole(resource.data.householdId, 'admin');
    }

    // ==========================================
    // Validations collection
    // ==========================================

    match /validations/{validationId} {
      allow read: if isAuthenticated() && isMemberOf(resource.data.householdId);
      allow create: if isAuthenticated() && hasMinRole(request.resource.data.householdId, 'parent');
      allow update: if isAuthenticated() && hasMinRole(resource.data.householdId, 'admin');
      allow delete: if isAuthenticated() && hasMinRole(resource.data.householdId, 'admin');
    }

    // ==========================================
    // Invitations collection
    // ==========================================

    match /invitations/{invitationId} {
      allow read: if isAuthenticated() && (
        resource.data.invitedEmail == request.auth.token.email ||
        isMemberOf(resource.data.householdId)
      );
      allow create: if isAuthenticated() && hasMinRole(request.resource.data.householdId, 'admin');
      allow update: if isAuthenticated() && (
        resource.data.invitedEmail == request.auth.token.email ||
        hasMinRole(resource.data.householdId, 'admin')
      );
      allow delete: if isAuthenticated() && hasMinRole(resource.data.householdId, 'admin');
    }
  }
}
```

## 🔐 Firebase Auth Configuration

### Sign-in methods
- **Email/Password** : Activé
- **Google** : Optionnel (à activer plus tard)
- **Anonymous** : Non (nécessite un compte)

### Email templates
- **Vérification email** : Activée
- **Réinitialisation mot de passe** : Activée
- **Invitation à un foyer** : Personnalisée (via lien)

## 📦 Firebase Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }

    match /households/{householdId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null &&
        firestore.exists(/databases/(default)/documents/memberships/$(request.auth.uid)_$(householdId));
      allow delete: if request.auth != null &&
        get(/databases/(default)/documents/memberships/$(request.auth.uid)_$(householdId)).data.role == 'admin';
    }

    match /proofs/{householdId}/{fileName} {
      allow read: if request.auth != null &&
        firestore.exists(/databases/(default)/documents/memberships/$(request.auth.uid)_$(householdId));
      allow write: if request.auth != null &&
        firestore.exists(/databases/(default)/documents/memberships/$(request.auth.uid)_$(householdId));
      allow delete: if request.auth != null &&
        get(/databases/(default)/documents/memberships/$(request.auth.uid)_$(householdId)).data.role == 'admin';
    }
  }
}
```

## 🔧 Firebase Indexes

```javascript
{
  "indexes": [
    {
      "collectionGroup": "memberships",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "isActive", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "pointEvents",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "householdId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "pointEvents",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "householdId", "order": "ASCENDING" },
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "invitations",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "invitedEmail", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "rewardClaims",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "householdId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```
