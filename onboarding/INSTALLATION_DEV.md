# Guide d'Installation pour Développeurs — FamilyXP

## 📋 Prérequis

- **Node.js** v20+ (recommandé : v20 LTS)
- **npm** v10+
- **Git** v2+
- **Firebase CLI** (dernière version)
- **Compte GitHub**

## 🚀 Installation rapide

```bash
# Cloner
git clone https://github.com/casabert/familyxp.git
cd familyxp

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env

# Configurer Firebase
firebase login
firebase init

# Lancer les émulateurs (terminal 1)
npm run emulators

# Lancer l'application (terminal 2)
npm run dev
```

## 🔧 Configuration détaillée

### Firebase

1. Créer un projet Firebase sur [console.firebase.google.com](https://console.firebase.google.com)
2. Activer **Authentication** (Email/Password)
3. Activer **Firestore Database** (mode test pour commencer)
4. Activer **Hosting**
5. Récupérer les clés dans Project Settings > General > Your apps > Web app

### Variables d'environnement

```bash
# .env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_USE_FIREBASE_EMULATORS=true
```

### Firebase Emulator Suite

Les émulateurs permettent de développer localement sans affecter la production.

```bash
# Lancer tous les émulateurs
npm run emulators

# UI des émulateurs accessible sur http://localhost:4000
```

**Émulateurs disponibles :**
- **Auth** : `localhost:9099`
- **Firestore** : `localhost:8080`
- **Storage** : `localhost:9199`
- **Hosting** : `localhost:5000`
- **UI** : `localhost:4000`

## 📦 Scripts disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Preview du build
npm run test         # Tests unitaires
npm run test:coverage # Tests avec couverture
npm run test:e2e     # Tests E2E
npm run lint         # Vérification ESLint
npm run lint:fix     # Correction automatique ESLint
npm run format       # Formatage Prettier
npm run typecheck    # Vérification TypeScript
npm run emulators    # Lancement des émulateurs Firebase
```

## 🧪 Seed data

Pour charger les données de démonstration :

```bash
npm run seed
```

Cette commande charge les données familiales de démonstration dans les émulateurs :
- 5 foyers (Papa, Maman, Steph & Wendy, Docdadi & Joséphine, Kiki & Jean-Pierre)
- Membres associés
- Contrats exemples
- Règles bonus/malus
- Récompenses

## 🐳 Docker (optionnel)

Si tu préfères utiliser Docker pour les émulateurs Firebase :

```bash
docker-compose up -d
```

## 📝 VS Code Extensions recommandées

- **Vue Language Features** (Volar)
- **TypeScript Vue Plugin**
- **Tailwind CSS IntelliSense**
- **ESLint**
- **Prettier**
- **Firebase Explorer**
- **GitLens**

## 🔍 Dépannage

### Problème : Les émulateurs ne démarrent pas

```bash
# Vérifier que Java est installé (requis pour les émulateurs)
java --version

# Réinitialiser les émulateurs
firebase emulators:start --only firestore --clear-data
```

### Problème : Erreur de connexion Firebase

```bash
# Vérifier la configuration
cat .env

# Vérifier que les émulateurs tournent
curl http://localhost:4000
```

### Problème : Tests qui échouent

```bash
# Vérifier que les émulateurs tournent
# Vérifier les variables d'environnement
# Vider le cache
npm run emulators:clear
```
