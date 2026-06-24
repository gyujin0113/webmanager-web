#!/usr/bin/env bash
# 사용법: r2-upload.sh <고객slug> <파일> → 공개 URL 1줄 출력
# 이미지(jpg/png)는 webp 변환+1600px 리사이즈, 그 외(mp4/pdf/webp 등)는 원본 업로드.
set -euo pipefail
BUCKET=webmanager-assets
PUBLIC_BASE=https://assets.webmanager.co.kr
slug="$1"; file="$2"
[ -f "$file" ] || { echo "파일 없음: $file" >&2; exit 1; }
year=$(date +%Y)
hash=$(shasum -a 256 "$file" | cut -c1-8)
base=$(basename "$file"); name="${base%.*}"
name=$(echo "$name" | tr ' ' '-' | tr -dc 'a-zA-Z0-9._-' | cut -c1-40)
# 영숫자가 하나도 없으면(전부 한글·기호였던 경우) fallback
[ -z "$(printf '%s' "$name" | tr -dc 'a-zA-Z0-9')" ] && name="asset"
ext=$(echo "${base##*.}" | tr 'A-Z' 'a-z')
case "$ext" in
  jpg|jpeg|png)
    command -v cwebp >/dev/null || { echo "cwebp 필요: brew install webp" >&2; exit 1; }
    tmp_dir="$(mktemp -d)"; trap 'rm -rf "$tmp_dir"' EXIT; tmp="${tmp_dir}/${name}-${hash}.webp"
    # 원본 가로폭이 1600px 초과일 때만 다운스케일(작은 아이콘·로고 업스케일 방지). sips 실패 시 리사이즈 생략.
    width=$(sips -g pixelWidth "$file" 2>/dev/null | awk '/pixelWidth/{print $2}')
    if [ -n "$width" ] && [ "$width" -gt 1600 ]; then
      cwebp -q 85 -resize 1600 0 "$file" -o "$tmp" >/dev/null 2>&1
    else
      cwebp -q 85 "$file" -o "$tmp" >/dev/null 2>&1
    fi
    key="${slug}/${year}/${name}-${hash}.webp"; up="$tmp" ;;
  *)
    key="${slug}/${year}/${name}-${hash}.${ext}"; up="$file" ;;
esac
npx -y wrangler r2 object put "${BUCKET}/${key}" --file "$up" --remote >&2
echo "${PUBLIC_BASE}/${key}"
