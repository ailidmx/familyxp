# Guide d'installation développeur

Guide technique pour configurer les 4 environnements FamilyXP : **local**, **dev**, **uat**, **prod**.

---

## 📋 Prérequis

- Node.js >= 20
- Git
- Compte GitHub avec accès au repo
- Firebase CLI (`npm install -g firebase-tools`)
- Compte Firebase (gratuit)

---

## 🔄 Les 4 environnements

| Environnement | Fichier `.env` | Projet Firebase | URL | Usage |
|--------------|----------------|-----------------|-----|-------|
| **LOCAL** | `.env.local` | Émulateurs | `localhost:3000` | Développement local |
| **DEV** | `.env.dev` | `familyxp-dev` | `familyxp-dev.web.app` | Intégration continue |
| **UAT** | `.env.uat` | `familyxp-uat` | `familyxp-uat.web.app` | Recettage / Tests |
| **PROD** | `.env.prod` | `familyxp-prod` | `familyxp.app` | Production |

---

## 🏗️ Créer les projets Firebase

### 1. Créer 3 projets Firebase (dev, uat, prod)

Va sur https://console.firebase.google.com et crée 3 projets :

1. **familyxp-dev** → environnement de développement
2. **familyxp-uat** → environnement de recettage
3. **familyxp-prod** → environnement de production

### 2. Activer les services pour chaque projet

Pour **chaque projet**, active :

1. **Authentication** → Méthode de connexion : Email/Mot de passe
2. **Cloud Firestore** → Mode test (règles permissives pour commencer)
3. **Storage** (optionnel, pour plus tard)
4. **Hosting** (pour le déploiement)

### 3. Récupérer les clés Firebase

Pour chaque projet :
1. Console Firebase > Paramètres du projet > Général
2. Section "Mes applications" > "Applications Web"
3. Clique sur "Ajouter une application" > "Web"
4. Copie les valeurs de configuration

### 4. Remplir les fichiers `.env`

**`.env.dev`** :
```
NUXT_PUBLIC_FIREBASE_API_KEY=AIzaSy... (clé du projet dev)
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=familyxp-dev.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=familyxp-dev
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=familyxp-dev.appspot.com
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NUXT_PUBLIC_FIREBASE_APP_ID=1:...:web:...
```

**`.env.uat`** : mêmes champs avec les valeurs du projet uat

**`.env.prod`** : mêmes champs avec les valeurs du projet prod

---

## 🚀 Lancer les environnements

### LOCAL (émulateurs)

```bash
# Terminal 1 : lancer les émulateurs
npm run emulators

# Terminal 2 : lancer l'app
npm run dev:local
```

### DEV (projet Firebase réel)

```bash
npm run dev:dev
```

### UAT (projet Firebase réel)

```bash
npm run dev:uat
```

### PROD (projet Firebase réel)

```bash
npm run dev:prod
```

---

## 📦 Déploiement

### Configurer Firebase Hosting

```bash
# Initialiser Firebase dans le projet
firebase init hosting

# Configurer les projets
firebase use --add
# → Sélectionner familyxp-dev comme alias "dev"
# → Sélectionner familyxp-uat comme alias "uat"
# → Sélectionner familyxp-prod comme alias "prod"
```

### Déployer

```bash
# Build pour l'environnement cible
npm run build:dev    # ou build:uat / build:prod

# Déployer sur Firebase Hosting
npm run deploy:dev   # ou deploy:uat / deploy:prod
```

---

## 🔥 Émulateurs Firebase

Les émulateurs permettent de développer sans projet Firebase réel.

### Ports

| Service | Port |
|---------|------|
| Emulator UI | 4000 |
| Auth | 9099 |
| Firestore | 8080 |
| Storage | 9199 |

### Seed data

Pour charger des données de démonstration :

```bash
npm run seed
```

### Exporter les données des émulateurs

Les émulateurs sauvegardent automatiquement les données dans `./firebase-data/` quand on les arrête (Ctrl+C).

---

## 📝 Scripts disponibles

```bash
npm run dev:local     # Développement local (émulateurs)
npm run dev:dev       # Développement sur DEV
npm run dev:uat       # Développement sur UAT
npm run dev:prod      # Développement sur PROD
npm run build:dev     # Build pour DEV
npm run build:uat     # Build pour UAT
npm run build:prod    # Build pour PROD
npm run deploy:dev    # Déploiement DEV
npm run deploy:uat    # Déploiement UAT
npm run deploy:prod   # Déploiement PROD
npm run emulators     # Lancer les émulateurs
npm run seed          # Charger les données de démo
npm run test          # Tests unitaires
npm run lint          # Vérification du code
```

---

## 🔒 Sécurité

### Règles Firestore

Les règles de sécurité Firestore sont dans `firestore.rules`.  
En développement, utilise des règles permissives.  
En production, applique des règles strictes basées sur l'authentification.

### Variables sensibles

- Les fichiers `.env.*` sont dans `.gitignore`
- Ne **jamais** commiter les vraies clés Firebase
- Utilise `.env.example` comme template
- Partage les clés via un canal sécurisé (pas par email)

---

## 🐳 Docker (optionnel)

Si tu préfères utiliser Docker pour les émulateurs :

```bash
docker run -d \
  --name firebase-emulators \
  -p 4000:4000 -p 8080:8080 -p 9099:9099 -p 9199:9199 \
  -v $(pwd)/firebase-data:/firebase/data \
  firebase-emulators
```

---

## ❓ FAQ

### Comment savoir quel environnement est actif ?
Regarde la variable `NUXT_PUBLIC_APP_ENV` dans ton `.env` ou dans la console du navigateur.

### Puis-je utiliser le même projet Firebase pour dev et prod ?
**Non.** Chaque environnement doit avoir son propre projet Firebase pour éviter de mélanger les données.

### Les émulateurs sont-ils obligatoires ?
Non, mais ils sont fortement recommandés pour le développement local. Sans eux, tu utilises le projet Firebase réel.

### Comment réinitialiser les données des émulateurs ?
Supprime le dossier `firebase-data/` et relance les émulateurs.
