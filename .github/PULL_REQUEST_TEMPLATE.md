# Pull Request — FamilyXP

> **Lis-moi avant de créer ta PR** — ce template est conçu pour être pédagogique et complet. Prends le temps de bien remplir chaque section.

---

## 🔗 Lien vers l'issue

<!--
Obligatoire : chaque PR doit être liée à une issue GitHub.
Si l'issue n'existe pas encore, crée-la d'abord.
Exemple : "Closes #12" ou "Related to #34"
-->

**Issue :** #

---

## 🎯 Objectif de la PR

<!--
Décris en 1-2 phrases ce que cette PR apporte.
Exemple : "Ajoute la création de foyer avec formulaire de base et validation côté client."
-->

**Quoi :**

**Pourquoi :**

---

## 🧠 Contexte et décisions

<!--
Explique POURQUOI tu as fait ces choix techniques.
C'est la section la plus importante pour les reviewers.
Exemple : "J'ai choisi un composable plutôt qu'un store Pinia car cette logique est purement UI et n'a pas besoin d'être partagée entre pages."
-->

**Décisions techniques :**

**Alternatives envisagées :**

---

## ✅ Checklist de qualité

<!--
Coche tout ce qui s'applique. Si une case n'est pas cochée, explique pourquoi dans les commentaires.
-->

- [ ] **Tests unitaires** — ajoutés ou mis à jour
- [ ] **Tests E2E** — ajoutés ou mis à jour (si applicable)
- [ ] **TypeScript strict** — pas de `any`, pas de `@ts-ignore`
- [ ] **i18n** — toutes les nouvelles chaînes sont traduites (FR + ES)
- [ ] **Mobile-first** — responsive testé sur écran mobile
- [ ] **Accessibilité** — labels, rôles, contrastes
- [ ] **Documentation** — mise à jour si nécessaire (README, ARCHITECTURE, DATA_MODEL, etc.)
- [ ] **Pas de logique métier dans les composants** — utilisation de stores/composables
- [ ] **Pas de famille en dur** — les données familiales sont en seed data uniquement

---

## 📸 Captures d'écran (si UI)

<!--
Ajoute des captures pour montrer le rendu mobile ET desktop.
Tu peux utiliser : Cmd+Shift+4 (macOS) ou un outil de capture.
-->

| Mobile | Desktop |
|--------|---------|
|        |         |

---

## 🧪 Comment tester

<!--
Donne les étapes précises pour tester cette PR en local.
Exemple :
1. `npm run dev`
2. Créer un compte
3. Aller sur /household/create
4. Remplir le formulaire et valider
5. Vérifier que le foyer apparaît dans le dashboard
-->

**Étapes :**

1.
2.
3.

**Environnement de test :** `npm run dev:local`

---

## 🚀 Mapping environnement

<!--
Indique quel environnement est concerné par cette PR.
-->

- [ ] **local** — développement avec émulateurs Firebase
- [ ] **dev** — déploiement sur le projet Firebase dev
- [ ] **uat** — déploiement sur le projet Firebase uat
- [ ] **prod** — déploiement sur le projet Firebase prod

---

## 🔄 Type de changement

- [ ] 🐛 Correction de bug
- [ ] ✨ Nouvelle fonctionnalité
- [ ] ♻️ Refactoring
- [ ] 📚 Documentation
- [ ] 🧪 Tests
- [ ] ⚙️ Configuration / CI

---

## 💬 Notes pour le reviewer

<!--
Y a-t-il quelque chose de délicat à vérifier ?
Des parties du code qui méritent une attention particulière ?
-->

**Points d'attention :**

**Ce qui n'est PAS dans cette PR (et sera dans une PR future) :**

---

<!--
Merci d'avoir pris le temps de bien remplir cette PR ! 🙏
Chaque PR bien documentée = une relecture plus rapide et plus efficace.
-->
