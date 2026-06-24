---
name: apply-edit
description: webmanager 고객의 수정요청(카톡 텍스트)을 받아 content/만 수정하고 빌드 검증 후 PR을 생성한다. 사용: /apply-edit <고객slug> <요청문> [첨부파일경로...]
---

# /apply-edit — 고객 수정요청 적용

스펙: 이 repo `docs/artifacts/05_phase2-v1-design.md`. 고객 정보: `ops/customers.json`.

## 0. 경로 해석 (기기 독립 — 매 실행 맨 처음 1회 필수)

경로는 **기기마다 다르다**. 하드코딩하지 말고, `~/.claude/skills/apply-edit` 심링크를 역추적해 repo 위치를 알아낸다(각 기기에서 `ops/setup-machine.sh`가 이 심링크를 만든다). 아래를 실행하고, 출력된 **절대경로(ROOT/OPS/repo[...])를 이번 실행 내내 그대로** 쓴다:

```bash
SKILL_DIR="$(readlink ~/.claude/skills/apply-edit 2>/dev/null || echo ~/.claude/skills/apply-edit)"
ROOT="$(cd "$(dirname "$SKILL_DIR")/../.." && pwd)"; OPS="$ROOT/ops"
[ -f "$OPS/customers.json" ] || { echo "❌ repo 해석 실패 — setup-machine.sh로 심링크 확인"; exit 1; }
echo "ROOT=$ROOT"; echo "OPS=$OPS"
node -e "const c=require('$OPS/customers.json'),p=require('path');for(const k in c)console.log('repo['+k+']='+p.resolve('$ROOT',c[k].local))"
```

> ⚠️ **경로에 공백·한글(부모 폴더 `주식회사쓰리앤디`)이 들어간다.** 셸에서 쓸 땐 **반드시 큰따옴표로 감싼다**(안 그러면 단어 분리로 실패).
- **셸 상태는 명령 간 유지되지 않는다**(매 Bash 호출이 새 셸). 그래서 위에서 얻은 값을 환경변수로 재사용하지 말고, **그 절대경로 문자열을 이후 각 명령에 직접 박아** 쓴다.
- 이하 절차의 `<ROOT>`·`<OPS>`·`<repo[slug]>`는 위 출력값으로 치환. 스크립트 = `<OPS>/scripts/<이름>.sh`. 고객 repo = `<repo[slug]>`.

## 절차 (순서 엄수)

### 1. 고객 확인
`customers.json`에서 slug 조회. `status`가 `active`가 아니면 중단·보고.

### 2. 티어 판정 (04 §4 판정규칙)
> 무제한 = "이미 있는 것의 *값*을 바꾸는 것". 별도 = "없던 것을 만들거나 구조·로직을 바꾸는 것".

- 요청이 `content/` 안의 값 변경으로 해결되면 → 진행 (티어①)
- 새 페이지 틀·라우팅·기능·리디자인·이미지 제작이 필요하면 → **아무것도 수정하지 말고 중단.** 출력: "🚫 티어③ 별도견적 대상: <사유>"
- 요청이 모호("더 예쁘게" 등 주관·지정값 없음)하면 → **수정하지 말고 중단.** 출력: "❓ 고객 확인 필요" + 고객에게 되물을 질문 목록 (티어② 2회 규칙)

### 3. 브랜치 생성
고객 repo(`<repo[slug]>` — Step 0 출력값)에서:
```bash
cd "<repo[slug]>" && git checkout main && git pull && git checkout -b edit/$(date +%y%m%d)-<3~4단어 영문, 짧게>
```
브랜치명 규칙: `edit/YYMMDD-단어1-단어2-단어3` 형식으로 **정규화된 alias(슬래시→하이픈, 소문자)가 28자 이내**가 되도록 짧게 짓는다(보조 안전장치; 실제 URL은 Step 6에서 API로 조회). 같은 날 동일 설명 브랜치가 이미 존재하면 `-$(date +%H%M)` 접미사를 붙여 충돌 방지.

### 4. 수정 적용
- `content/` 안의 파일만 편집한다. **`src/`, `app/`, `components/`, `lib/` 등은 절대 수정 금지.**
- 첨부 이미지가 있으면 R2 업로드 실행(경로 따옴표 필수) → 출력된 URL을 콘텐츠에 참조로 삽입. 업로드 실패 시 전체 중단:
```bash
bash "<OPS>/scripts/r2-upload.sh" <slug> "<파일경로>"
```
- 공지/블로그 추가는 `content/posts/`에 새 `.mdx` 1개 (기존 파일의 frontmatter 형식 복사).

### 5. 검증 (둘 다 통과해야 PR)
```bash
cd "<repo[slug]>" && npm run build   # 실패 시: 브랜치 폐기(git checkout main && git branch -D <브랜치>), 원인 보고, PR 금지
# 가드레일 — 경로에 &가 있으므로 따옴표 필수. exit 1이면 동일하게 폐기:
bash "<OPS>/scripts/check-content-only.sh" "<repo[slug]>" <defaultBranch>
```
`defaultBranch`는 customers.json의 해당 고객 `defaultBranch` 필드값(없으면 `main`).

### 6. PR 생성
```bash
git add content/ && git commit -m "edit: <한 줄 요약>"
git push -u origin <브랜치>
```
push 후, **실제 프리뷰 URL을 Cloudflare API로 조회**한다. 배포 등록까지 수십 초 걸릴 수 있으므로 exit 1이면 10~20초 간격으로 최대 3회 재시도(총 ~1~2분):
```bash
bash "<OPS>/scripts/get-preview-url.sh" <pagesProject> <브랜치>
```
`pagesProject`는 customers.json의 `pagesProject` 필드값. 조회된 URL을 PR 본문 프리뷰 항목에 그대로 사용한다(URL 직접 조립 금지).

```bash
gh pr create --title "edit: <한 줄 요약>" --body "<본문>"
```
PR 본문 형식:
```
## 변경 내용
- <항목별 before → after>

## 원본 요청
> <카톡 요청문 그대로>

## 프리뷰
<get-preview-url.sh 로 조회한 실제 URL>
(빌드 완료까지 1~2분)
```

### 7. 보고
PR URL + 프리뷰 URL 출력. **이 apply-edit 흐름은 절대 self-merge하지 않는다** — 프리뷰 육안 확인(사람 게이트)이 선행되어야 한다.
merge(사람 게이트)는 규진이 **폰 GitHub 앱 또는 이 컴퓨터 세션** 어디서든 가능: 세션에서 규진이 "머지해"라고 명시 승인하면 `gh pr merge`로 수행해도 됨(채널 무관, 핵심은 사람의 명시 승인). 명시 승인 없이는 merge 금지.

## 금지사항
- main에 직접 push 금지. apply-edit 흐름 중 self-merge 금지(사람 명시 승인 없는 merge 금지). `content/` 밖 수정 금지.
- 모호한 요청을 추측으로 해석 금지.
- 빌드/가드레일 실패 상태로 PR 생성 금지 (실패하면 아무것도 남기지 않는다).
- 프리뷰 URL을 브랜치명에서 직접 조립 금지(alias 28자 제한 초과 시 404). 반드시 get-preview-url.sh 사용.
