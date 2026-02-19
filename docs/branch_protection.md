Branch protection (recomendações e script)

Visão geral
- Recomendo proteger a branch `main` exigindo checks obrigatórios: lint, unit tests, build.
- Recomendo exigir pelo menos 1 aprovação por PR e proibir push direto (force push).

Como ativar via interface web
1. Vá em Settings → Branches → Add branch protection rule.
2. Em Branch name pattern coloque `main`.
3. Marque:
   - Require status checks to pass before merging (selecione o workflow CI e marque strict).
   - Require pull request reviews before merging (1 reviewer mínimo).
   - Include administrators (opcional).
4. Salve a regra.

Script (GH CLI) — revisar antes de executar
Este script usa `gh` (GitHub CLI). Você precisa estar autenticado localmente com `gh auth login`.

```bash
#!/usr/bin/env bash
set -euo pipefail

OWNER="$(gh repo view --json owner --jq .owner.login)"
REPO="$(basename $(git rev-parse --show-toplevel))"
BRANCH="main"

echo "Aplicando proteção para $OWNER/$REPO on branch $BRANCH"

gh api --method PUT /repos/${OWNER}/${REPO}/branches/${BRANCH}/protection -f required_status_checks='{"strict":true,"contexts":["CI"]}' -f required_pull_request_reviews='{"required_approving_review_count":1}' -f enforce_admins=true

echo "Proteção aplicada. Confirme via GitHub web UI em Settings → Branches."
```

Observações
- Verifique o nome do workflow caso o contexto não seja `CI` (ex.: `checks`).
- O script não cria workflows — apenas aplica regras de proteção.

