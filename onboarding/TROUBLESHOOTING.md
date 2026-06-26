# Guide de dépannage

Erreurs fréquentes et solutions pour FamilyXP / FamQuest.

---

## 📦 Installation

### `npm install` échoue

**Symptôme :** Erreurs pendant l'installation des dépendances.

**Solutions :**
```bash
# 1. Vider le cache npm
npm cache clean --force

# 2. Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install

# 3. Vérifier la version de Node.js
node --version  # Doit être >= 20
```

### `command not found: nuxi`

**Symptôme :** La commande `nuxi` n'est pas trouvée.

**Solution :**
```bash
npm install
# nuxi est installé automatiquement avec Nuxt
```

---

## 🔥 Émulateurs Firebase

### `Firebase emulators not running`

**Symptôme :** L'application ne se connecte pas aux émulateurs.

**Solutions :**
```bash
# 1. Vérifier que les émulateurs tournent
# Tu dois voir dans le terminal :
# ✔  All emulators ready!

# 2. Vérifier les ports
lsof -i :8080  # Firestore
lsof -i :9099  # Auth
lsof -i :9199  # Storage

# 3. Relancer les émulateurs
npm run emulators
```

### `Port already in use`

**Symptôme :** Un port est déjà utilisé par un autre processus.

**Solution :**
```bash
# Trouver le processus qui utilise le port
lsof -i :8080

# Tuer le processus (remplacer PID par le numéro)
kill -9 PID

# Ou utiliser un autre port en modifiant .env.local
# NUXT_PUBLIC_FIRESTORE_EMULATOR_HOST=localhost:8081
```

### Les émulateurs ne sauvegardent pas les données

**Symptôme :** Les données sont perdues après avoir arrêté les émulateurs.

**Solution :**
```bash
# Lancer avec export automatique
npm run emulators  # Utilise --export-on-exit

# Les données sont sauvegardées dans ./firebase-data/
```

---

## 🔐 Authentification

### `Firebase: Error (auth/operation-not-allowed)`

**Symptôme :** Impossible de créer un compte.

**Solution :**
1. Va sur la console Firebase
2. Authentication > Sign-in method
3. Active "Email/Password"
4. Attends 1-2 minutes que la configuration se propage

### `Firebase: Error (auth/email-already-in-use)`

**Symptôme :** L'email est déjà utilisé.

**Solution :** Utilise un autre email ou connecte-toi avec l'email existant.

### `Firebase: Error (auth/weak-password)`

**Symptôme :** Mot de passe trop court.

**Solution :** Le mot de passe doit faire au moins 6 caractères.

---

## 🌐 Application

### L'application ne se charge pas

**Symptôme :** Page blanche ou erreur au chargement.

**Solutions :**
```bash
# 1. Vérifier que le serveur tourne
# Tu dois voir dans le terminal :
# ✔ Nuxt 3.x.x ready in Xms
# ✔ Local: http://localhost:3000

# 2. Vérifier la console navigateur (F12 > Console)
# Cherche les erreurs rouges

# 3. Vider le cache navigateur
# Cmd+Shift+R (rechargement forcé)

# 4. Vérifier le fichier .env.local
cat .env.local
```

### `[nuxt] [request error]` dans la console

**Symptôme :** Erreur Nuxt au chargement d'une page.

**Solutions :**
```bash
# 1. Redémarrer le serveur de développement
# Ctrl+C puis npm run dev:local

# 2. Vérifier les types TypeScript
npm run typecheck

# 3. Vérifier les dépendances
npm ls --depth=0
```

### Erreur CORS

**Symptôme :** Blocage CORS dans la console navigateur.

**Solution :** Ce problème arrive surtout en production. Vérifie la configuration Firebase Hosting.

---

## 🐛 Tests

### Les tests ne passent pas

**Symptôme :** `npm run test` échoue.

**Solutions :**
```bash
# 1. Vérifier que les émulateurs tournent
npm run emulators

# 2. Lancer un test spécifique
npx vitest run tests/monTest.test.ts

# 3. Voir les logs détaillés
npx vitest run --reporter=verbose
```

---

## 🚀 Déploiement

### `firebase deploy` échoue

**Symptôme :** Erreur lors du déploiement Firebase.

**Solutions :**
```bash
# 1. Vérifier que tu es connecté
firebase login

# 2. Vérifier le projet actif
firebase use

# 3. Vérifier les projets configurés
firebase projects:list

# 4. Build avant de déployer
npm run build:dev
npm run deploy:dev
```

### `Hosting URL not found`

**Symptôme :** L'URL de déploiement ne fonctionne pas.

**Solution :** Vérifie que le hosting est activé dans la console Firebase.

---

## 📁 Fichiers

### `.env.local` ignoré par Git

**Symptôme :** Les modifications de `.env.local` n'apparaissent pas dans `git status`.

**Solution :** C'est normal ! `.env.local` est dans `.gitignore` pour des raisons de sécurité.

### Fichier verrouillé

**Symptôme :** Impossible de modifier un fichier.

**Solution :**
```bash
# Vérifier les permissions
ls -la nom_du_fichier

# Déverrouiller si nécessaire
chmod 644 nom_du_fichier
```

---

## 🖥️ macOS spécifique

### `zsh: command not found`

**Symptôme :** Une commande n'est pas trouvée.

**Solution :**
```bash
# Vérifier le PATH
echo $PATH

# Ajouter npm au PATH si nécessaire
export PATH="/usr/local/bin:$PATH"
```

### Port déjà utilisé sur macOS

**Symptôme :** `listen EADDRINUSE :::3000`

**Solution :**
```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
kill -9 PID
```

---

## 🔄 Réinstallation complète

Si rien ne fonctionne, réinstalle tout :

```bash
# 1. Supprimer le projet
cd ~/Documents
rm -rf familyxp

# 2. Recloner
git clone https://github.com/ailidmx/familyxp.git
cd familyxp

# 3. Réinstaller
npm install

# 4. Copier .env
cp .env.example .env.local

# 5. Lancer
npm run emulators  # Terminal 1
npm run dev:local  # Terminal 2
```

---

## 📞 Support

Si le problème persiste :
1. Vérifie les **issues GitHub** existantes
2. Crée une **nouvelle issue** avec :
   - Le message d'erreur complet
   - Ton OS et version
   - Les étapes pour reproduire
3. Contacte l'équipe sur le canal dédié
