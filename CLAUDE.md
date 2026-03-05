# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start development server
- `npm run build` — Production build with static export (outputs to `out/`)
- `npm run lint` — Run ESLint

## Architecture

This is a **static landing page** for "WebManager," a Korean web management/maintenance service (webmanager.co.kr). 저가형 제작이 아닌, **기존 웹사이트 구출 + 무제한 유지보수 구독** 블루오션 포지셔닝. Uses Next.js 16 App Router with `output: "export"` targeting Cloudflare Pages.

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

### Component Structure

- **`src/app/page.tsx`** — Single page composing all sections. No routing.
- **`src/components/sections/`** — 8 sections (Hero → Problem → Solution → Pricing → Process → Portfolio → FAQ → CTA+Footer).
- **`src/components/ui/`** — Shared primitives + shadcn/ui components:
  - `Button` (CVA-based), `Container` (forwardRef, w-full), `ScrollReveal` (GSAP + ScrollTrigger), `HeroTitle` (GSAP char stagger), `FeatureCard` (shared card with glassmorphism icon + glow border), `DotNav`, `ScrollDown`, `Logo` (inline SVG, rounded rect icon + wordmark), `ContactForm` (client component, Web3Forms + Telegram notification)
  - New shadcn components go here via CLI.
- **`src/lib/utils.ts`** — `cn()` utility (clsx + tailwind-merge).
- **`src/components/layout/`** — `Header` (fixed top, dark glass) and `Footer` (embedded in CTA section).

### Key Patterns

- **Scroll snap (desktop only)**: Mobile uses `scroll-snap-type: y proximity` (natural scroll), desktop (`md:` 이상) uses `mandatory`. Configured in `@layer base` in globals.css.
- **Responsive section heights**: `min-h-dvh md:h-dvh md:snap-start` — mobile gets natural height with `py-16`, desktop gets fixed viewport height with snap.
- **GSAP animations**: `ScrollReveal` component wraps content with GSAP ScrollTrigger (once: true, start: "top 85%"). Respects `prefers-reduced-motion`. Mobile: shortened duration (0.5s) and reduced y-offset. `HeroTitle` uses GSAP for char-by-char stagger (mobile: faster stagger, smaller y). Hero has a GSAP timeline for sequential element entrance.
- **Mobile-first responsive**: 3-step typography scaling (`text-2xl sm:text-3xl md:text-4xl`). Grids use `sm:grid-cols-2 lg:grid-cols-3` for tablet intermediate. Touch targets min 44px. `@media(hover:hover)` for hover-only effects.
- **Client vs Server**: Most components are server components. `ScrollReveal`, `HeroTitle`, `Hero`, `DotNav`, `FAQ`, `Pricing`, and `ContactForm` use `"use client"`.
- **Design tokens**: Dark cinematic palette in `:root` → `@theme inline`. Background: `#0a0a0a`, foreground: `#fafafa`, cards: semi-transparent `white/[0.04]`, borders: `white/[0.06]`.
  - **Brand colors**: `brand-accent` (blue, `#2563eb`), `cta` (blue, `#2563eb`), `surface` (dark, `#0f0f0f`).
- **Contact form**: `ContactForm` in CTA section. Web3Forms API for email delivery + Telegram Bot API for real-time notification. Honeypot spam protection. Glassmorphism dark input styling.
- **Static export**: `images.unoptimized: true` in next.config.ts. No API routes, no server features.

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

## Design Direction

### 비즈니스 모델
- **시장 포지셔닝**: 저가형 템플릿 제작(레드오션)이 아닌, **'기존 웹사이트 구출 및 무제한 유지보수 구독'** 블루오션.
- **핵심 모델**: 소스코드 없는 기존 사이트를 100% 클론(복원) → 합리적인 월 구독료로 무제한 관리.
- **슬로건**: "불합리한 웹 유지보수, 저희가 끝내겠습니다."

### 타겟 고객 (4유형)
기존 웹 에이전시 생태계의 불합리한 관행으로 고통받는 사업자:
1. **연락 두절형** — 프리랜서/에이전시 폐업·잠적으로 수정 불가, 사이트 방치
2. **인질형** — 소스코드·호스팅 권한 미인수, 불만족해도 끌려다니는 상태
3. **추가금 스트레스형** — 텍스트 하나에 며칠 대기 + 매번 추가 청구서
4. **고정비 누수형** — 업데이트 거의 없는데 비싼 유지보수 고정비 매달 지출

### 핵심 솔루션 (Problem → Solution 1:1 대응)
| Problem | Solution |
|---------|----------|
| 연락두절 → | 100% 클론 구축 (기존 디자인·기능 그대로 복원) |
| 인질 → | 완전한 소유권 양도 (소스코드 + 관리자 권한 100% 이전) |
| 추가금 → | 무제한 수정 지원 (추가 비용·횟수 제한 없이 전담 처리) |
| 고정비 → | 합리적인 구독 요금 (거품 뺀 월 구독으로 고정비 대폭 절감) |

### 디자인 원칙
- **Dark Cinematic, 절제된 화려함**: 어두운 배경 + 큰 타이포그래피 + 넓은 여백 + 단일 accent blue. 과시가 아닌 "이 정도는 기본"이라는 여유. 효과 하나하나가 의도적.
- **GSAP 스크롤 애니메이션**: ScrollTrigger 기반 등장 애니메이션, Hero char-by-char stagger. 모든 애니메이션은 once: true, 0.6~0.8s duration, power3.out ease.
- **FeatureCard**: Problem/Solution 섹션이 공유하는 카드 컴포넌트. `bg-white/[0.02]` + glow border + glassmorphism 아이콘. hover 시 `scale-105`. 4칼럼 그리드 `max-w-5xl mx-auto`.
- **Glass card UI**: Pricing 인기 플랜은 animated gradient border. 3티어 + 연간/월간 토글.
- **이모지 금지, SVG 아이콘 사용**: 모든 아이콘은 lucide-react SVG로 통일.
- **CTA 블루톤 통일**: brand blue(`#2563eb`) fill 버튼 + glow shadow.
- **타겟 고객은 IT 비전문 사업자**: 기술 용어를 최소화하고, 문장은 쉽고 직관적으로.

## SEO

- **Metadata**: `layout.tsx`에 title, description, keywords, OG, Twitter Card, canonical URL, robots 설정 완료.
- **JSON-LD**: `page.tsx`에 WebSite + ProfessionalService 구조화 데이터 삽입.
- **sitemap.xml / robots.txt**: `public/`에 정적 파일로 배치 (static export 제약).
- **Favicon**: `src/app/icon.svg` — 원형 배경 + WM 지그재그 로고 SVG 파비콘.
- **OG Image**: `src/app/opengraph-image.tsx` — 빌드 타임 자동 생성 (1200x630 PNG). Noto Sans KR 폰트를 Google Fonts API에서 필요 글자만 로드. `dynamic: "force-static"` 필수 (static export 호환).

### SEO 현황

- [x] ~~**OG Image 제작**~~ (완료) — `opengraph-image.tsx`로 빌드 타임 자동 생성.
- [x] ~~**네이버 서치어드바이저 등록**~~ (완료, 2026-03-03) — 소유 확인 + sitemap 제출.
- [x] ~~**네이버 사이트 인증 메타태그**~~ (완료) — `layout.tsx`에 `naver-site-verification` 추가.
- [ ] **Google Search Console 등록**: HTML 태그 방식 소유 확인 → sitemap 제출. 인증 코드 받으면 `layout.tsx`의 `verification.google`에 추가.
- [ ] **Google Analytics 4 설정**: 전환 추적 (폼 제출, 버튼 클릭).
- [ ] **블로그/콘텐츠 SEO**: 홈페이지 제작 관련 콘텐츠 페이지 확장 (장기).
- [ ] **Notion에 SEO 체크리스트 페이지 생성**: 클라이언트 사이트 적용용 가이드. claude.ai 서버 복구 후 작업.

## Logo Assets

- `public/logo.svg` / `logo.png` — 원형 아이콘 + 워드마크 (가로형)
- `public/logo-icon.png` — 원형 아이콘만
- `public/logo_rectangular.svg` / `logo_rectangular.png` — 라운드 사각형 아이콘 + 워드마크
- `public/logo-icon_rectangular.svg` / `logo-icon_rectangular.png` — 라운드 사각형 아이콘만 (검정 배경 꽉 참)
- `src/components/ui/Logo.tsx` — 헤더용 인라인 SVG 컴포넌트 (라운드 사각형)

## 사이트 점검 결과 (2026-03-03)

### HIGH — 수정 완료
| # | 이슈 | Before | After | 파일 |
|---|------|--------|-------|------|
| 1 | Footer 연도 하드코딩 | `© 2025` | `© {new Date().getFullYear()}` (빌드 시 평가) | `CTA.tsx`, `Footer.tsx` |
| 2 | sitemap.xml `<lastmod>` 누락 | `<loc>` + `<changefreq>` 만 | `<lastmod>2026-03-03</lastmod>` 추가 | `public/sitemap.xml` |
| 3 | JSON-LD 연락처/서비스 정보 부족 | name, url, description만 | email, priceRange, sameAs(카카오톡) 추가 | `page.tsx` |

> **NOTE**: JSON-LD의 `priceRange: "₩₩"`는 임시값. 실제 판매 아이템 가격이 확정되면 재조정 필요. `page.tsx`의 ProfessionalService 스키마에서 수정.

### MEDIUM — 미수정 (다음 작업)
| # | 이슈 | 파일 |
|---|------|------|
| 4 | ScrollReveal delay 불일치 (0.08/0.1/0.15 혼재) | Problem, Solution, Pricing, Process, Portfolio |
| 5 | Process 카드 `rounded-xl` → `rounded-2xl` 통일 필요 | `Process.tsx` |
| 6 | 카드 배경 opacity 불일치 (`0.02` vs `0.04`) | FeatureCard, Process, ContactForm |
| 7 | FAQ 서브텍스트 없음 (다른 섹션은 전부 있음) | `FAQ.tsx` |
| 8 | GSAP cleanup 함수 누락 (메모리 누수 가능) | ScrollReveal, HeroTitle, Hero |
| 9 | Analytics 미설정 (GA4/네이버) | `layout.tsx` |

### LOW — 백로그
| # | 이슈 | 파일 |
|---|------|------|
| 10 | Portfolio Coming Soon 2개 → 신뢰도 약화 | `Portfolio.tsx` |
| 11 | Hero 보조 버튼 "서비스 소개서 보기" → "가격 확인하기"가 더 직관적 | `Hero.tsx` |
| 12 | Telegram 알림 실패 시 console.error 없음 | `ContactForm.tsx` |
| 13 | OG Image 폰트 로딩 에러 핸들링 없음 | `opengraph-image.tsx` |

### SEO TODO (추가 작업)
- [x] ~~**OG Image 제작**~~ (완료)
- [x] ~~**네이버 서치어드바이저 등록**~~ (완료) — 소유 확인 + sitemap 제출 완료 (2026-03-03)
- [x] ~~**네이버 사이트 인증 메타태그**~~ (완료) — `layout.tsx`에 `naver-site-verification` 추가
- [ ] **Google Search Console 등록**: sitemap 제출 + 색인 요청
- [ ] **Google Analytics 4 설정**: 전환 추적 (폼 제출, 버튼 클릭)
- [ ] **블로그/콘텐츠 SEO**: 홈페이지 제작 관련 콘텐츠 페이지 확장 (장기)

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

## 다음 작업

1. **Google Search Console 등록** — 인증 코드 받아서 `layout.tsx`에 추가 + sitemap 제출
2. **Notion SEO 체크리스트 생성** — 클라이언트 사이트 적용용 가이드 (Notion MCP 복구 후)
3. **사이트 점검 MEDIUM 항목** — 디자인 일관성 (delay/radius/opacity 통일), GSAP cleanup, Analytics 설정
4. **사이트 점검 LOW 항목** — Portfolio 보강, 에러 핸들링
5. **OG Image 카피 업데이트** — opengraph-image.tsx의 텍스트를 관리자 피벗에 맞게 변경
6. **기능 개선 및 콘텐츠 업데이트**
