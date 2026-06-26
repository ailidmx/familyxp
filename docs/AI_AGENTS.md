# Guide pour Agents IA — FamilyXP / FamQuest

## 🎯 Objectif

Ce document explique comment les agents IA (Claude, GitHub Copilot, Cline, etc.) peuvent interagir efficacement avec le projet FamilyXP/FamQuest.

## 📚 Documentation de référence

| Document | Quand le lire |
|----------|---------------|
| `README.md` | Première connexion au projet |
| `AGENTS.md` | Instructions générales pour agents |
| `CLAUDE.md` | Instructions spécifiques Claude |
| `COPILOT.md` | Instructions spécifiques Copilot |
| `docs/ARCHITECTURE.md` | Avant de coder une nouvelle feature |
| `docs/DATA_MODEL.md` | Avant de toucher aux données |
| `docs/BUSINESS_RULES.md` | Avant d'implémenter une règle métier |
| `docs/TESTING.md` | Avant d'écrire des tests |
| `docs/FIREBASE_RULES.md` | Avant de modifier les règles de sécurité |

## 🔍 Workflow recommandé

### 1. Découverte
```bash
# Lire la documentation
cat README.md
cat AGENTS.md
cat docs/ARCHITECTURE.md
cat docs/DATA_MODEL.md

# Explorer le code
ls app/
ls app/types/
ls app/composables/
ls app/stores/
```

### 2. Analyse
```bash
# Vérifier les tests existants
npm run test

# Vérifier les types
npm run typecheck

# Vérifier le lint
npm run lint
```

### 3. Implémentation
```bash
# Créer une branche
git checkout -b feat/ma-feature

# Coder...
# Tester...
# Commiter...
```

### 4. Validation
```bash
# Vérifier que tout passe
npm run test
npm run typecheck
npm run lint
```

## 🧠 Connaissances essentielles

### Architecture
- Application Nuxt 3 PWA
- Firebase Auth + Firestore
- Multi-tenant (householdId)
- Mobile-first

### Modèle de données
```
User → Membership → Household → Contract → Rules → PointEvents → Rewards
```

### Règles métier clés
1. Un utilisateur peut appartenir à plusieurs foyers
2. Chaque foyer a son propre contrat et ses propres points
3. Les points sont stockés sur le membership ET dans pointEvents
4. Les rôles : admin > parent > child > viewer
5. Ne jamais coder une famille spécifique en dur

### Conventions de code
- TypeScript strict
- Composables pour la logique métier
- Stores Pinia pour l'état global
- Tests pour chaque nouvelle fonctionnalité
- Pas de logique métier dans les composants

## 🚫 Pièges à éviter

1. **Coder des noms de famille en dur** → Utiliser les seed data uniquement
2. **Mettre la logique métier dans les composants** → Utiliser les composables
3. **Oublier le multi-tenant** → Toujours filtrer par householdId
4. **Ignorer les types TypeScript** → Toujours typer
5. **Modifier les règles de sécurité sans tester** → Tester avec les émulateurs

## 📝 Format des réponses

Quand un agent IA répond à une question sur le projet, privilégier :

1. **Contexte** : Rappeler brièvement le concept
2. **Référence** : Pointer vers la documentation pertinente
3. **Solution** : Proposer une implémentation concrète
4. **Tests** : Suggérer les tests à écrire

### Exemple

```
## Contexte
FamilyXP utilise un modèle multi-tenant où chaque foyer a son propre contrat.

## Référence
Voir docs/DATA_MODEL.md pour le modèle de données.

## Solution
Pour ajouter une nouvelle règle, utiliser le composable useRules :
```typescript
const { addRule } = useRules()
await addRule(householdId, contractId, {
  type: 'bonus',
  name: 'Faire son lit',
  points: 5
})
```

## Tests
Ajouter des tests dans tests/unit/composables/useRules.test.ts
```
