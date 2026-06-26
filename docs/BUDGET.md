# Budget & Coûts — FamilyXP

> Suivi de tous les coûts récurrents et ponctuels du projet.
> Dernière mise à jour : 26/06/2026

---

## 📊 Résumé mensuel

| Service | Coût/mois | Plan actuel | Notes |
|---------|-----------|-------------|-------|
| GitHub | 0 $ | Free | 3 repos, 2 000 min Actions/mois |
| Firebase DEV | 0 $ | Spark | Auth + Firestore + Hosting |
| Firebase UAT | 0 $ | Spark | Auth + Firestore + Hosting |
| Firebase PROD | 0 $ | Spark | Auth + Firestore + Hosting |
| **Total mensuel** | **0 $** | | |

## 💰 Coûts annuels

| Service | Coût/an | Période | Notes |
|---------|---------|---------|-------|
| Apple Developer Program | 99 $ | 2026 | Pour Sign in with Apple (si App Store) |
| Nom de domaine (optionnel) | ~10-15 $ | 2026 | ex: familyxp.app |
| **Total annuel** | **~109-114 $** | | |

---

## 🔧 Services détaillés

### GitHub
- **Plan :** Free
- **Coût :** 0 $/mois
- **Inclus :** Repos illimités, GitHub Actions (2 000 min/mois), GitHub Projects
- **Dépassement :** ~0.008 $/min supplémentaire
- **Compte :** [ailidmx](https://github.com/ailidmx)

### Firebase
- **Plan :** Spark (Free)
- **Coût :** 0 $/mois
- **Inclus :**
  - **Authentication :** 3 000 DAUs (Identity Platform)
  - **Firestore :** 1 Go stockage, 10 Go/mois transfert, 50K lectures/20K écritures/20K suppressions par jour
  - **Hosting :** 10 Go stockage, 360 Mo/mois transfert
- **Dépassement :** Passer au plan Blaze (paiement à l'usage)
- **Projets :**
  - `famillyxp` (DEV)
  - `familyxp-uat` (UAT)
  - `familyxp-prod` (PROD)

### Apple Developer Program
- **Coût :** 99 $/an
- **Nécessaire pour :** Sign in with Apple, publication App Store
- **Priorité :** Faible (PWA uniquement pour le MVP)

### Nom de domaine (optionnel)
- **Coût :** ~10-15 $/an
- **Utilité :** URL personnalisée au lieu de familyxp.web.app
- **Priorité :** Faible

---

## 📈 Projection MVP (Phase 1-2)

| Mois | Coût estimé | Notes |
|------|-------------|-------|
| Mois 1 | 0 $ | Développement, émulateurs locaux |
| Mois 2 | 0 $ | Tests, déploiement DEV |
| Mois 3 | 0 $ | Beta famille (Spark suffit) |
| Mois 6+ | 0-25 $/mois | Selon usage (Blaze si dépassement) |

## 🚀 Projection post-MVP

| Service | Coût estimé | Quand |
|---------|-------------|-------|
| Firebase Blaze | ~1-10 $/mois | Si > 3 000 DAUs |
| Apple Developer | 99 $/an | Si App Store |
| Domaine personnalisé | ~10-15 $/an | Si branding |
| GitHub Copilot Pro | 10 $/mois | Déjà inclus (David) |
| **Total estimé** | **~20-35 $/mois** | |

---

## 📋 Suivi des dépenses

| Date | Service | Montant | Type | Notes |
|------|---------|---------|------|-------|
| - | - | - | - | Aucune dépense pour l'instant |

---

## 👥 Budget conseillé

> **David + Docdadi = ~20 $/mois**

Répartition suggérée :
- David : 10 $/mois
- Docdadi : 10 $/mois

Cela couvre :
- GitHub Copilot Pro (10 $/mois)
- Firebase Blaze si nécessaire
- Nom de domaine
- Apple Developer (99 $/an = ~8 $/mois)
