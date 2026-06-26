# Guide d'installation pour débutants

Bienvenue dans **FamilyXP / FamQuest** ! Ce guide va t'accompagner pas à pas pour installer et lancer l'application sur ton ordinateur.

---

## 📋 Prérequis

Avant de commencer, tu dois installer deux choses sur ton ordinateur :

### 1. Node.js (version 20 ou plus)

Node.js permet d'exécuter du code JavaScript en dehors du navigateur.

**Téléchargement :**
1. Va sur https://nodejs.org
2. Télécharge la version **LTS** (recommandée)
3. Lance l'installateur et suis les instructions
4. Redémarre ton terminal si nécessaire

**Vérification :**
Ouvre un terminal et tape :
```bash
node --version
# Doit afficher : v20.x.x ou plus
npm --version
# Doit afficher : 10.x.x ou plus
```

### 2. Git

Git permet de télécharger et gérer le code source.

**Téléchargement :**
1. Va sur https://git-scm.com/downloads
2. Télécharge la version pour macOS
3. Lance l'installateur et suis les instructions

**Vérification :**
```bash
git --version
# Doit afficher : git version 2.x.x
```

### 3. Compte GitHub (optionnel pour lire seulement)

Si tu veux contribuer au code, crée un compte sur https://github.com

---

## 🚀 Installation étape par étape

### Étape 1 : Cloner le projet

Ouvre un **terminal** (Terminal.app sur macOS) et tape :

```bash
# Va dans le dossier où tu veux installer le projet
cd ~/Documents

# Télécharge le projet
git clone https://github.com/ailidmx/familyxp.git

# Entre dans le dossier du projet
cd familyxp
```

### Étape 2 : Installer les dépendances

```bash
npm install
```

Cette commande télécharge toutes les bibliothèques nécessaires au projet.  
Cela peut prendre 1 à 2 minutes la première fois.

### Étape 3 : Copier le fichier d'environnement

```bash
# Copie le fichier d'exemple en fichier de configuration local
cp .env.example .env.local
```

Le fichier `.env.local` contient les clés de configuration pour Firebase.  
En local, on utilise les **émulateurs Firebase** (pas besoin de projet réel).

### Étape 4 : Installer Firebase CLI (pour les émulateurs)

```bash
npm install -g firebase-tools
```

### Étape 5 : Lancer les émulateurs Firebase

Dans un **premier terminal**, lance :

```bash
npm run emulators
```

Tu devrais voir quelque chose comme :
```
┌──────────────────────────────────────────────────┐
│ ✔  All emulators ready! It is now safe to connect.│
│    UI: http://localhost:4000                      │
│    Auth: http://localhost:9099                    │
│    Firestore: http://localhost:8080               │
│    Storage: http://localhost:9199                 │
└──────────────────────────────────────────────────┘
```

Laisse ce terminal ouvert.

### Étape 6 : Lancer l'application

Dans un **deuxième terminal**, tape :

```bash
cd ~/Documents/familyxp
npm run dev:local
```

L'application va compiler et s'ouvrir dans ton navigateur à l'adresse :
**http://localhost:3000**

### Étape 7 : Créer un compte de test

1. Va sur http://localhost:3000/register
2. Crée un compte avec un email et un mot de passe
3. Tu peux utiliser n'importe quel email (ex: `test@test.com`)
4. Le mot de passe doit faire au moins 6 caractères

---

## 🎯 Résumé des commandes

| Commande | Description |
|----------|-------------|
| `npm run dev:local` | Lance l'app avec les émulateurs locaux |
| `npm run dev:dev` | Lance l'app connectée au projet Firebase DEV |
| `npm run dev:uat` | Lance l'app connectée au projet Firebase UAT |
| `npm run dev:prod` | Lance l'app connectée au projet Firebase PROD |
| `npm run emulators` | Lance les émulateurs Firebase |
| `npm run test` | Lance les tests unitaires |
| `npm run lint` | Vérifie le style du code |
| `npm run build` | Compile l'application pour la production |

---

## 🔧 Dépannage

### Erreur : `command not found: npm`
→ Node.js n'est pas installé correctement. Réinstalle Node.js.

### Erreur : `Could not load @pinia/nuxt`
→ Lance `npm install` à nouveau.

### Erreur : `Port 3000 already in use`
→ Un autre programme utilise le port 3000. Modifie le port avec :
```bash
npx nuxi dev --port 3001
```

### Erreur : `Firebase emulators not running`
→ Assure-toi que `npm run emulators` tourne dans un autre terminal.

### L'application ne se charge pas
1. Vérifie que les émulateurs tournent (Étape 5)
2. Vérifie que l'app tourne (Étape 6)
3. Ouvre http://localhost:3000 dans ton navigateur

---

## 📁 Structure du projet

```
familyxp/
├── app/
│   ├── components/     # Composants Vue réutilisables
│   ├── pages/          # Pages de l'application
│   ├── layouts/        # Layouts (auth, default)
│   ├── stores/         # Stores Pinia (état global)
│   ├── types/          # Types TypeScript
│   ├── lib/firebase/   # Configuration Firebase
│   └── utils/          # Fonctions utilitaires
├── docs/               # Documentation
├── onboarding/         # Guides d'installation
├── scripts/            # Scripts (seed, etc.)
├── .env.local          # Configuration locale
├── .env.dev            # Configuration DEV
├── .env.uat            # Configuration UAT
├── .env.prod           # Configuration PROD
└── nuxt.config.ts      # Configuration Nuxt
```

---

## 📚 Prochaines étapes

- Lis le fichier `README.md` pour une vue d'ensemble du projet
- Consulte `docs/ARCHITECTURE.md` pour comprendre l'architecture
- Explore `docs/DATA_MODEL.md` pour le modèle de données
- Regarde `docs/BUSINESS_RULES.md` pour les règles métier

---

## 💬 Besoin d'aide ?

- Ouvre une **issue** sur GitHub : https://github.com/ailidmx/familyxp/issues
- Consulte le fichier `TROUBLESHOOTING.md` pour les erreurs fréquentes
- Demande à un membre de l'équipe
