#!/usr/bin/env bash
# 이 기기에 webmanager ops 환경을 1회 설정한다.
# webmanager-web repo 클론 후 실행:  bash ops/setup-machine.sh
# 하는 일: ① apply-edit 스킬 심링크 생성(기기별 repo 위치를 여기에 박음) ② 형제 repo·도구·인증 점검.
set -euo pipefail

# 이 스크립트 위치로부터 webmanager-web repo 루트를 자력 계산 (경로 하드코딩 없음)
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo "▶ webmanager-web repo: $ROOT"

# ── ① apply-edit 스킬 심링크 (단일 진실원천: SKILL.md가 이 링크를 역추적해 경로 해석) ──
SKILL_SRC="$ROOT/ops/skills/apply-edit"
SKILL_DST="$HOME/.claude/skills/apply-edit"
[ -d "$SKILL_SRC" ] || { echo "❌ 스킬 원본 없음: $SKILL_SRC"; exit 1; }
mkdir -p "$HOME/.claude/skills"
if [ -e "$SKILL_DST" ] || [ -L "$SKILL_DST" ]; then rm -rf "$SKILL_DST"; fi
ln -s "$SKILL_SRC" "$SKILL_DST"
echo "✓ 스킬 심링크: $SKILL_DST -> $SKILL_SRC"

# ── ② 형제 고객 repo 확인 (customers.json의 local = repo 루트 기준 상대경로) ──
echo "▶ 고객 repo(형제) 확인:"
node -e "const c=require('$ROOT/ops/customers.json'),p=require('path'),fs=require('fs');for(const k in c){const d=p.resolve('$ROOT',c[k].local);console.log('  '+(fs.existsSync(d)?'✓':'✗ 없음 → gh repo clone '+c[k].repo)+'  '+k+' -> '+d)}"

# ── ③ 도구 점검 ──
echo "▶ 도구:"
for t in gh node npm npx cwebp sips; do
  printf "  %-6s " "$t:"
  command -v "$t" >/dev/null && echo "$(command -v "$t")" || echo "✗ 없음 (gh·node·webp → brew install / sips는 macOS 기본)"
done

# ── ④ 인증 점검 ──
echo "▶ 인증:"
gh auth status >/dev/null 2>&1 && echo "  ✓ gh 로그인됨" || echo "  ✗ gh 미로그인 → gh auth login"
[ -f "$HOME/Library/Preferences/.wrangler/config/default.toml" ] && echo "  ✓ wrangler 인증 있음" || echo "  ✗ wrangler 미인증 → npx wrangler login"

echo ""
echo "✅ 점검 끝. ✗ 항목이 있으면 위 안내대로 보완하면 이 기기에서도 /apply-edit 전 과정이 동작한다."
