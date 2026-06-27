# Checklist de Revue de Code — FamilyXP

## 📋 Checklist

### Architecture
- [ ] La logique métier est-elle dans un composable/store (pas dans un composant) ?
- [ ] Le code respecte-t-il l'architecture multi-tenant (householdId) ?
- [ ] Les données familiales ne sont-elles pas codées en dur ?
- [ ] Le code est-il mobile-first ?

### TypeScript
- [ ] Les types sont-ils corrects et complets ?
- [ ] Pas de `any` ?
- [ ] Les interfaces sont-elles exportées depuis `app/types/` ?
- [ ] Les fonctions sont-elles correctement typées (paramètres et retour) ?

### Firebase
- [ ] Les requêtes Firestore sont-elles sécurisées (filtre par householdId) ?
- [ ] Les règles de sécurité sont-elles à jour ?
- [ ] Les émulateurs sont-ils utilisés en développement ?
- [ ] Pas de clés de production exposées ?

### Tests
- [ ] Des tests sont-ils écrits pour la nouvelle fonctionnalité ?
- [ ] Les tests existants passent-ils ?
- [ ] Les cas limites sont-ils testés ?
- [ ] Les tests d'intégration Firebase sont-ils inclus si nécessaire ?

### Performance
- [ ] Les requêtes Firestore sont-elles optimisées (indexes) ?
- [ ] Pas de re-rendus inutiles ?
- [ ] Les souscriptions Firestore sont-elles nettoyées (onUnmounted) ?

### Style
- [ ] Le code suit-il les conventions du projet ?
- [ ] ESLint passe-t-il ?
- [ ] Prettier est-il appliqué ?
- [ ] Les noms sont-ils cohérents (composables, stores, composants) ?

### i18n (obligatoire)
- [ ] Aucun texte utilisateur en dur (magic string) dans les templates/composants
- [ ] Toutes les nouvelles clés existent en FR, EN et ES
- [ ] Les placeholders, labels, messages d'erreur et CTA sont internationalisés
- [ ] Le contrôle automatique `npm run check:i18n` passe
- [ ] La revue humaine i18n valide ton, cohérence et qualité des traductions

### Documentation
- [ ] La documentation est-elle mise à jour si nécessaire ?
- [ ] Les changements sont-ils documentés dans CHANGELOG.md ?
- [ ] Les commentaires sont-ils utiles (pas de commentaires évidents) ?

### Sécurité
- [ ] Les entrées utilisateur sont-elles validées ?
- [ ] Les règles Firestore sont-elles correctes ?
- [ ] Les rôles sont-ils vérifiés côté serveur ?

## ✅ Résultat

- [ ] **Approuvé** — Tout est bon
- [ ] **Changements demandés** — Voir commentaires
- [ ] **Bloquant** — Problème critique à résoudre
