# ops 운영 학습 노트

> Phase 2 v1 구현·운영 중 배운 것. 새 고객 온보딩·디버깅 시 참고.

## 구현 중 발견 (2026-06-15)

- **repo 경로의 `&`**: `3&D` 경로는 셸에서 반드시 큰따옴표로 감싼다. 안 그러면 `&`가 백그라운드 연산자로 해석돼 exit 127. 모든 스크립트 호출에 적용. (SKILL.md에 경고 명시됨)
- **가드레일은 미커밋 변경도 검사해야 함**: `git diff base...HEAD`만 보면 commit 전 working tree 편집을 못 잡아 무의미하게 통과(vacuous pass). check-content-only.sh는 committed+staged+unstaged+untracked 전부 검사하도록 수정됨.
- **Cloudflare Pages 프리뷰 alias는 28자 제한**: 브랜치명을 normalize(소문자, `/`·기호→`-`)한 결과가 28자를 넘으면 잘려서 추측한 URL이 404. 프리뷰 URL은 **절대 브랜치명으로 조립하지 말고** `get-preview-url.sh`로 Cloudflare API에서 실제 alias를 조회한다.
- **한글·공백 파일명**: 고객이 `제품 사진.jpg`처럼 보냄. r2-upload.sh가 ASCII-safe로 sanitize, 영숫자가 하나도 없으면 `asset`으로 fallback.

## 구현 중 발견 (2026-06-16, grabis 전체 에셋 분리)

- **r2-upload.sh 업스케일 버그 → 수정**: 기존 `cwebp -resize 1600 0` 무조건 적용 → 47px 아이콘·작은 로고를 1600px로 강제 업스케일(흐려짐·용량↑). `sips -g pixelWidth`로 원본폭 측정해 **1600px 초과일 때만 다운스케일**하도록 변경. 작은 아이콘·로고도 안전하게 R2 가능.
- **정규식 char-class가 한글-괄호 파일명을 누락**: 참조 수집 regex `/(img|...)/[^"')...]+\.(ext)`의 `)` 제외 때문에 `(주)그래비스_자사양식.doc` 경로가 `(` 직후 `)`에서 끊겨 매칭 실패 → R2 업로드 누락. 파일명에 `()` 들어가면 별도 처리. (이번엔 수동 업로드로 보강)
- **next/image + `output:'export'` + `unoptimized:true`**: 원격 R2 URL을 remotePatterns 설정 없이 그대로 `<img src>`로 출력 → 정적 export에서 R2 이미지 동작에 추가 설정 불필요.
- **CSS 배경 이미지의 content화**: CSS는 JSON을 import 못 함. page-hero 배너는 컴포넌트에서 인라인 `style` backgroundImage로, `::before` 의사요소(홈 product 워터마크)·중첩 셀렉터(contact 카드)는 **CSS 변수(`--var`)를 요소에 인라인 주입**하고 CSS는 `var(--var)` 참조로 변경. 이러면 배경도 content/ 교체로 바뀐다.

## 알려진 한계 (v1)

- **grabis member 페이지 CEO 약력·수상 *텍스트*는 content/ 미분리**: `app/company/member/page.tsx`가 자체 하드코딩 배열로 텍스트 렌더 → CEO 약력·수상 *문구* 수정은 티어③(코드작업). (단, 2026-06-16부터 CEO *사진* 등 모든 **이미지**는 content/로 분리돼 이미지 교체는 티어①.)
- **goddmenz는 아직 rebuild-pending**: 정적 HTML 1파일 + GitHub 미연동. 별도 재구축 계획 필요(표준 스택 이전 + 동영상 R2 이관 + Pages GitHub 연동).

## 실전 처리 기록

> (실제 카톡 요청을 처리할 때마다 여기에 1줄씩: 날짜 · 고객 · 요청 · 소요시간 · 문제점)

- **2026-06-15 · grabis · 영문 extraction 데이터 이미지 교체**: 이미지가 `content/`가 아닌 코드(ProductPageLayout.tsx)+`public/`에 하드코딩 → 자동 /apply-edit 불가, 수동 코드수정으로 처리. 새 영문 통합본을 webp(2400px,122KB)로 변환→public/img/product/, T 컴포넌트 언어분기로 영문만 1장 교체(한글 2장 유지). 빌드·브라우저 검증(lang=en시 product_data_en.webp 렌더) 통과. PR #3. **교훈: 제품 데이터/SEM 이미지류가 content/ 미분리라 "이미지 교체"라는 흔한 티어① 요청이 자동화 안 됨 → 추후 EXTRACTION_DATA_IMAGES 등을 content/로 분리 필요.**
- **2026-06-16 · grabis · 전체 이미지 에셋 content/ 분리 + R2 이관**(위 교훈 해소). 코드·CSS 하드코딩 이미지 0건, 실물 바이너리 102개를 R2로 이관·git에서 public 미디어 전부 제거. 신규 `content/sections/{product-detail,ngs,company,careers}.json` + `site.json` assets 블록. 빌드 42/42 통과, 라이브 프리뷰(전 페이지 로컬참조 0·R2 200·OG webp) 검증. 계획: `webmanager/plans/2026-06-16-grabis-content-asset-separation.md`. PR #4(grabis-web). **이제 grabis 이미지 교체는 content/만 수정하는 티어① /apply-edit로 처리 가능.**
- **2026-06-17 · grabis · 영문 extraction 데이터 이미지 교체 (첫 엔드투엔드 티어① 실전, 소요 ~수분)**: `/apply-edit`로 새 이미지 R2 업로드+`content/sections/product-detail.json` dataImageEn 교체→PR→폰 프리뷰 확인→merge→grabis.co.kr 자동배포까지 전 과정 첫 검증. 분리 PR(#4)이 아직 미머지라 base를 PR 브랜치로 잡아 #4에 포함(스택 PR·중복 diff 회피). 크롭으로 비율 바뀌어 컨테이너 `aspect-[]`도 함께 조정(이 PR이 코드 수정 중이라 가능). **merge는 이번엔 폰에서 했지만 이 세션(gh)에서도 가능 — 사람 게이트는 채널 무관, apply-edit 자동 흐름만 self-merge 금지.**
