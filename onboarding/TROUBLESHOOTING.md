# Guide de Dépannage — FamilyXP

## 🚀 Démarrage

### L'application ne démarre pas

**Symptôme :** `npm run dev` échoue

**Solutions :**
```bash
# 1. Vérifier la version de Node.js
node --version  # Doit être >= 18

# 2. Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install

# 3. Vider le cache Nuxt
rm -rf .nuxt
npm run dev
```

### Port déjà utilisé

**Symptôme :** `Error: listen EADDRINUSE :::3000`

**Solutions :**
```bash
# Trouver le processus
lsof -i :3000

# Le tuer (remplacer PID)
kill -9 PID

# Ou utiliser un autre port
npm run dev -- --port 3001
```

## 🔥 Firebase Emulators

### Les émulateurs ne démarrent pas

**Symptôme :** `firebase emulators:start` échoue

**Solutions :**
```bash
# 1. Vérifier Java (requis)
java --version

# 2. Installer Java si nécessaire
# macOS:
brew install openjdk@17

# 3. Réinitialiser les émulateurs
firebase emulators:start --only firestore --clear-data
```

### Erreur "port already in use" pour les émulateurs

```bash
# Trouver et tuer les processus
lsof -i :9099  # Auth
lsof -i :8080  # Firestore
lsof -i :9199  # Storage
lsof -i :4000  # UI
kill -9 PID
```

### Les données des émulateurs sont corrompues

```bash
# Effacer toutes les données des émulateurs
firebase emulators:export ./backup
firebase emulators:start --clear-data
```

## 🔐 Authentification

### Impossible de se connecter

**Solutions :**
1. Vérifier que les émulateurs tournent
2. Vérifier `VITE_USE_FIREBASE_EMULATORS=true` dans `.env`
3. Vérifier que l'utilisateur existe dans l'émulateur Auth (http://localhost:4000/auth)

### Erreur "Firebase: Error (auth/configuration-not-found)"

**Solution :** Vérifier les clés Firebase dans `.env`

### Erreur "Firebase: Error (auth/email-already-in-use)"

**Solution :** L'email est déjà utilisé. Utiliser un autre email ou se connecter.

## 📦 npm

### Erreurs de dépendances

```bash
# Solution radicale
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Version de Node.js incompatible

```bash
# Utiliser nvm pour gérer les versions
nvm install 20
nvm use 20
```

## 🧪 Tests

### Les tests ne passent pas

**Solutions :**
1. Vérifier que les émulateurs Firebase tournent
2. Vérifier les variables d'environnement
3. Vider le cache Vitest : `rm -rf node_modules/.cache/vitest`

### Tests E2E échouent

**Solutions :**
1. Vérifier que l'application tourne : `npm run dev`
2. Vérifier que les émulateurs tournent
3. Installer les browsers Playwright : `npx playwright install`

## 🐛 Bugs connus

### Les points ne s'affichent pas

**Cause possible :** Problème de souscription Firestore en temps réel

**Solution :** Rafraîchir la page ou vérifier la connexion aux émulateurs

### Le sélecteur de foyer ne fonctionne pas

**Cause possible :** L'utilisateur n'a pas de membership actif

**Solution :** Vérifier dans l'UI des émulateurs (http://localhost:4000/firestore) que le membership existe

## 📱 Mobile

### L'application ne se charge pas sur mobile

**Solutions :**
1. Vérifier que le téléphone est sur le même réseau WiFi
2. Vérifier l'adresse IP : `ipconfig getifaddr en0`
3. Désactiver le pare-feu macOS
4. Utiliser `--host` : `npm run dev -- --host`

### La PWA ne s'installe pas

**Solutions :**
1. Utiliser HTTPS en production
2. Vérifier le manifeste : `http://localhost:3000/manifest.json`
3. Vérifier le service worker dans les DevTools > Application > Service Workers

## 🔄 Git

### Erreur de merge

```bash
# Annuler le merge
git merge --abort

# Ou résoudre les conflits manuellement
git mergetool
```

### Commit sur la mauvaise branche

```bash
# Déplacer le commit sur une nouvelle branche
git branch feat/ma-feature
git reset HEAD~1 --hard
git checkout feat/ma-feature
```

## 🆘 Contacter l'équipe

Si rien ne fonctionne :
1. Vérifier les issues GitHub existantes
2. Créer une nouvelle issue avec :
   - Le message d'erreur complet
   - Les étapes pour reproduire
   - Ton environnement (OS, Node.js version)
3. Contacter David ou Docdadi
