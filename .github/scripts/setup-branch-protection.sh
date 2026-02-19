#!/usr/bin/env bash
#
# Script helper para aplicar proteção de branch via gh CLI.
# Execute localmente após revisar. Requer `gh auth login`.

set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI não encontrado. Instale: https://github.com/cli/cli#installation"
  exit 1
fi

OWNER="$(gh repo view --json owner --jq .owner.login)"
REPO="$(basename "$(git rev-parse --show-toplevel)")"
BRANCH=${1:-main}

echo "Aplicando proteção para $OWNER/$REPO branch $BRANCH"

# Ajuste contexts se o workflow usar nome diferente (ex.: checks)
CONTEXT="checks"

gh api --method PUT "/repos/${OWNER}/${REPO}/branches/${BRANCH}/protection" \
  -f required_status_checks="{\"strict\":true,\"contexts\":[\"${CONTEXT}\"]}" \
  -f required_pull_request_reviews="{\"required_approving_review_count\":1}" \
  -f enforce_admins=true

echo "Concluído. Verifique nas configurações do repositório no GitHub."

