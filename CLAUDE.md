# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> 이 repo는 **사이트 코드 + webmanager 사업 운영 허브**다. 사업 맥락·기획·고객 수정 파이프라인(ops)은 이 문서가 아니라 아래를 참조:
> - `docs/business-and-ops.md` — webmanager 사업 개요 + ops 도구 + 현재 상태 (세션 시작 시 필독)
> - `ops/` — 고객 사이트 수정 엔진(레지스트리·`/apply-edit` 스킬·스크립트). 새 기기는 `bash ops/setup-machine.sh` 1회.
> - `docs/artifacts/`, `docs/plans/` — 제품·가격 설계 및 실행 계획.

## Commands

- `npm run dev` — Start development server
- `npm run build` — Production build with static export (outputs to `out/`)
- `npm run lint` — Run ESLint

## Architecture

This is a **static landing page** for "WebManager" (webmanager.co.kr) — a **단일 상품 랜딩**이다. 파는 것은 **홈페이지 AI 안내 위젯(가이드 위젯)** 하나뿐: 사업자 홈페이지에 스크립트 한 줄을 넣으면 방문자가 자주 묻는 질문에 미리 작성한 답으로 응답하고, 답이 있는 페이지로 데려다주는 위젯. Next.js 16 App Router + `output: "export"` → Cloudflare Pages.

### Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 via `@tailwindcss/postcss` (CSS-based config, no `tailwind.config`)
- **GSAP 3** + `@gsap/react` — ScrollTrigger for scroll animations, useGSAP hook for React integration
- **shadcn/ui** (new-york style) — `components.json` configured, CLI-ready (`npx shadcn@latest add <component>`)
- `class-variance-authority` (CVA) for component variants
- `clsx` + `tailwind-merge` via `cn()` utility (`src/lib/utils.ts`)
- `tw-animate-css` for shadcn/ui animation primitives
- lucide-react for SVG icons
- Noto Sans KR (Korean font via `next/font/google`)
- **Vitest 3** (+ happy-dom) — `tests/`, `npm test`. lib·hooks·scripts·Pages Function 단위 테스트.
- **Cloudflare Pages Functions** — `functions/api/notify.ts` (Telegram 알림 서버 사이드). 별도 `functions/tsconfig.json` + `@cloudflare/workers-types`.

### Component Structure

- **`src/app/page.tsx`** — Single page composing all sections + JSON-LD. No routing.
- **`src/components/sections/`** — **7 sections**: `Hero` → `Why`(#why) → `Showcase`(#showcase) → `How`(#how) → `Pricing`(#pricing) → `Trial`(#trial) → `FAQ`(#faq, 끝에 Footer 포함).
- **`src/components/`**
  - `LeadCapture` — 최초 페인트에 `?ref/utm_*` 를 sessionStorage 에 저장하는 렌더 없는 클라이언트 컴포넌트.
  - `layout/` — `Header` (fixed top, dark glass), `Footer` (FAQ 섹션 하단에 embed, 회사 법정표기 포함).
  - `ui/` — `Button` (CVA), `Container` (forwardRef, w-full), `ScrollReveal` (GSAP + ScrollTrigger), `HeroTitle` (GSAP char stagger), `FeatureCard` (Why·How 공용 카드), `DotNav`, `ScrollDown`, `Logo`, `TrialForm` (체험 신청 폼). 새 shadcn 컴포넌트도 여기에 CLI 로 추가.
- **`src/hooks/`** — `useFormSubmit` (Web3Forms + `/api/notify` 2단 제출), `useSearchParam`.
- **`src/lib/`**
  - `pricing.ts` — **가격·기간 단일 출처**. `content/pricing.json` 을 읽어 `TRIAL_DAYS`/`TRIAL_CATALOG_MAX`/`WIDGET_MONTHLY`/`WIDGET_ANNUAL`/`WIDGET_CATALOG` + `won()`/`manwon()` 포맷터 제공. **어디서도 숫자를 다시 쓰지 않는다.**
  - `lead.ts` — ref/utm 파싱·저장·복원. `validation.ts` — 도메인·연락처 검증(`https://` 자동 보정). `widgetConfig.ts` — 랜딩 자체 위젯 로더 상수. `formConfig.ts` — Web3Forms 공개 키 + `KAKAO_URL`. `formStyles.ts` — 폼 입력 공용 클래스. `utils.ts` — `cn()`.
- **`content/`** — 코드가 아닌 사실(fact)만 사는 곳. `pricing.json` (가격), `company.json` (상호·대표·사업자등록번호·주소 등 법정표기), `guide.json` (랜딩 자체 위젯 카탈로그 원본).
- **`scripts/`** — `sync-guide.mjs` (`content/guide.json` → `{{price}}` 치환 → `public/guide.json`, `predev`/`build` 에서 실행), `check-guide-if-present.mjs` (postbuild 검증: 앵커가 실제 `out/` 에 있는지).
- **`functions/api/notify.ts`** — Pages Function. `{kind, fields}` POST 를 받아 서버에서 Telegram 호출. IP 당 분당 5회 제한.
- **`tests/`** — Vitest. `lib/`·`scripts/`·`functions/` 단위 테스트 (65개).

### Key Patterns

- **Scroll snap (desktop only)**: Mobile uses `scroll-snap-type: y proximity` (natural scroll), desktop (`md:` 이상) uses `mandatory`. Configured in `@layer base` in globals.css.
- **Responsive section heights**: `min-h-dvh md:h-dvh md:snap-start` — mobile gets natural height with `py-16`, desktop gets fixed viewport height with snap.
- **GSAP animations**: `ScrollReveal` component wraps content with GSAP ScrollTrigger (once: true, start: "top 85%"). Respects `prefers-reduced-motion`. Mobile: shortened duration (0.5s) and reduced y-offset. `HeroTitle` uses GSAP for char-by-char stagger (mobile: faster stagger, smaller y). Hero has a GSAP timeline for sequential element entrance.
- **Mobile-first responsive**: 3-step typography scaling (`text-2xl sm:text-3xl md:text-4xl`). Grids use `sm:grid-cols-2 lg:grid-cols-3` for tablet intermediate. Touch targets min 44px. `@media(hover:hover)` for hover-only effects.
- **Client vs Server**: 기본은 서버 컴포넌트. `"use client"` 는 `Hero`, `Pricing`, `FAQ`, `LeadCapture`, `DotNav`, `HeroTitle`, `ScrollReveal`, `TrialForm`, `useFormSubmit`, `useSearchParam` 뿐.
- **Design tokens**: Dark cinematic palette in `:root` → `@theme inline`. Background: `#0a0a0a`, foreground: `#fafafa`, cards: semi-transparent `white/[0.04]`, borders: `white/[0.06]`.
  - **Brand colors**: `brand-accent` (blue, `#2563eb`), `cta` (blue, `#2563eb`), `surface` (dark, `#0f0f0f`).
- **체험 신청 폼 (`TrialForm`, #trial)** — 사이트에 폼은 이것 하나뿐이다. `useFormSubmit` 이 ① Web3Forms 로 메일(기록의 원본) ② `/api/notify` Pages Function 으로 Telegram 알림, 2단으로 보낸다. **Telegram 봇 토큰·chat_id 는 Pages 환경변수에만 있고 번들에는 절대 들어가지 않는다** (Web3Forms 액세스 키는 설계상 공개값이라 `formConfig.ts` 에 남는다). honeypot + 클라이언트 검증(`validation.ts`) + hidden `ref`/`utm_*`/`landing_path` 동봉.
- **랜딩 자체 위젯 (도그푸딩 = 데모)**: `layout.tsx` 가 `<Script strategy="afterInteractive" data-site="webmanager" data-guide="/guide.json">` 로 실제 판매 중인 위젯을 이 페이지에 붙인다(상수는 `widgetConfig.ts`). 카탈로그 원본은 `content/guide.json` → `sync-guide.mjs` 가 `{{price}}` 를 치환해 `public/guide.json` 생성(**`public/guide.json` 은 빌드 산출물이라 커밋 대상이 아니다**), postbuild 가 앵커 유효성 검증. 위젯 칩이 가리키는 섹션 id 에는 헤더 높이만큼 `scroll-mt-24` 가 있어야 스냅 스크롤에서 제목이 잘리지 않는다.
- **Static export**: `images.unoptimized: true` in next.config.ts. No Next API routes — 서버가 필요한 일은 Pages Functions (`functions/`) 로.

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

## Design Direction

> 상세 설계는 `docs/artifacts/07_guide-widget-product-and-landing-v2.md` (§1~§4, §7).

### 비즈니스 모델 — 위젯 단일 상품
- **공개 메시지는 하나**: "홈페이지에 AI 안내 위젯을 달아드립니다. 한 줄 설치, 월 2.9만."
- **상품 실체**: 미리 작성해 둔 질문·답 카탈로그로만 동작해 방문자를 답이 있는 페이지로 **안내**하는 위젯. **챗봇이 아니다 — 런타임 LLM 호출 0, 그래서 없는 말을 지어낼 가능성 자체가 없다.** 스크립트 1줄(11KB, 페이지 로드 후 실행, 사이트 코드와 격리)이라 워드프레스·아임웹·카페24·윅스·직접 만든 사이트 어디든 붙는다.
- **가격**: **월 29,000원 / 연 290,000원(2개월 무료)**. 정액, **티어 없음**, 월 결제는 **약정 없음**. (VAT 별도) 숫자는 전부 `content/pricing.json` → `src/lib/pricing.ts`.
- **무료 체험**: **30일**, 카드 등록·약정 없음. 카탈로그 최대 **20개**(우리가 직접 작성). 종료 시 리포트 1회. **30일 후 버튼만 자동으로 사라지고 사이트에는 아무 영향이 없다** (종료 7일 전 안내). 유료 전환 시 카탈로그 30개 + 매월 갱신 요청 무제한 + 매월 리포트.
- **하지 않는 것**: 홈페이지 제작·리뉴얼·기능 개발. FAQ 에 명시("아니요, 위젯만 합니다").
- **관리 구독은 내부 가격표로만 존재하고 랜딩에는 노출하지 않는다** — 체험 신청 폼의 "지금 홈페이지 관리는 어떻게 하고 계세요?" 답을 보고 **온보딩 통화에서만** 제안한다. (사업이 다각화돼 보이면 신뢰가 아니라 혼란을 산다.)

### 타겟 고객
홈페이지는 있는데 그 홈페이지가 문의로 이어지지 않는 **IT 비전문 사업자**. 설득 대상은 "사이트를 고치고 싶은 사람"이 아니라 "방문자가 그냥 나가는 게 아까운 사람"이다.

### 핵심 문제 → 위젯이 하는 일 (Why 섹션 3카드)
| 방문자에게 벌어지는 일 | 위젯이 하는 일 |
|---|---|
| 전화번호를 찾다가 그냥 나간다 | 물어보면 바로 답하고 연락처를 띄운다 |
| 가격 페이지가 어디 있는지 모른다 | 답이 있는 페이지로 데려다준다 |
| 문의는 하고 싶은데 폼까지 가지 않는다 | 기존 문의 폼·전화로 프리필해서 연결한다 |

### 유입 퍼널
고객 사이트 위젯 푸터("이런 안내 위젯, 우리 사이트에도 →") → `webmanager.co.kr/?ref=grabis&utm_source=guide-widget&utm_medium=cta#trial` → `LeadCapture` 가 sessionStorage 에 저장 → `#trial` 폼 제출 시 hidden 으로 동봉 → 메일·Telegram 에 유입 출처가 그대로 찍힌다. (분석툴 없음, YAGNI.)

### 디자인 원칙
- **Dark Cinematic, 절제된 화려함**: 어두운 배경 + 큰 타이포그래피 + 넓은 여백 + 단일 accent blue. 과시가 아닌 "이 정도는 기본"이라는 여유. 효과 하나하나가 의도적.
- **GSAP 스크롤 애니메이션**: ScrollTrigger 기반 등장 애니메이션, Hero char-by-char stagger. 모든 애니메이션은 once: true, 0.6~0.8s duration, power3.out ease.
- **FeatureCard**: Why/How 섹션이 공유하는 카드 컴포넌트. `bg-white/[0.02]` + glow border + glassmorphism 아이콘. hover 시 `scale-105`. 3칼럼 그리드 `sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto`.
- **Glass card UI**: Pricing 은 2장(무료 체험 / 가이드 위젯)뿐. 유료 카드에만 animated gradient border. 연/월 토글의 **기본값은 월 결제** — Hero 가 약속한 "월 2.9만"과 처음 보이는 숫자가 같아야 한다. "2개월 무료" 배지는 선택 여부와 무관하게 항상 노출.
- **이모지 금지, SVG 아이콘 사용**: 모든 아이콘은 lucide-react SVG로 통일.
- **CTA 블루톤 통일**: brand blue(`#2563eb`) fill 버튼 + glow shadow.
- **타겟 고객은 IT 비전문 사업자**: 기술 용어를 최소화하고, 문장은 쉽고 직관적으로.

## SEO

- **Metadata**: `layout.tsx`에 title, description, keywords, OG, Twitter Card, canonical URL, robots, 네이버 인증. title·description 의 가격/기간도 `pricing.ts` 에서 온다.
- **JSON-LD**: `page.tsx`에 **WebSite + Product** 구조화 데이터 (`offers` 월/연 2건, `image` = OG 이미지). 가격은 `pricing.ts` 에서만.
- **sitemap.xml / robots.txt**: `public/`에 정적 파일로 배치 (static export 제약). `robots.txt` 는 구 관리 상품 카탈로그(`/catalog/`)를 색인에서 제외한다 — 파일은 공유된 링크 때문에 남겨 두되 검색에는 노출하지 않는다.
- **Favicon**: `src/app/icon.svg` — 원형 배경 + WM 지그재그 로고 SVG 파비콘.
- **OG Image**: `src/app/opengraph-image.tsx` — 빌드 타임 자동 생성 (1200x630 PNG, `out/opengraph-image`, 확장자 없음). 카피는 "WebManager / 홈페이지 AI 안내 위젯 / 한 줄 설치 · 월 2.9만원". Noto Sans KR 을 Google Fonts API 에서 **필요 글자만** 받으므로, 글리프 목록은 실제 렌더 문자열에서 자동으로 뽑는다(빠진 글자는 두부로 찍힌다). `dynamic: "force-static"` 필수 (static export 호환).

## Logo Assets

- `public/logo.svg` / `logo.png` — 원형 아이콘 + 워드마크 (가로형)
- `public/logo-icon.png` — 원형 아이콘만
- `public/logo_rectangular.svg` / `logo_rectangular.png` — 라운드 사각형 아이콘 + 워드마크
- `public/logo-icon_rectangular.svg` / `logo-icon_rectangular.png` — 라운드 사각형 아이콘만 (검정 배경 꽉 참)
- `src/components/ui/Logo.tsx` — 헤더용 인라인 SVG 컴포넌트 (라운드 사각형)

## 백로그

랜딩 v2 (2026-08-27) 이후 **아직 열려 있는** 항목만. 삭제된 컴포넌트(Problem/Solution/Process/Portfolio/CTA/ContactForm)에 걸려 있던 옛 점검 항목은 함께 정리했다.

- [ ] **Google Search Console 등록** — HTML 태그 방식 소유 확인 → 인증 코드를 `layout.tsx` 의 `verification.google` 에 추가 → sitemap 제출.
- [ ] **Google Analytics 4** — 전환 추적(체험 폼 제출, CTA 클릭). 지금은 분석툴이 없다.
- [ ] **통신판매업 신고번호 기재** — 신고 후 `content/company.json` 의 `ecommerceRegNo` 만 채우면 푸터에 자동 노출된다.
- [ ] **Showcase 익명 스크린샷** — 적용 사이트 실제 화면(로고·상호 블러) 확보 후 교체.
- [ ] **ScrollReveal delay 통일** — 섹션마다 0.08/0.1/0.15 가 섞여 있다.
- [ ] **GSAP cleanup** — `ScrollReveal`·`HeroTitle`·`Hero` 에 revert/kill 없음 (메모리 누수 가능).
- [ ] **OG Image 폰트 로딩 에러 핸들링** — Google Fonts fetch 실패 시 빈 ArrayBuffer 로 조용히 넘어간다.
- [ ] **블로그/콘텐츠 SEO** — 위젯·홈페이지 문의 전환 주제 콘텐츠 확장 (장기).

## 배포 인프라

- **호스팅**: Cloudflare Pages (GitHub 연동 자동 배포)
- **도메인**: webmanager.co.kr (Cloudflare DNS)
- **자동 배포**: `main` 브랜치 push → Cloudflare 자동 빌드 + 배포
  - Build command: `npm run build`
  - Output directory: `out`
- **주의**: 레포 이름 변경 시 Cloudflare Pages Git 연결이 끊어질 수 있음. 프로젝트 삭제 후 재생성 필요 (2026-03-03 경험).

## 작업 이력

1. ~~**모바일 최적화** (완료)~~ — clamp() 타이포, 그리드 중간 브레이크포인트, GSAP 모바일 최적화, 터치 타겟 44px+, prefers-reduced-motion 지원
2. ~~**OG Image** (완료)~~ — 빌드 타임 자동 생성, 카카오톡/SNS 링크 미리보기 대응
3. ~~**Contact Form** (완료)~~ — Web3Forms + Telegram 알림, CTA 센터 폼 레이아웃, 카카오톡 보조 링크
4. ~~**Cloudflare Pages 재연결** (완료, 2026-03-03)~~ — 레포 이름 변경으로 Git 연결 끊어짐 → 프로젝트 삭제 후 재생성
5. ~~**사이트 점검 HIGH 항목** (완료, 2026-03-03)~~ — Footer 연도 동적화, sitemap lastmod, JSON-LD 보강, 네이버 인증 메타태그
6. ~~**네이버 서치어드바이저 등록** (완료, 2026-03-03)~~ — 소유 확인 + sitemap 제출
7. ~~**랜딩페이지 리브랜딩** (완료, 2026-03-05)~~ — 제작사→관리자 피벗. Hero/Problem/Solution/Process/FAQ/CTA 카피 교체, Pricing 3티어+연간/월간 토글, DotNav 한글화, JSON-LD/메타데이터 업데이트
8. ~~**랜딩 v2 — 위젯 단일 상품 7섹션** (완료, 2026-08-27)~~ — Telegram 토큰을 `/api/notify` Pages Function 으로 이전, `pricing.ts` 가격 단일 출처, 7섹션(Hero/Why/Showcase/How/Pricing/Trial/FAQ) 교체, `TrialForm` + 리드 캡처, 랜딩 자체 위젯 장착(도그푸딩), 푸터 법정표기, 메타·OG·JSON-LD(Product) 위젯 기준으로 교체

## 다음 작업

1. **랜딩 v2 PR·QA** — 실기기 모바일 확인, 위젯 앵커 착지(스냅), 폼 실제 수신 1회, Lighthouse 전후
2. **Google Search Console 등록** — 인증 코드 받아서 `layout.tsx`에 추가 + sitemap 제출
3. **Google Analytics 4 설정** — 체험 폼 제출·CTA 클릭 전환 추적
4. **Showcase 익명 스크린샷 교체** — 적용 사이트 실제 화면(로고·상호 블러)
5. **통신판매업 신고번호 기재** — 신고 후 `content/company.json` 의 `ecommerceRegNo` 채우기
