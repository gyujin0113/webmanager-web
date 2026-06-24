#!/usr/bin/env bash
# 사용법: check-content-only.sh <고객repo경로> [base브랜치=main]
# 변경(커밋·스테이지·미스테이지·미추적 전부)이 content/ 안에만 있는지 검사. 위반 시 exit 1.
set -euo pipefail
cd "$1"
base="${2:-main}"
committed=$(git diff --name-only "${base}...HEAD" 2>/dev/null || true)
staged=$(git diff --name-only --cached 2>/dev/null || true)
unstaged=$(git diff --name-only 2>/dev/null || true)
untracked=$(git ls-files --others --exclude-standard 2>/dev/null || true)
all=$(printf '%s\n%s\n%s\n%s\n' "$committed" "$staged" "$unstaged" "$untracked" | grep -v '^$' | sort -u || true)
violations=$(echo "$all" | grep -v '^content/' || true)
if [ -n "$violations" ]; then
  echo "❌ content/ 밖 변경 감지 — PR 생성 금지:"
  echo "$violations"
  exit 1
fi
echo "✅ content/ 내부 변경만 존재"
