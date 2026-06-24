# Phase 2 v1 구현 계획 (GraBis 우선)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** GraBis 사이트에 콘텐츠 분리 컨벤션을 적용하고, `/apply-edit` 스킬 + R2 에셋 파이프라인 + PR 사람게이트로 "카톡 요청 → AI 수정 → 프리뷰 승인 → 배포" 흐름을 엔드투엔드로 완성한다.

**Architecture:** 고객당 repo 1개 + Cloudflare Pages 브랜치 프리뷰 + GitHub PR merge = 승인. AI는 `content/` 폴더만 편집(기계적 가드레일). 공용 도구(스킬·스크립트·고객 레지스트리)는 3&D 기획 repo의 `webmanager/ops/`에 버전 관리하고 스킬은 `~/.claude/skills`에 심링크.

**Tech Stack:** Next.js 14 (grabis-web, `output: 'export'`), Claude Code 스킬, bash, wrangler (R2), GitHub CLI.

**스펙:** `webmanager/artifacts/05_phase2-v1-design.md`

**검증된 전제 (2026-06-10 확인):**
- grabis-web: GitHub 연동된 Pages 프로젝트(`grabis-web`, repo_id 일치), preview = all branches, build = `npm run build` → `out/`, production branch = `main`. 도메인 grabis.co.kr.
- grabis-web 로컬 클론: `/Users/tm_lab/Desktop/주식회사쓰리앤디/grabis-web`
- `lib/data.ts`(391줄, 26개 export)에 콘텐츠가 하드코딩. `content/posts/*.mdx` 13개는 이미 컨벤션 부합. `tsconfig.json`에 `resolveJsonModule: true` 이미 설정됨.
- goddmenz-web: 정적 HTML 1파일 + GitHub 미연동 → **이 계획 범위 밖** (별도 "재구축 계획"으로, 이 계획 완료 후 작성).
- Cloudflare 계정 `13237a3e8ed33b74e2737b57ab04505d`, zone `webmanager.co.kr` = `c16d1bbb56e02caf7acd67408c14a91f`. wrangler OAuth 로그인됨 (R2 스코프는 Task 6에서 확인).

---

## Task 1: ops 뼈대 + 고객 레지스트리

**Files:**
- Create: `webmanager/ops/customers.json` (3&D repo)
- Create: `webmanager/ops/scripts/` , `webmanager/ops/skills/` 디렉토리

- [ ] **Step 1: 디렉토리 + customers.json 작성**

```bash
cd "/Users/tm_lab/Desktop/주식회사쓰리앤디/3&D"
mkdir -p webmanager/ops/scripts webmanager/ops/skills
```

`webmanager/ops/customers.json`:
```json
{
  "grabis": {
    "name": "(주)그래비스",
    "owner": "진엽이형",
    "repo": "gyujin0113/grabis-web",
    "local": "/Users/tm_lab/Desktop/주식회사쓰리앤디/grabis-web",
    "production": "https://grabis.co.kr",
    "pagesProject": "grabis-web",
    "previewPattern": "https://{branch}.grabis.pages.dev",
    "contentDirs": ["content/"],
    "plan": "파운딩 5만/월",
    "status": "active"
  },
  "goddmenz": {
    "name": "G'ODD MENZ HAIR",
    "owner": "미용실 원장님",
    "repo": "gyujin0113/goddmenz-web",
    "local": "/Users/tm_lab/Desktop/주식회사쓰리앤디/goddmenz-web",
    "production": "https://goddmenz.co.kr",
    "pagesProject": "goddmenz-web",
    "previewPattern": null,
    "contentDirs": [],
    "plan": "파운딩 5만/월",
    "status": "rebuild-pending"
  }
}
```

(`previewPattern`의 `{branch}`: 브랜치명에서 `/`→`-` 치환, 소문자, 28자 절단 — Cloudflare 규칙)

- [ ] **Step 2: 검증 + 커밋**

```bash
python3 -c "import json; json.load(open('webmanager/ops/customers.json')); print('OK')"
git add webmanager/ops/ && git commit -m "feat(ops): 고객 레지스트리 + ops 뼈대"
```

---

## Task 2: grabis-web 콘텐츠 분리 (lib/data.ts → content/*.json)

**Files (grabis-web repo):**
- Create: `content/site.json`, `content/sections/{products,slides,press,history,partners,members,contact-options}.json`
- Modify: `lib/data.ts` (콘텐츠 export를 JSON 재수출로 교체. **import하는 20개 파일은 무변경**)

**원칙:** 콘텐츠(고객이 바꿀 값) → JSON으로 이동. UI 구조/동작(라우팅·탭·타이밍) → data.ts에 잔류.

| 이동 (→ JSON) | 잔류 (data.ts) |
|---|---|
| `COMPANY_INFO`, `FOOTER_INFO` → `site.json` | `MENU_ITEMS` (라우팅=티어③ 영역) |
| `PRODUCTS` → `sections/products.json` | `SECTION_HASHES`, `SECTION_NAMES` |
| `MAIN_SLIDES`, `PRODUCT_SLIDES` → `sections/slides.json` | `SLIDE_DURATION`, `LIGHT_SECTIONS` |
| `PRESS_DATA` → `sections/press.json` | `PRESS_TABS`, `PARTNER_CATEGORIES` |
| `HISTORY` → `sections/history.json` | `*_TABS_KO`/`*_TABS_EN` (route+label) |
| `PARTNERS` → `sections/partners.json` | `MEMBERS` (= `[CEO_PROFILE]` 파생) |
| `CEO_PROFILE` → `sections/members.json` | |
| `PRODUCT/INVESTMENT/PARTNERSHIP_SUBJECT_OPTIONS` → `sections/contact-options.json` | |

- [ ] **Step 1: 리팩토링 전 기준 빌드 스냅샷**

```bash
cd "/Users/tm_lab/Desktop/주식회사쓰리앤디/grabis-web"
git checkout main && git pull
npm ci && npm run build
cp -r out /tmp/grabis-out-before
```
Expected: 빌드 성공, `/tmp/grabis-out-before` 생성.

- [ ] **Step 2: 작업 브랜치 생성**

```bash
git checkout -b refactor/content-extraction
```

- [ ] **Step 3: JSON 파일 생성 (기계적 이동)**

각 대상 export의 값을 `lib/data.ts`에서 **그대로 복사**해 JSON으로 변환 (TS→JSON: 키 따옴표, 후행 콤마 제거, `as const` 제거). 예 — `content/sections/products.json`:

```json
{
  "products": [
    {
      "slug": "ngs",
      "label": "PRODUCT 01",
      "name": "NGS Cleanup Beads",
      "description": "차세대 염기서열 분석(NGS)을 위한 DNA/RNA 정제용 자성 비드입니다. 높은 순도와 수율로 안정적인 NGS 라이브러리 준비를 지원합니다.",
      "features": ["높은 DNA/RNA 회수율", "우수한 재현성", "간편한 프로토콜", "NGS 라이브러리 준비에 최적화"],
      "image": "/img/product/2505220001_M1.jpg"
    }
  ]
}
```
(나머지 항목도 data.ts의 값 전체를 그대로. 다른 파일도 같은 패턴: `site.json`은 `{"company": {...}, "footer": {...}}`, `slides.json`은 `{"main": [...], "product": [...]}`, `contact-options.json`은 `{"product": [...], "investment": [...], "partnership": [...]}`. 단일 객체인 `members.json`은 `{"ceo": {...}}`)

- [ ] **Step 4: lib/data.ts를 재수출로 교체**

파일 상단에 import 추가, 이동 대상 정의를 삭제하고 재수출로 대체. **export 이름과 타입 주석은 그대로 유지**:

```ts
import siteJson from '@/content/site.json';
import productsJson from '@/content/sections/products.json';
import slidesJson from '@/content/sections/slides.json';
import pressJson from '@/content/sections/press.json';
import historyJson from '@/content/sections/history.json';
import partnersJson from '@/content/sections/partners.json';
import membersJson from '@/content/sections/members.json';
import contactOptionsJson from '@/content/sections/contact-options.json';

export const COMPANY_INFO = siteJson.company;
export const FOOTER_INFO = siteJson.footer;
export const PRODUCTS = productsJson.products;
export const MAIN_SLIDES = slidesJson.main;
export const PRODUCT_SLIDES = slidesJson.product;
export const PRESS_DATA: Record<string, Array<{ id: number; date: string; title: string; image: string }>> = pressJson;
export const HISTORY = historyJson.history;
export const PARTNERS = partnersJson.partners;
export const CEO_PROFILE = membersJson.ceo;
export const MEMBERS = [CEO_PROFILE];
export const PRODUCT_SUBJECT_OPTIONS = contactOptionsJson.product;
export const INVESTMENT_SUBJECT_OPTIONS = contactOptionsJson.investment;
export const PARTNERSHIP_SUBJECT_OPTIONS = contactOptionsJson.partnership;
// MENU_ITEMS, SECTION_HASHES, SECTION_NAMES, SLIDE_DURATION, LIGHT_SECTIONS,
// PRESS_TABS, PARTNER_CATEGORIES, *_TABS_* 는 기존 정의 그대로 잔류
```

주의: JSON import는 리터럴 타입이 넓어짐(string 등). `as const`에 의존하던 소비처가 있어 tsc가 불평하면 해당 export에 기존 타입을 명시 (`as const` 객체였던 `PARTNER_CATEGORIES`는 어차피 잔류).

- [ ] **Step 5: 빌드 + 무손상 검증**

```bash
npm run build
cp -r out /tmp/grabis-out-after
# 렌더된 텍스트 비교 (청크 해시 차이 무시, 보이는 내용만)
python3 - <<'EOF'
import pathlib, re, sys
def texts(root):
    out = {}
    for p in sorted(pathlib.Path(root).rglob('*.html')):
        h = p.read_text(encoding='utf-8', errors='ignore')
        h = re.sub(r'<script[^>]*>.*?</script>', '', h, flags=re.S)
        t = re.sub(r'<[^>]+>', ' ', h)
        out[str(p.relative_to(root))] = re.sub(r'\s+', ' ', t).strip()
    return out
a, b = texts('/tmp/grabis-out-before'), texts('/tmp/grabis-out-after')
assert a.keys() == b.keys(), f"페이지 목록 불일치: {a.keys() ^ b.keys()}"
diff = [k for k in a if a[k] != b[k]]
print("DIFF PAGES:", diff if diff else "없음 — 무손상 ✅")
sys.exit(1 if diff else 0)
EOF
```
Expected: `DIFF PAGES: 없음 — 무손상 ✅` (exit 0). 차이가 있으면 해당 페이지를 열어 원인 수정 후 재실행.

- [ ] **Step 6: PR 생성 → 프리뷰 육안 확인 → merge**

```bash
git add content/ lib/data.ts
git commit -m "refactor: 콘텐츠를 content/*.json으로 분리 (webmanager 표준 컨벤션)"
git push -u origin refactor/content-extraction
gh pr create --title "refactor: 콘텐츠 분리 (content/ 컨벤션)" --body "lib/data.ts의 콘텐츠를 content/*.json으로 이동. 화면 무변경 (렌더 텍스트 비교 통과)."
```
Pages가 단 프리뷰 URL(`refactor-content-extraction.grabis.pages.dev`)을 폰/브라우저에서 육안 확인 (메인·제품·연혁·문의 페이지) → 이상 없으면 merge. **이것이 사람게이트 메커니즘의 첫 실사용 테스트를 겸함.**

---

## Task 3: 가드레일 스크립트 (diff가 content/ 안인지 기계 검사)

**Files:**
- Create: `webmanager/ops/scripts/check-content-only.sh` (3&D repo)

- [ ] **Step 1: 스크립트 작성**

```bash
#!/usr/bin/env bash
# 사용법: check-content-only.sh <고객repo경로> [base브랜치=main]
# 현재 체크아웃된 브랜치의 변경이 content/ 안에만 있는지 검사. 위반 시 exit 1.
set -euo pipefail
cd "$1"
base="${2:-main}"
violations=$(git diff --name-only "${base}...HEAD" | grep -v '^content/' || true)
if [ -n "$violations" ]; then
  echo "❌ content/ 밖 변경 감지 — PR 생성 금지:"
  echo "$violations"
  exit 1
fi
echo "✅ content/ 내부 변경만 존재"
```

```bash
chmod +x webmanager/ops/scripts/check-content-only.sh
```

- [ ] **Step 2: 실패 케이스부터 테스트 (TDD)**

```bash
cd "/Users/tm_lab/Desktop/주식회사쓰리앤디/grabis-web"
git checkout -b test/guardrail && echo "// test" >> lib/data.ts && git commit -am "test"
"/Users/tm_lab/Desktop/주식회사쓰리앤디/3&D/webmanager/ops/scripts/check-content-only.sh" . main
```
Expected: `❌ content/ 밖 변경 감지` + exit 1.

- [ ] **Step 3: 통과 케이스 테스트**

```bash
git reset --hard main
echo '{"_test": true}' > content/_test.json && git add content/_test.json && git commit -m "test"
"/Users/tm_lab/Desktop/주식회사쓰리앤디/3&D/webmanager/ops/scripts/check-content-only.sh" . main
git checkout main && git branch -D test/guardrail
```
Expected: `✅ content/ 내부 변경만 존재` + exit 0. 테스트 브랜치 삭제 확인.

- [ ] **Step 4: 커밋**

```bash
cd "/Users/tm_lab/Desktop/주식회사쓰리앤디/3&D"
git add webmanager/ops/scripts/check-content-only.sh
git commit -m "feat(ops): content/ 가드레일 검사 스크립트"
```

---

## Task 4: /apply-edit 스킬

**Files:**
- Create: `webmanager/ops/skills/apply-edit/SKILL.md` (3&D repo)
- Create: 심링크 `~/.claude/skills/apply-edit` → 위 디렉토리

- [ ] **Step 1: SKILL.md 작성**

````markdown
---
name: apply-edit
description: webmanager 고객의 수정요청(카톡 텍스트)을 받아 content/만 수정하고 빌드 검증 후 PR을 생성한다. 사용: /apply-edit <고객slug> <요청문> [첨부파일경로...]
---

# /apply-edit — 고객 수정요청 적용

스펙: 3&D repo `webmanager/artifacts/05_phase2-v1-design.md`. 고객 정보: `webmanager/ops/customers.json`.

## 절차 (순서 엄수)

### 1. 고객 확인
`customers.json`에서 slug 조회. `status`가 `active`가 아니면 중단·보고.

### 2. 티어 판정 (04 §4 판정규칙)
> 무제한 = "이미 있는 것의 *값*을 바꾸는 것". 별도 = "없던 것을 만들거나 구조·로직을 바꾸는 것".

- 요청이 `content/` 안의 값 변경으로 해결되면 → 진행 (티어①)
- 새 페이지 틀·라우팅·기능·리디자인·이미지 제작이 필요하면 → **아무것도 수정하지 말고 중단.** 출력: "🚫 티어③ 별도견적 대상: <사유>"
- 요청이 모호("더 예쁘게" 등 주관·지정값 없음)하면 → **수정하지 말고 중단.** 출력: "❓ 고객 확인 필요" + 고객에게 되물을 질문 목록 (티어② 2회 규칙)

### 3. 브랜치 생성
고객 repo(local 경로)에서:
```bash
git checkout main && git pull && git checkout -b edit/$(date +%Y%m%d)-<짧은영문설명>
```

### 4. 수정 적용
- `content/` 안의 파일만 편집한다. **`src/`, `app/`, `components/`, `lib/` 등은 절대 수정 금지.**
- 첨부 이미지가 있으면: `webmanager/ops/scripts/r2-upload.sh <slug> <파일>` 실행 → 출력된 URL을 콘텐츠에 참조로 삽입. 업로드 실패 시 전체 중단.
- 공지/블로그 추가는 `content/posts/`에 새 `.mdx` 1개 (기존 파일의 frontmatter 형식 복사).

### 5. 검증 (둘 다 통과해야 PR)
```bash
npm run build   # 실패 시: 브랜치 폐기(git checkout main && git branch -D <브랜치>), 원인 보고, PR 금지
<3&D>/webmanager/ops/scripts/check-content-only.sh <고객repo경로> main   # exit 1이면 동일하게 폐기
```

### 6. PR 생성
```bash
git add content/ && git commit -m "edit: <한 줄 요약>"
git push -u origin <브랜치>
gh pr create --title "edit: <한 줄 요약>" --body "<본문>"
```
PR 본문 형식:
```
## 변경 내용
- <항목별 before → after>

## 원본 요청
> <카톡 요청문 그대로>

## 프리뷰
https://<브랜치명 / →- 치환, 소문자>.<pagesProject의 pages.dev 도메인>
(빌드 완료까지 1~2분)
```

### 7. 보고
PR URL + 프리뷰 URL 출력. merge는 사람(규진)이 폰에서. **이 스킬은 절대 merge하지 않는다.**

## 금지사항
- main에 직접 push 금지. merge 금지. `content/` 밖 수정 금지.
- 모호한 요청을 추측으로 해석 금지.
- 빌드/가드레일 실패 상태로 PR 생성 금지 (실패하면 아무것도 남기지 않는다).
````

- [ ] **Step 2: 심링크 + 등록 확인**

```bash
ln -sfn "/Users/tm_lab/Desktop/주식회사쓰리앤디/3&D/webmanager/ops/skills/apply-edit" ~/.claude/skills/apply-edit
ls -la ~/.claude/skills/apply-edit/SKILL.md
```
Expected: SKILL.md 경로 출력. (새 Claude Code 세션에서 `/apply-edit` 인식 확인)

- [ ] **Step 3: 커밋**

```bash
cd "/Users/tm_lab/Desktop/주식회사쓰리앤디/3&D"
git add webmanager/ops/skills/ && git commit -m "feat(ops): /apply-edit 스킬 v1"
```

---

## Task 5: 스킬 리허설 3종 (실고객 투입 전 드라이런)

전제: Task 2 merge 완료(컨벤션 적용된 main), Task 3·4 완료.

- [ ] **Step 1: 티어① 정상 케이스** — `/apply-edit grabis "회사 연혁에 2026년 6월 '우수기업 선정' 한 줄 추가해줘"`
  통과 기준: `content/sections/history.json`만 변경된 PR 생성 + 프리뷰 URL에서 연혁 페이지에 항목 표시. 확인 후 **PR close + 브랜치 삭제** (연습이므로 merge 안 함).
- [ ] **Step 2: 티어③ 거절 케이스** — `/apply-edit grabis "홈페이지에 온라인 결제 기능 넣어줘"`
  통과 기준: 파일 변경 0, 브랜치 0, "🚫 티어③ 별도견적 대상" 출력.
- [ ] **Step 3: 모호 케이스** — `/apply-edit grabis "메인 페이지 좀 더 세련되게 해줘"`
  통과 기준: 파일 변경 0, "❓ 고객 확인 필요" + 되물을 질문 출력.
- [ ] **Step 4: 결과 기록** — 실패한 케이스가 있으면 SKILL.md를 수정하고 해당 케이스만 재실행. 3종 모두 통과하면 3&D repo에 커밋: `git commit -am "docs(ops): 스킬 리허설 3종 통과"`

---

## Task 6: R2 에셋 파이프라인

**Files:**
- Create: `webmanager/ops/scripts/r2-upload.sh` (3&D repo)

- [ ] **Step 1: R2 권한 확인 + 버킷 생성**

```bash
npx -y wrangler r2 bucket list
```
인증 에러가 나면(현 OAuth 토큰에 R2 스코프 없을 수 있음) `npx wrangler login` 재실행(스코프 갱신) 후 재시도.

```bash
npx -y wrangler r2 bucket create webmanager-assets
```
Expected: `Created bucket webmanager-assets`.

- [ ] **Step 2: 공개 커스텀 도메인 연결**

```bash
npx -y wrangler r2 bucket domain add webmanager-assets \
  --domain assets.webmanager.co.kr \
  --zone-id c16d1bbb56e02caf7acd67408c14a91f
npx -y wrangler r2 bucket domain list webmanager-assets
```
Expected: 도메인 상태 active (전파 수 분).

- [ ] **Step 3: 업로드 스크립트 작성**

```bash
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
ext=$(echo "${base##*.}" | tr 'A-Z' 'a-z')
case "$ext" in
  jpg|jpeg|png)
    command -v cwebp >/dev/null || { echo "cwebp 필요: brew install webp" >&2; exit 1; }
    tmp="$(mktemp -d)/${name}-${hash}.webp"
    cwebp -q 85 -resize 1600 0 "$file" -o "$tmp" >/dev/null 2>&1
    key="${slug}/${year}/${name}-${hash}.webp"; up="$tmp" ;;
  *)
    key="${slug}/${year}/${name}-${hash}.${ext}"; up="$file" ;;
esac
npx -y wrangler r2 object put "${BUCKET}/${key}" --file "$up" --remote >&2
echo "${PUBLIC_BASE}/${key}"
```

```bash
chmod +x webmanager/ops/scripts/r2-upload.sh
brew list webp >/dev/null 2>&1 || brew install webp
```

- [ ] **Step 4: 엔드투엔드 검증**

```bash
# 테스트 이미지 생성 → 업로드 → 공개 URL 200 확인
python3 -c "
from struct import pack; import zlib
def chunk(t,d): return pack('>I',len(d))+t+d+pack('>I',zlib.crc32(t+d))
ihdr=chunk(b'IHDR',pack('>IIBBBBB',1,1,8,2,0,0,0)); idat=chunk(b'IDAT',zlib.compress(b'\x00\xff\x00\x00')); iend=chunk(b'IEND',b'')
open('/tmp/r2test.png','wb').write(b'\x89PNG\r\n\x1a\n'+ihdr+idat+iend)"
URL=$("/Users/tm_lab/Desktop/주식회사쓰리앤디/3&D/webmanager/ops/scripts/r2-upload.sh" grabis /tmp/r2test.png)
echo "$URL"
curl -sI "$URL" -o /dev/null -w "HTTP %{http_code}\n"
```
Expected: `https://assets.webmanager.co.kr/grabis/2026/r2test-XXXXXXXX.webp` + `HTTP 200`.

- [ ] **Step 5: 커밋**

```bash
cd "/Users/tm_lab/Desktop/주식회사쓰리앤디/3&D"
git add webmanager/ops/scripts/r2-upload.sh
git commit -m "feat(ops): R2 에셋 업로드 파이프라인"
```

---

## Task 7: 실전 엔드투엔드 1건 (외부 의존: 실제 고객 요청)

전제: Task 1~6 완료. 진엽이형(GraBis)에게서 실제 수정요청 1건 수신 시 실행.

- [ ] **Step 1:** 카톡 요청문을 `/apply-edit grabis "<요청문>" [첨부]`로 투입
- [ ] **Step 2:** 생성된 PR의 프리뷰 URL을 폰에서 확인 → 필요시 고객에게 URL 전달
- [ ] **Step 3:** 폰 GitHub 앱에서 merge → 1~2분 후 grabis.co.kr에 반영 확인
- [ ] **Step 4:** 롤백 연습 1회: `git revert HEAD && git push` → 운영 원복 확인 → 다시 revert의 revert로 재반영 (또는 연습용 수정 1건으로 별도 수행)
- [ ] **Step 5:** 처리 소요시간·문제점을 3&D repo `webmanager/ops/LEARNINGS.md`에 기록 + 커밋

---

## 범위 밖 (후속 계획)

- **goddmenz-web 재구축**: 정적 HTML → Next.js 표준 스택 (grabis 컨벤션 재사용 = 템플릿 씨앗), 동영상 4개 R2 이관, Pages GitHub 연동. → 이 계획 완료 후 별도 계획 작성.
- **신규 고객용 템플릿 repo 추출**: 두 고객 적용 완료 후.
- **v2 셀프서비스 포털**: 05 §8 진화 경로.
