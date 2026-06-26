# Règles Métier — FamilyXP / FamQuest

## 🏠 Foyers (Households)

### Création
- Tout utilisateur peut créer un foyer
- Le créateur devient automatiquement **admin** du foyer
- Un foyer doit avoir un nom unique (parmi les foyers de l'utilisateur)

### Suppression
- Seul un admin peut supprimer un foyer
- La suppression est définitive (toutes les données associées sont supprimées)
- Confirmation requise : taper le nom du foyer

### Modification
- Le nom et la description peuvent être modifiés par un admin
- Les paramètres (monnaie, limites) peuvent être modifiés par un admin

## 👥 Membres (Memberships)

### Rôles

| Rôle | Permissions |
|------|-------------|
| **admin** | Gère les membres, le contrat, les règles, les récompenses, supprime le foyer |
| **parent** | Valide les points, gère les récompenses, modifie les règles |
| **child** | Ajoute des points (en attente de validation), voit son historique, demande des récompenses |
| **viewer** | Voit le tableau de bord et l'historique (grands-parents) |

### Invitation
- Un admin ou parent peut inviter quelqu'un par email
- L'invité reçoit un email avec un lien
- Le lien expire après 7 jours
- L'invité doit avoir un compte pour accepter

### Multi-foyers
- Un utilisateur peut appartenir à plusieurs foyers
- Chaque foyer a ses propres points, contrat et historique
- L'utilisateur voit ses foyers et peut basculer entre eux

### Départ d'un membre
- Un membre peut quitter un foyer
- Un admin peut retirer un membre
- L'historique des points est conservé
- Les points sont archivés (lecture seule)

## 📜 Contrats (Contracts)

### Création
- Un admin crée le contrat
- Le contrat peut être en **brouillon** avant activation
- Tous les membres voient le contrat
- Le contrat doit avoir au moins une règle pour être activé

### Statuts
- **draft** : En cours d'édition, visible par les admins/parents
- **active** : En cours, les règles s'appliquent
- **paused** : Suspendu, les règles ne s'appliquent plus
- **archived** : Terminé, historique conservé

### Période
- Un contrat a une date de début
- Une date de fin optionnelle
- À la fin, le contrat passe automatiquement en "archived"
- Un nouveau contrat peut être créé à tout moment

### Négociation
- Les règles sont proposées par les admins/parents
- Les enfants peuvent suggérer des règles (via l'interface)
- Le contrat est "négocié" quand toutes les parties ont validé

## ⚖️ Règles (Rules)

### Types
- **bonus** : Points gagnés quand l'action est réalisée
- **malus** : Points perdus quand l'action n'est pas réalisée (ou comportement négatif)

### Catégories
- `chores` : Tâches ménagères
- `school` : École, devoirs
- `behavior` : Comportement
- `health` : Santé, hygiène
- `custom` : Personnalisé

### Fréquence
- `daily` : Applicable une fois par jour
- `weekly` : Applicable une fois par semaine
- `monthly` : Applicable une fois par mois
- `once` : Applicable une seule fois

### Validation
- Certaines règles nécessitent une validation parentale
- Les règles sans validation sont automatiquement approuvées
- Un parent peut rejeter un point avec un commentaire

## 🎯 Points (PointEvents)

### Ajout de points
- Un enfant peut ajouter des points pour une règle bonus
- Un parent peut ajouter des points manuellement
- Un parent peut ajouter des points pour un malus
- Les points sont toujours liés à une règle (sauf ajout manuel)

### Validation
- Si la règle nécessite validation : statut = "pending"
- Un parent valide ou rejette
- Une fois validé : les points sont crédités
- Une fois rejeté : les points ne sont pas crédités

### Historique
- Tous les événements de points sont conservés
- L'historique est visible par tous les membres du foyer
- Filtrable par membre, date, type, règle

### Limites
- Limite quotidienne de points (configurable)
- Pas de points négatifs (un membre ne peut pas descendre en dessous de 0)

## 🏆 Récompenses (Rewards)

### Création
- Un admin ou parent crée les récompenses
- Chaque récompense a un coût en points
- Une récompense peut avoir un stock limité

### Demande
- Un enfant peut demander une récompense
- La demande est en attente de validation parentale
- Le parent peut approuver ou rejeter

### Validation
- Le parent vérifie que l'enfant a assez de points
- Le parent approuve la demande
- Les points sont déduits du solde de l'enfant
- La récompense est marquée comme "redeemed"

## ✅ Validations

### Qui peut valider ?
- Les membres avec rôle "admin" ou "parent"
- Un enfant ne peut pas valider ses propres points
- Un parent peut valider les points de n'importe quel enfant

### Délai
- Pas de délai imposé (le parent valide quand il peut)
- Les points en attente sont visibles dans le dashboard

### Refus
- Un refus doit avoir un commentaire
- Le refus est visible dans l'historique
- L'enfant peut contester (nouvelle soumission)

## 📱 Interface

### Dashboard
- Vue d'ensemble des points du foyer
- Derniers événements
- Points en attente de validation
- Classement (optionnel)

### Navigation
- Basculer entre les foyers
- Accès rapide à l'ajout de points
- Accès à l'historique
- Accès aux récompenses

### Notifications
- Points ajoutés
- Validation en attente
- Récompense disponible
- Nouveau membre
- Contrat modifié

## 🆓 Freemium

### Limites version gratuite
- Maximum 2 foyers
- Maximum 6 membres par foyer
- Historique limité à 30 jours
- Pas de statistiques avancées
- Pas d'IA
- Pas d'export PDF

### Version premium
- Foyers illimités
- Membres illimités
- Historique complet
- Statistiques avancées
- IA d'aide à la création de contrats
- Export PDF
- Thèmes personnalisés
- Badges
