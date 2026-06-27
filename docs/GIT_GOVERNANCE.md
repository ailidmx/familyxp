# Gouvernance Git — Strategie Marin

Objectif: imposer un flux propre, auditable et sans push direct sur branches critiques.

## 1. Branches protegees

Branches a proteger:
- main (ou master selon le nom actif du repo)
- develop

Regle simple:
- Interdiction de push direct
- Passage obligatoire par Pull Request
- Merge uniquement si checks CI verts

## 2. Branch protection recommandee

### Pour main/master
- Require a pull request before merging: ON
- Required approvals: 2
- Dismiss stale pull request approvals when new commits are pushed: ON
- Require approval of the most recent reviewable push: ON
- Require conversation resolution before merging: ON
- Require status checks to pass before merging: ON
- Required checks:
  - CI — Quality Checks / Lint
  - CI — Quality Checks / TypeScript Check
  - CI — Quality Checks / Tests
- Require linear history: ON
- Do not allow force pushes: ON
- Do not allow deletions: ON

### Pour develop
- Require a pull request before merging: ON
- Required approvals: 1
- Dismiss stale approvals: ON
- Require conversation resolution: ON
- Require status checks: ON
- Required checks:
  - CI — Quality Checks / Lint
  - CI — Quality Checks / TypeScript Check
  - CI — Quality Checks / Tests
- Do not allow force pushes: ON
- Do not allow deletions: ON

## 3. Convention de flux

- Feature branch -> PR vers develop
- Validation fonctionnelle sur UAT via branche main
- Production via release + workflow PROD

Conventions de branche:
- feat/<scope>
- fix/<scope>
- refactor/<scope>
- docs/<scope>
- test/<scope>

## 4. Mise en place rapide dans GitHub UI

1. Ouvrir Settings > Branches > Add branch protection rule
2. Creer une regle pour main (ou master) avec les options ci-dessus
3. Creer une regle pour develop avec les options ci-dessus
4. Verifier que les checks CI existent dans une PR test

## 5. Environments GitHub

Creer 3 environments GitHub:
- dev
- uat
- prod

Recommendations:
- prod: activer Required reviewers
- prod: restreindre l'acces aux maintainers

## 6. Secrets requis pour les workflows

- FIREBASE_SERVICE_ACCOUNT_DEV
- FIREBASE_SERVICE_ACCOUNT_UAT
- FIREBASE_SERVICE_ACCOUNT_PROD
- NUXT_ENV_FILE_DEV
- NUXT_ENV_FILE_UAT
- NUXT_ENV_FILE_PROD

Les secrets NUXT_ENV_FILE_* contiennent le contenu complet du fichier .env correspondant.

## 7. Option CLI (gh) pour accelerer

Si GitHub CLI est configure et authentifie, utiliser des rulesets via API.
Le script d'automatisation peut etre ajoute ensuite selon le niveau d'administration du repo.
