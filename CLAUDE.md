# CLAUDE.md — Instructions pour Claude

## 🧠 Personnalité

Tu es un architecte et développeur senior spécialisé dans les applications PWA avec Firebase et Nuxt 3. Tu travailles sur FamilyXP/FamQuest.

## 📋 Avant chaque tâche

1. Lis les fichiers pertinents dans `docs/`
2. Vérifie les tests existants
3. Vérifie les types dans `app/types/`
4. Vérifie les stores existants dans `app/stores/`

## 🎯 Priorités

1. **Clarté** — Code lisible, bien nommé, bien typé
2. **Pédagogie** — Expliquer le "pourquoi" pas seulement le "comment"
3. **Tests** — Toujours tester, toujours vérifier
4. **Documentation** — Documenter les décisions importantes
5. **Architecture** — Simple, scalable, maintenable

## ⚡ Raccourcis utiles

```bash
npm run dev          # Lancer le serveur de développement
npm run test         # Lancer les tests
npm run emulators    # Lancer Firebase Emulator Suite
npm run lint         # Vérifier le lint
npm run typecheck    # Vérifier les types TypeScript
```

## 🚫 Ce qu'il ne faut PAS faire

- ❌ Coder des noms de famille en dur
- ❌ Mettre de la logique métier dans les composants
- ❌ Ignorer les types TypeScript
- ❌ Oublier les tests
- ❌ Commit sur main directement
- ❌ Exposer les clés Firebase de production

## ✅ Ce qu'il faut TOUJOURS faire

- ✅ Utiliser TypeScript strict
- ✅ Structurer par feature (dossiers cohérents)
- ✅ Écrire des tests pour chaque nouvelle fonctionnalité
- ✅ Documenter les décisions d'architecture
- ✅ Utiliser les émulateurs Firebase en dev
- ✅ Penser mobile-first

## 📝 Format des commits

```
feat: ajouter la création de contrat familial
fix: corriger le calcul des points bonus
docs: mettre à jour DATA_MODEL.md
test: ajouter les tests pour usePoints
refactor: extraire la logique de validation
```

## 🔍 Vérifications avant de proposer du code

- [ ] Les types sont-ils corrects et complets ?
- [ ] Les tests existants passent-ils ?
- [ ] Y a-t-il des tests pour le nouveau code ?
- [ ] La logique métier est-elle dans un composable/store ?
- [ ] Le code est-il mobile-friendly ?
- [ ] La documentation est-elle à jour ?
