# Première Contribution — FamilyXP

Bienvenue ! 🎉 Ce guide va t'aider à faire ta première contribution au projet.

## 🎯 Choisir une tâche

### Pour commencer (débutant)

- Corriger une typo dans la documentation
- Ajouter un test manquant
- Améliorer un message d'erreur
- Ajouter un commentaire utile

### Intermédiaire

- Ajouter un composant UI simple
- Écrire des tests pour un composable
- Corriger un bug mineur
- Améliorer le style CSS

### Avancé

- Implémenter une nouvelle fonctionnalité
- Créer un nouveau composable
- Optimiser les performances
- Ajouter des animations

## 📋 Processus étape par étape

### 1. Configurer l'environnement

```bash
# S'assurer que tout fonctionne
npm run dev
npm run test
npm run lint
```

### 2. Créer une branche

```bash
# Toujours partir de main
git checkout main
git pull

# Créer une branche avec un nom descriptif
git checkout -b feat/ajouter-bouton-points
```

### 3. Coder

```bash
# Ouvrir VS Code
code .

# Faire les modifications
# ...

# Vérifier que ça compile
npm run typecheck
```

### 4. Tester

```bash
# Lancer les tests
npm run test

# Vérifier le lint
npm run lint
```

### 5. Commiter

```bash
# Voir les fichiers modifiés
git status

# Ajouter les fichiers
git add .

# Commiter avec un message clair
git commit -m "feat: ajouter le bouton d'ajout de points"
```

### 6. Pusher

```bash
# Envoyer la branche sur GitHub
git push origin feat/ajouter-bouton-points
```

### 7. Créer une Pull Request

1. Aller sur [https://github.com/casabert/familyxp](https://github.com/casabert/familyxp)
2. Cliquer sur "Pull Requests" > "New Pull Request"
3. Sélectionner ta branche
4. Ajouter une description
5. Cliquer sur "Create Pull Request"

## 💡 Conseils

### Pour une bonne PR

- **Une seule chose** par PR (une fonctionnalité, un fix)
- **Description claire** de ce qui est fait et pourquoi
- **Tests** qui passent
- **Documentation** mise à jour si nécessaire

### Éviter

- Les PR trop grosses (> 400 lignes)
- Les changements non liés
- Les commits sans message clair
- Le code non testé

## 🎉 Félicitations !

Tu viens de faire ta première contribution. Chaque contribution, même petite, est précieuse. Continue comme ça ! 🚀
