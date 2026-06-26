#!/bin/bash
# =============================================================================
# Script de configuration des projets Firebase pour FamilyXP
# =============================================================================
# Ce script active les services nécessaires sur les 3 projets Firebase
# et récupère les clés de configuration pour les fichiers .env
#
# Usage :
#   chmod +x scripts/setup-firebase-projects.sh
#   ./scripts/setup-firebase-projects.sh
#
# Prérequis :
#   - gcloud CLI installé et authentifié
#   - firebase CLI installé
# =============================================================================

set -euo pipefail

# ─── Configuration ──────────────────────────────────────────────────────────
PROJECTS=(
  "famillyxp:familyxp-dev"
  "familyxp-uat:familyxp-uat"
  "familyxp-prod:familyxp-prod"
)

# ─── Fonctions ──────────────────────────────────────────────────────────────

get_access_token() {
  gcloud auth print-access-token
}

enable_service() {
  local project_id="$1"
  local service="$2"
  local service_name="$3"

  echo "  → Activation de $service_name ($service)..."
  gcloud services enable "$service" --project="$project_id" 2>/dev/null || true
}

enable_firebase_auth() {
  local project_id="$1"
  local token="$2"

  echo "  → Activation de Firebase Authentication (Email/Password)..."

  # Activer le provider Email/Password via Identity Toolkit API
  curl -s -X PATCH \
    "https://identitytoolkit.googleapis.com/admin/v2/projects/$project_id/config?updateMask=signIn.email.enabled" \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json" \
    -d '{
      "signIn": {
        "email": {
          "enabled": true,
          "passwordRequired": true
        }
      }
    }' > /dev/null
}

enable_firestore() {
  local project_id="$1"
  local token="$2"

  echo "  → Activation de Cloud Firestore..."

  # Vérifier si Firestore est déjà activé
  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" \
    "https://firestore.googleapis.com/v1/projects/$project_id/databases/(default)" \
    -H "Authorization: Bearer $token")

  if [ "$status" = "404" ]; then
    # Créer la base de données Firestore en mode natif
    curl -s -X POST \
      "https://firestore.googleapis.com/v1/projects/$project_id/databases" \
      -H "Authorization: Bearer $token" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "projects/'$project_id'/databases/(default)",
        "locationId": "us-central1",
        "type": "FIRESTORE_NATIVE"
      }' > /dev/null
    echo "    ✓ Base de données créée"
  else
    echo "    ✓ Déjà activé"
  fi
}

get_web_app_config() {
  local project_id="$1"
  local token="$2"

  echo "  → Récupération de la configuration Web App..."

  # Lister les apps Web
  local apps_response
  apps_response=$(curl -s \
    "https://firebase.googleapis.com/v1beta1/projects/$project_id/webApps" \
    -H "Authorization: Bearer $token")

  local app_count
  app_count=$(echo "$apps_response" | jq '.apps | length' 2>/dev/null || echo "0")

  if [ "$app_count" = "0" ] || [ "$app_count" = "null" ]; then
    echo "  → Création d'une application Web..."
    local create_response
    create_response=$(curl -s -X POST \
      "https://firebase.googleapis.com/v1beta1/projects/$project_id/webApps" \
      -H "Authorization: Bearer $token" \
      -H "Content-Type: application/json" \
      -d '{
        "displayName": "FamilyXP Web App",
        "appId": "'$project_id'-web-app"
      }')

    local app_id
    app_id=$(echo "$create_response" | jq -r '.name' 2>/dev/null || echo "")

    if [ -n "$app_id" ] && [ "$app_id" != "null" ]; then
      # Récupérer la config
      local config_response
      config_response=$(curl -s \
        "https://firebase.googleapis.com/v1beta1/$app_id/config" \
        -H "Authorization: Bearer $token")

      echo "$config_response" | jq -r '{
        apiKey: .apiKey,
        authDomain: .authDomain,
        projectId: .projectId,
        storageBucket: .storageBucket,
        messagingSenderId: .messagingSenderId,
        appId: .appId
      }'
    fi
  else
    # Prendre la première app Web
    local app_name
    app_name=$(echo "$apps_response" | jq -r '.apps[0].name')

    local config_response
    config_response=$(curl -s \
      "https://firebase.googleapis.com/v1beta1/$app_name/config" \
      -H "Authorization: Bearer $token")

    echo "$config_response" | jq -r '{
      apiKey: .apiKey,
      authDomain: .authDomain,
      projectId: .projectId,
      storageBucket: .storageBucket,
      messagingSenderId: .messagingSenderId,
      appId: .appId
    }'
  fi
}

# ─── Main ───────────────────────────────────────────────────────────────────

echo "=========================================="
echo "  Configuration des projets Firebase"
echo "=========================================="
echo ""

TOKEN=$(get_access_token)

for project_entry in "${PROJECTS[@]}"; do
  PROJECT_ID="${project_entry%%:*}"
  DISPLAY_NAME="${project_entry##*:}"

  echo "──────────────────────────────────────────"
  echo "📦 Projet : $DISPLAY_NAME ($PROJECT_ID)"
  echo "──────────────────────────────────────────"

  # Activer les services GCP nécessaires
  enable_service "$PROJECT_ID" "firebase.googleapis.com" "Firebase API"
  enable_service "$PROJECT_ID" "firestore.googleapis.com" "Firestore API"
  enable_service "$PROJECT_ID" "identitytoolkit.googleapis.com" "Identity Toolkit API"
  enable_service "$PROJECT_ID" "firebasehosting.googleapis.com" "Firebase Hosting API"

  # Activer Firebase Authentication
  enable_firebase_auth "$PROJECT_ID" "$TOKEN"

  # Activer Firestore
  enable_firestore "$PROJECT_ID" "$TOKEN"

  # Récupérer la config Web App
  echo ""
  CONFIG=$(get_web_app_config "$PROJECT_ID" "$TOKEN")

  if [ -n "$CONFIG" ] && [ "$CONFIG" != "null" ]; then
    echo ""
    echo "  ✅ Configuration récupérée !"
    echo ""
    echo "  Ajoute ceci dans .env.${DISPLAY_NAME#familyxp-} :"
    echo "  (ou .env.dev pour famillyxp)"
    echo "──────────────────────────────────────────"
    echo "$CONFIG" | jq -r '
      "NUXT_PUBLIC_FIREBASE_API_KEY=" + .apiKey,
      "NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=" + .authDomain,
      "NUXT_PUBLIC_FIREBASE_PROJECT_ID=" + .projectId,
      "NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=" + .storageBucket,
      "NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=" + .messagingSenderId,
      "NUXT_PUBLIC_FIREBASE_APP_ID=" + .appId
    '
    echo "──────────────────────────────────────────"
  else
    echo "  ⚠️  Impossible de récupérer la configuration"
  fi

  echo ""
done

echo "=========================================="
echo "  Configuration terminée !"
echo "=========================================="
echo ""
echo "⚠️  N'oublie pas de :"
echo "  1. Copier les clés dans les fichiers .env correspondants"
echo "  2. Lancer 'firebase deploy --project famillyxp' pour le hosting DEV"
echo "  3. Lancer 'firebase deploy --project familyxp-uat' pour le hosting UAT"
echo "  4. Lancer 'firebase deploy --project familyxp-prod' pour le hosting PROD"
echo ""
