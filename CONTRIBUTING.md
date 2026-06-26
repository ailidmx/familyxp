# Contribuer à FamilyXP/FamQuest

Merci de vouloir contribuer ! 🎉

## 🚀 Premiers pas

1. Lire `README.md` et `onboarding/INSTALLATION_DEV.md`
2. Configurer l'environnement de développement
3. Choisir une issue ou proposer une fonctionnalité

## 🔄 Workflow

```bash
# 1. Créer une branche
git checkout -b feat/ma-fonctionnalite

# 2. Coder
# ...

# 3. Tester
npm run test
npm run lint

# 4. Commiter
git add .
git commit -m "feat: description claire"

# 5. Pusher
git push origin feat/ma-fonctionnalite

# 6. Créer une Pull Request
```

## 📝 Conventions

### Branches

- `feat/` — Nouvelle fonctionnalité
- `fix/` — Correction de bug
- `docs/` — Documentation
- `refactor/` — Refactoring
- `test/` — Tests

### Commits

Utiliser [Conventional Commits](https://www.conventionalcommits.org/) :

```
feat: ajouter la création de contrat familial
fix: corriger le calcul des points bonus
docs: mettre à jour DATA_MODEL.md
test: ajouter les tests pour usePoints
refactor: extraire la logique de validation
```

### Code

- TypeScript strict
- Tests pour chaque nouvelle fonctionnalité
- Pas de logique métier dans les composants
- Mobile-first
- Pas de données familiales en dur

## 🧪 Tests

Toute nouvelle fonctionnalité doit inclure des tests :

```bash
# Tests unitaires
npm run test

# Tests avec couverture
npm run test:coverage

# Tests E2E
npm run test:e2e
```

## 📚 Documentation

Toute modification importante doit être documentée :

- `docs/ARCHITECTURE.md` pour les changements d'architecture
- `docs/DATA_MODEL.md` pour les changements de données
- `docs/BUSINESS_RULES.md` pour les règles métier
- `CHANGELOG.md` pour les changements notables

## ✅ Checklist PR

- [ ] Les tests passent
- [ ] Le lint passe
- [ ] Les types TypeScript sont corrects
- [ ] La documentation est à jour
- [ ] Pas de données familiales en dur
- [ ] Pas de logique métier dans les composants
- [ ] Mobile-first
- [ ] Une fonctionnalité = une PR
