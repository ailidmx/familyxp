#!/bin/bash
# ============================================================
# board.sh — Utilitaire GitHub Project Board pour FamilyXP
# ============================================================
# Usage:
#   ./scripts/board.sh list              # Lister les items du board
#   ./scripts/board.sh add "Titre"       # Ajouter un item (Todo)
#   ./scripts/board.sh status <id> <s>   # Changer le statut (Todo|In Progress|Done)
#   ./scripts/board.sh sync              # Synchroniser docs/PROJECT_BOARD.md
#
# Prérequis : gh (GitHub CLI) authentifié
# ============================================================

set -euo pipefail

PROJECT_ID="PVT_kwHOBhsF-c4Bbx_5"
FIELD_ID="PVTSSF_lAHOBhsF-c4Bbx_5zhWgBTw"
TODO="f75ad846"
IN_PROGRESS="47fc9ee4"
DONE="98236657"

TOKEN=$(gh auth token 2>&1)

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

graphql() {
  local query="$1"
  curl -s -X POST "https://api.github.com/graphql" \
    -H "Authorization: bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"query\":\"$query\"}" 2>&1
}

list_items() {
  echo -e "${YELLOW}=== FamilyXP Project Board Items ===${NC}"
  graphql "{
    node(id: \"$PROJECT_ID\") {
      ... on ProjectV2 {
        items(first: 20) {
          nodes {
            id
            fieldValues(first: 8) {
              nodes {
                ... on ProjectV2ItemFieldTextValue {
                  text
                  field { ... on ProjectV2Field { name } }
                }
                ... on ProjectV2ItemFieldSingleSelectValue {
                  name
                  field { ... on ProjectV2SingleSelectField { name } }
                }
              }
            }
          }
        }
      }
    }
  }" | python3 -c "
import sys, json
data = json.load(sys.stdin)
items = data['data']['node']['items']['nodes']
for item in items:
    title = ''
    status = 'Todo'
    for fv in item['fieldValues']['nodes']:
        if fv and 'field' in fv:
            if fv['field']['name'] == 'Title':
                title = fv.get('text', '')
            elif fv['field']['name'] == 'Status':
                status = fv.get('name', 'Todo')
    item_id = item['id'].split('_')[-1][:8]
    print(f\"  [{status:12}] {item_id} {title}\")
"
}

add_item() {
  local title="$1"
  local escaped_title=$(echo "$title" | sed 's/"/\\"/g')
  
  echo -e "${YELLOW}Adding:${NC} $title"
  local result=$(graphql "mutation {
    addProjectV2DraftIssue(input: {
      projectId: \"$PROJECT_ID\",
      title: \"$escaped_title\"
    }) { projectItem { id } }
  }")
  
  local item_id=$(echo "$result" | python3 -c "import sys,json; print(json.load(sys.stdin).get('data',{}).get('addProjectV2DraftIssue',{}).get('projectItem',{}).get('id','ERROR'))" 2>&1)
  
  if [ "$item_id" != "ERROR" ]; then
    echo -e "${GREEN}✓ Created:${NC} $item_id"
  else
    echo -e "${RED}✗ Failed:${NC} $(echo "$result" | python3 -c "import sys,json; print(json.load(sys.stdin).get('errors',[{}])[0].get('message','Unknown'))" 2>&1)"
  fi
}

set_status() {
  local item_id="$1"
  local status_name="$2"
  local status_id=""
  
  case "$status_name" in
    "Todo"|"todo") status_id="$TODO" ;;
    "In Progress"|"in-progress"|"in_progress") status_id="$IN_PROGRESS" ;;
    "Done"|"done") status_id="$DONE" ;;
    *)
      echo -e "${RED}Invalid status:${NC} $status_name (use: Todo, In Progress, Done)"
      exit 1
      ;;
  esac
  
  echo -e "${YELLOW}Setting status:${NC} $item_id → $status_name"
  local result=$(graphql "mutation {
    updateProjectV2ItemFieldValue(input: {
      projectId: \"$PROJECT_ID\",
      itemId: \"$item_id\",
      fieldId: \"$FIELD_ID\",
      value: { singleSelectOptionId: \"$status_id\" }
    }) { projectV2Item { id } }
  }")
  
  local ok=$(echo "$result" | python3 -c "import sys,json; d=json.load(sys.stdin); print('OK' if d.get('data',{}).get('updateProjectV2ItemFieldValue') else 'FAIL')" 2>&1)
  
  if [ "$ok" = "OK" ]; then
    echo -e "${GREEN}✓ Updated${NC}"
  else
    echo -e "${RED}✗ Failed${NC}"
  fi
}

sync_docs() {
  echo -e "${YELLOW}Syncing docs/PROJECT_BOARD.md with GitHub Project Board...${NC}"
  # Cette fonction pourrait être étendue pour générer automatiquement
  # le fichier PROJECT_BOARD.md à partir des données du board
  echo -e "${GREEN}✓ Run 'list' to see current items, then update PROJECT_BOARD.md manually${NC}"
}

case "${1:-help}" in
  list)
    list_items
    ;;
  add)
    if [ -z "${2:-}" ]; then
      echo -e "${RED}Usage:${NC} $0 add \"Titre de l'item\""
      exit 1
    fi
    add_item "$2"
    ;;
  status)
    if [ -z "${2:-}" ] || [ -z "${3:-}" ]; then
      echo -e "${RED}Usage:${NC} $0 status <item_id> <Todo|In Progress|Done>"
      exit 1
    fi
    set_status "$2" "$3"
    ;;
  sync)
    sync_docs
    ;;
  help|*)
    echo "FamilyXP — GitHub Project Board Utilitaire"
    echo ""
    echo "Usage:"
    echo "  $0 list                        # Lister les items"
    echo "  $0 add \"Titre\"                # Ajouter un item"
    echo "  $0 status <id> <status>        # Changer le statut"
    echo "  $0 sync                        # Sync docs"
    echo ""
    echo "Exemples:"
    echo "  $0 add \"Phase 2: Modèle familial\""
    echo "  $0 status PVTI_xxx Done"
    echo "  $0 list"
    ;;
esac
