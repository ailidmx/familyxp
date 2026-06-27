# Pull Request — FamilyXP (Template Complet)

> Objectif: produire des PR claires, auditables et rapides a relire.
> Cette PR doit permettre a un reviewer de comprendre le besoin, verifier les risques et valider le deploiement sans discussion supplementaire.

## 1) Liaison ticket et contexte

Issue principale: #

Tickets lies:
- #

Contexte metier (2-5 lignes):
-

Contrainte produit importante (si applicable):
- multi-tenant
- mobile-first
- TypeScript strict
- RGPD / consentement

## 2) Type de changement

- [ ] feat (nouvelle fonctionnalite)
- [ ] fix (correction)
- [ ] refactor (sans changement fonctionnel)
- [ ] docs
- [ ] test
- [ ] chore/ci

## 3) Objectif fonctionnel

Ce que fait la PR (attendu utilisateur):
-

Ce que la PR ne fait pas volontairement:
-

Definition of Done de cette PR:
- [ ] Cas nominal valide
- [ ] Cas erreur traite
- [ ] Cas vide/edge-case traite

## 4) Design technique et decisions

Approche retenue:
-

Fichiers/zones impactes:
-

Alternatives evaluees et pourquoi non retenues:
-

Dette technique ajoutee volontairement (si oui, decrire):
-

## 5) Impacts data, securite, conformité

Firestore/Storage/Auth impactes:
- [ ] Aucun
- [ ] Oui (decrire)

Risque securite:
- [ ] Aucun
- [ ] Faible
- [ ] Moyen
- [ ] Eleve

Donnees personnelles touchees:
- [ ] Non
- [ ] Oui (decrire type de donnees et justification)

Consentement/geoloc/politique:
- [ ] Non concerne
- [ ] Concerne et pris en charge

## 6) Strategie de test

Tests ajoutes/modifies:
- [ ] Unitaires
- [ ] Composants
- [ ] E2E Playwright
- [ ] Aucun (justifier)

Commandes executees localement:

```bash
npm run lint
npm run check:i18n
npm run typecheck
npm run test
```

Resultats:
-

## 7) Verification manuelle pas a pas

Preconditions:
1. npm run env:use -- <local|dev|uat|prod>
2. npm run dev:active

Parcours de verification:
1.
2.
3.

Resultat attendu:
-

## 8) Environnements et deploiement

Environnement cible principal:
- [ ] local
- [ ] dev
- [ ] uat
- [ ] prod

Impact workflows GitHub Actions:
- [ ] Aucun
- [ ] deploy-dev.yml
- [ ] deploy-uat.yml
- [ ] deploy-prod.yml

Plan de rollback (obligatoire si risque moyen/eleve):
1.
2.

## 9) UX, accessibilite, i18n

- [ ] Mobile-first verifie (small viewport)
- [ ] Accessibilite de base (labels, roles, focus)
- [ ] i18n complete (FR/EN/ES selon zone)
- [ ] Zero magic string UI (aucun texte utilisateur en dur)
- [ ] Verification auto i18n passee (`npm run check:i18n`)
- [ ] Revue humaine i18n effectuee (texte, tonalite, traduction, coherence)
- [ ] Captures ecran ajoutees si UI

Captures ecran (si UI):

| Mobile | Desktop |
|--------|---------|
|        |         |

## 10) Checklist finale merge

- [ ] Aucun secret/cle privee commit
- [ ] Pas de logique metier dans les composants
- [ ] Pas de donnees famille hardcodees
- [ ] Documentation mise a jour si necessaire
- [ ] PR lisible: objectif, risque, tests, rollback
- [ ] Ready for review

## 11) Notes reviewer

Points a relire en priorite:
-

Controle reviewer i18n obligatoire:
- [ ] Aucun texte utilisateur en dur dans les composants
- [ ] Clés i18n existantes en FR/EN/ES
- [ ] Terminologie coherente avec le produit

Questions ouvertes:
-
