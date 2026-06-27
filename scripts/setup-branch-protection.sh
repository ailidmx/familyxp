#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   REPO=owner/repo ./scripts/setup-branch-protection.sh
# Default:
#   ailidmx/familyxp

REPO="${REPO:-ailidmx/familyxp}"

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) est requis."
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Authentifie-toi d'abord: gh auth login"
  exit 1
fi

apply_rule() {
  local branch="$1"
  local approvals="$2"

  if ! gh api "repos/${REPO}/branches/${branch}" >/dev/null 2>&1; then
    echo "Branche absente, ignoree: ${branch}"
    return 0
  fi

  echo "Application de la protection sur ${branch}..."

  if ! gh api \
    --method PUT \
    -H "Accept: application/vnd.github+json" \
    "repos/${REPO}/branches/${branch}/protection" \
    --input - <<JSON
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "Lint",
      "TypeScript Check",
      "Tests"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": ${approvals},
    "require_last_push_approval": true
  },
  "restrictions": null,
  "required_conversation_resolution": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_linear_history": true,
  "lock_branch": false,
  "allow_fork_syncing": false
}
JSON
  then
    echo "Echec de protection pour ${branch}, branche ignoree."
    return 0
  fi

  echo "Protection OK: ${branch}"
}

# main/master: stricte
apply_rule "main" 2
apply_rule "master" 2

# develop: plus souple
apply_rule "develop" 1

echo "Termine. Regles de protection appliquees sur ${REPO}."
