# Guide d'Installation pour Débutants — FamilyXP

Ce guide est conçu pour les personnes qui n'ont jamais fait de développement. Suis les étapes une par une.

## 📋 Prérequis

### 1. Installer Node.js

Node.js est un logiciel qui permet de faire tourner l'application.

1. Va sur [https://nodejs.org](https://nodejs.org)
2. Télécharge la version **LTS** (recommandée)
3. Ouvre le fichier téléchargé et suis les instructions d'installation
4. Laisse tout par défaut, clique "Suivant" jusqu'à la fin

**Vérification :**
- Ouvre un terminal (Cherche "Terminal" dans les applications)
- Tape : `node --version`
- Tu devrais voir quelque chose comme `v20.x.x`

### 2. Installer Git

Git permet de télécharger et gérer le code.

1. Va sur [https://git-scm.com](https://git-scm.com)
2. Télécharge la version pour macOS
3. Ouvre le fichier et suis les instructions
4. Laisse tout par défaut

**Vérification :**
- Dans le terminal, tape : `git --version`
- Tu devrais voir quelque chose comme `git version 2.x.x`

### 3. Créer un compte GitHub

GitHub est le site où est stocké le code.

1. Va sur [https://github.com](https://github.com)
2. Clique sur "Sign up"
3. Choisis un nom d'utilisateur
4. Entre ton email
5. Choisis un mot de passe
6. Vérifie ton email

### 4. Installer Firebase CLI

Firebase CLI permet de lancer les émulateurs locaux.

```bash
npm install -g firebase-tools
```

**Vérification :**
```bash
firebase --version
```

## 🚀 Installation du projet

### 1. Cloner le repository

```bash
# Va dans le dossier où tu veux mettre le projet
cd ~/Documents

# Télécharge le code
git clone https://github.com/casabert/familyxp.git

# Entre dans le dossier
cd familyxp
```

### 2. Installer les dépendances

```bash
npm install
```

Cette commande télécharge toutes les bibliothèques nécessaires. Ça peut prendre quelques minutes.

### 3. Configurer les variables d'environnement

```bash
# Copie le fichier d'exemple
cp .env.example .env
```

Ouvre le fichier `.env` avec un éditeur de texte (Bloc-Notes, TextEdit, VS Code).

Tu dois remplir les valeurs Firebase. Pour les obtenir :

1. Va sur [https://console.firebase.google.com](https://console.firebase.google.com)
2. Crée un projet (ou utilise un existant)
3. Va dans "Project Settings" > "General" > "Your apps"
4. Clique sur "Add app" > "Web"
5. Copie les valeurs dans ton fichier `.env`

### 4. Lancer les émulateurs Firebase

```bash
npm run emulators
```

Cette commande lance des versions locales de Firebase. Laisse cette fenêtre ouverte.

### 5. Lancer l'application

Ouvre un **nouveau** terminal et tape :

```bash
npm run dev
```

### 6. Ouvrir l'application

1. Ouvre ton navigateur (Chrome, Safari, Firefox)
2. Va à l'adresse : [http://localhost:3000](http://localhost:3000)
3. Tu devrais voir l'application !

## 🐛 Résolution des erreurs fréquentes

### "npm install" échoue

**Solution :** Essaie :
```bash
npm cache clean --force
npm install
```

### "Port already in use"

**Solution :** Un autre programme utilise le port. Essaie :
```bash
# Trouve ce qui utilise le port
lsof -i :3000

# Tue le processus (remplace PID par le numéro)
kill -9 PID
```

### "Firebase command not found"

**Solution :** Firebase CLI n'est pas installé :
```bash
npm install -g firebase-tools
```

### "Module not found"

**Solution :** Les dépendances ne sont pas installées :
```bash
npm install
```

### Erreur de connexion Firebase

**Solution :** Vérifie que :
1. Les émulateurs tournent (terminal avec `npm run emulators`)
2. Le fichier `.env` est correctement configuré
3. `VITE_USE_FIREBASE_EMULATORS=true` dans `.env`

## 📱 Tester sur mobile

1. Assure-toi que ton téléphone est sur le même réseau WiFi que ton ordinateur
2. Trouve l'adresse IP de ton ordinateur :
   ```bash
   ipconfig getifaddr en0
   ```
3. Sur ton téléphone, va à l'adresse : `http://[IP]:3000`
   (remplace [IP] par l'adresse trouvée)

## 💡 Prochaines étapes

1. Explore l'application
2. Crée un compte
3. Crée un foyer
4. Ajoute des membres
5. Crée un contrat avec des règles
6. Ajoute des points

## 🆘 Besoin d'aide ?

- Regarde la documentation dans le dossier `docs/`
- Vérifie le fichier `TROUBLESHOOTING.md`
- Demande à David ou Docdadi
