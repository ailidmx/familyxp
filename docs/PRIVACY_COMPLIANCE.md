# Conformité et Vie Privée — FamilyXP

> **Document stratégique** : législations applicables, gestion du consentement, protection des mineurs, et architecture privacy-by-design.

---

## 1. Contexte géographique et juridique

FamilyXP est utilisé par des familles situées dans plusieurs zones géographiques. Les données personnelles — y compris celles de **mineurs** — sont traitées. Il est impératif de respecter les législations en vigueur dans chaque zone.

### 1.1 Législations applicables

| Zone | Législation | Particularités |
|------|-------------|----------------|
| 🌍 **Union Européenne (France)** | **RGPD** (Règlement Général sur la Protection des Données) | Consentement explicite requis. Données des mineurs : consentement parental obligatoire avant 15-16 ans. Droit à l'effacement, portabilité. |
| 🇲🇽 **Mexique** | **LFPDPPP** (Ley Federal de Protección de Datos Personales en Posesión de los Particulares) | Avis de privacité obligatoire. Consentement pour données sensibles. Pas d'âge fixe pour les mineurs, mais recommandation de consentement parental. |
| 🇺🇸 **États-Unis** (si applicable) | **COPPA** (Children's Online Privacy Protection Act) | Protection des enfants de moins de 13 ans. Consentement parental vérifiable obligatoire. |
| 🇨🇦 **Canada** (si applicable) | **PIPEDA** / LPRPDE | Consentement significatif. Données des mineurs : attention renforcée. |
| 🌐 **International** | Recommandations **OECD Privacy Guidelines** | Base minimale : consentement, transparence, sécurité, limitation de la collecte. |

### 1.2 Principe retenu pour FamilyXP

> **Le cadre le plus strict s'applique à tous les utilisateurs**, quel que soit leur pays.

Nous appliquons par défaut le **RGPD** comme standard minimum, car c'est le plus protecteur, notamment pour les mineurs.

---

## 2. Gestion du consentement

### 2.1 Architecture consent (OneTrust-like)

FamilyXP intègre une couche de consentement obligatoire avant toute collecte de données.

**Composants :**

```
app/
  components/
    consent/
      ConsentBanner.vue        # Bannière de consentement initial
      ConsentModal.vue         # Modal détaillé de gestion des préférences
      ConsentManager.vue       # Interface de gestion du consentement (profil)
  composables/
    useConsent.ts              # Logique de consentement (store + Firestore)
  stores/
    consentStore.ts            # Pinia store pour l'état du consentement
  types/
    consent.ts                 # Types TypeScript pour le consentement
```

### 2.2 Types de consentement

```typescript
interface ConsentPreferences {
  userId: string
  // Consentements obligatoires
  necessary: true // Toujours true (fonctionnement de base)
  
  // Consentements optionnels
  analytics: boolean       // Google Analytics, Firebase Analytics
  marketing: boolean       // Emails, notifications promotionnelles
  profiling: boolean       // Personnalisation avancée (IA, recommandations)
  
  // Consentements spécifiques mineurs
  parentalConsent: boolean // Consentement parental pour les mineurs
  parentId?: string        // UID du parent ayant donné le consentement
  
  // Métadonnées
  version: number          // Version de la politique de confidentialité
  acceptedAt: Timestamp    // Date d'acceptation
  updatedAt: Timestamp     // Dernière modification
  ipAddress?: string       // Adresse IP au moment du consentement (hashée)
  userAgent?: string       // User-Agent au moment du consentement
}
```

### 2.3 Parcours utilisateur

```
Inscription
  │
  ├── Adulte (> 15 ans)
  │     └── ConsentBanner → choix → enregistré dans Firestore
  │
  └── Mineur (< 15 ans)
        ├── Étape 1 : Création du compte (email + mot de passe)
        ├── Étape 2 : Blocage immédiat (pas d'accès sans consentement parental)
        ├── Étape 3 : Envoi d'un email au parent pour autorisation
        │     ├── Lien magique ou code à 6 chiffres
        │     └── Le parent doit être déjà inscrit OU créer un compte
        └── Étape 4 : Une fois le consentement donné → accès débloqué
```

### 2.4 Stockage du consentement

- **Firestore** : collection `consents` (un document par utilisateur)
- **LocalStorage** : cache pour éviter de re-demander à chaque visite
- **Règle Firestore** : seul l'utilisateur concerné peut lire/écrire son consentement

```
/consents/{userId}
  - preferences: ConsentPreferences
  - history: ConsentHistory[]  # Historique des modifications
```

---

## 3. Protection des mineurs

### 3.1 Principes

1. **Âge minimum** : 13 ans (COPPA) / 15 ans (RGPD France)
2. **Consentement parental obligatoire** en dessous de 15 ans
3. **Pas de collecte de données inutiles** : minimisation
4. **Pas de partage public** des données des mineurs (classements, badges, etc.)
5. **Droit à l'effacement** : un parent peut demander la suppression totale du compte de son enfant

### 3.2 Données sensibles à ne JAMAIS collecter

- Géolocalisation précise
- Numéros de téléphone (sauf si nécessaire pour le compte parent)
- Photos non consenties explicitement
- Informations bancaires (traitées par Stripe, pas par nous)
- Contenu des messages privés (si fonctionnalité de chat un jour)

### 3.3 Vérification de l'âge

Mécanisme simple (pas de vérification d'identité forte au MVP) :

1. L'utilisateur déclare son âge à l'inscription
2. Si < 15 ans → workflow consentement parental
3. Le parent reçoit un email avec un lien de validation
4. Tant que le parent n'a pas validé → accès restreint (profil créé mais pas de participation)

---

## 4. Architecture privacy-by-design

### 4.1 Minimisation des données

| Donnée | Collectée ? | Justification |
|--------|-------------|---------------|
| Nom d'affichage | Oui | Identification dans le foyer |
| Email | Oui | Authentification, notifications |
| Âge / date de naissance | Oui (déclaratif) | Vérification âge minimum |
| Photo de profil | Optionnel | Personnalisation |
| Points, règles, contrats | Oui | Fonctionnement de l'app |
| Historique des actions | Oui | Suivi des points |
| Adresse IP | Temporaire | Logs de sécurité (7 jours max) |
| Géolocalisation | Non | Pas nécessaire |
| Numéro de téléphone | Non | Pas nécessaire |

### 4.2 Chiffrement

- **En transit** : HTTPS (TLS 1.3) — géré par Firebase Hosting
- **Au repos** : chiffrement côté Firebase (AES-256)
- **Mots de passe** : hashés par Firebase Auth (bcrypt)
- **Données sensibles** : envisager chiffrement côté client pour les données des mineurs

### 4.3 Rétention des données

| Type de donnée | Durée de conservation |
|----------------|----------------------|
| Comptes actifs | Durée de vie du compte |
| Historique des points | Durée de vie du compte |
| Logs de connexion | 90 jours |
| Consentements | Jusqu'à suppression du compte |
| Données de mineurs | Supprimées à la majorité ou sur demande parentale |

### 4.4 Droit à l'effacement (RGPD Art. 17)

Fonctionnalité à implémenter :

```
Settings → Mon compte → Supprimer mon compte
  ├── Confirmation par email
  ├── Délai de grâce de 7 jours (réversible)
  └── Suppression définitive :
        ├── Firestore : suppression du document user + memberships + consents
        ├── Firebase Auth : désactivation + suppression après 30 jours
        ├── Storage : suppression des photos/avatars
        └── Confirmation par email
```

---

## 5. Avis de confidentialité

### 5.1 Pour le Mexique (LFPDPPP)

Un **Avis de Privacidad** doit être affiché :

- Au moment de l'inscription
- Accessible depuis le footer de l'app
- En espagnol

### 5.2 Pour la France / UE (RGPD)

Une **Politique de Confidentialité** doit être affichée :

- Au moment de l'inscription
- Accessible depuis le footer
- En français
- Mentionner le DPO (Data Protection Officer)

### 5.3 Contenu minimum

- Quelles données sont collectées
- Pourquoi (finalité)
- Avec qui elles sont partagées (Firebase/Google, Stripe)
- Durée de conservation
- Droits des utilisateurs (accès, rectification, effacement, portabilité)
- Coordonnées du DPO
- Procédure de réclamation (CNIL, INAI)

---

## 6. Recommandations techniques

### 6.1 MVP immédiat

- [ ] Bannière de consentement (cookies / analytics)
- [ ] Workflow consentement parental pour les mineurs
- [ ] Avis de privacidad (ES) + Politique de confidentialité (FR, EN)
- [ ] Collection Firestore `consents` avec règles de sécurité
- [ ] Bouton "Supprimer mon compte" avec confirmation

### 6.2 Post-MVP

- [ ] Export des données (RGPD Art. 20 — portabilité)
- [ ] Journal d'accès (qui a consulté quoi)
- [ ] Chiffrement côté client pour données sensibles
- [ ] Audit annuel de conformité
- [ ] DPO nommé (interne ou externalisé)

### 6.3 Outils recommandés

| Outil | Usage |
|-------|-------|
| **Firebase Auth** | Gestion des identités (déjà dans la stack) |
| **Firestore Rules** | Sécuriser l'accès aux données par rôle |
| **Clerk** ou **Auth0** (futur) | Si besoin de gestion fine des consentements |
| **Cookiebot** / **Osano** | Gestion des cookies (si analytics) |
| **Iubenda** | Génération des politiques de confidentialité |

---

## 7. Checklist de conformité

### Pré-lancement

- [ ] Politique de confidentialité rédigée (FR, ES, EN)
- [ ] Avis de privacidad (ES) pour le Mexique
- [ ] Bannière de consentement implémentée
- [ ] Workflow consentement parental pour les -15 ans
- [ ] Collection `consents` dans Firestore
- [ ] Règles Firestore limitant l'accès aux données
- [ ] Bouton de suppression de compte
- [ ] Contact DPO défini

### Trimestriel

- [ ] Revue des accès aux données
- [ ] Mise à jour des politiques si changement de fonctionnalités
- [ ] Vérification des durées de rétention

### Annuel

- [ ] Audit de conformité complet
- [ ] Mise à jour des consentements (si changement majeur)
- [ ] Revue des législations applicables

---

## 8. Références

- **RGPD** : https://eur-lex.europa.eu/eli/reg/2016/679/oj
- **LFPDPPP (Mexique)** : https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf
- **COPPA (États-Unis)** : https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa
- **CNIL (France)** : https://www.cnil.fr
- **INAI (Mexique)** : https://home.inai.org.mx
- **Firebase Privacy & Security** : https://firebase.google.com/support/privacy
