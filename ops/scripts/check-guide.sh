#!/usr/bin/env bash
# 사용법: check-guide.sh <고객repo경로>
# content/guide.json 이 있으면 빌드 산출물(out/)과 대조 검증. 없으면 통과(가이드 미적용 고객).
set -euo pipefail
repo="$1"
guide="$repo/content/guide.json"
[ -f "$guide" ] || { echo "ℹ️ guide.json 없음 — 검사 생략"; exit 0; }
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
validator="$here/../../../webmanager-widget/dist/validate-guide.mjs"
[ -f "$validator" ] || { echo "❌ 검증기 없음: $validator — webmanager-widget에서 npm run build"; exit 1; }
[ -d "$repo/out" ] || { echo "❌ $repo/out 없음 — 먼저 npm run build"; exit 1; }
node "$validator" "$guide" "$repo/out"
