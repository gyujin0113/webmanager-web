# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start development server
- `npm run build` — Production build with static export (outputs to `out/`)
- `npm run lint` — Run ESLint

## Architecture

This is a **static landing page** for "Generalist Lab," a Korean web agency. It uses Next.js 16 App Router with `output: "export"` targeting Cloudflare Pages.

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
  - `Button` (CVA-based), `Container` (forwardRef), `ScrollReveal` (GSAP + ScrollTrigger), `HeroTitle` (GSAP char stagger), `DotNav`, `ScrollDown`
  - New shadcn components go here via CLI.
- **`src/lib/utils.ts`** — `cn()` utility (clsx + tailwind-merge).
- **`src/components/layout/`** — `Header` (fixed top, dark glass) and `Footer` (embedded in CTA section).

### Key Patterns

- **Scroll snap (desktop only)**: Mobile uses `scroll-snap-type: y proximity` (natural scroll), desktop (`md:` 이상) uses `mandatory`. Configured in `@layer base` in globals.css.
- **Responsive section heights**: `min-h-dvh md:h-dvh md:snap-start` — mobile gets natural height with `py-20`, desktop gets fixed viewport height with snap.
- **GSAP animations**: `ScrollReveal` component wraps content with GSAP ScrollTrigger (once: true, start: "top 85%"). `HeroTitle` uses GSAP timeline for char-by-char stagger. Hero has a GSAP timeline for sequential element entrance.
- **Client vs Server**: Most components are server components. `ScrollReveal`, `HeroTitle`, `Hero`, `DotNav`, and `FAQ` use `"use client"`.
- **Design tokens**: Dark cinematic palette in `:root` → `@theme inline`. Background: `#0a0a0a`, foreground: `#fafafa`, cards: semi-transparent `white/[0.04]`, borders: `white/[0.06]`.
  - **Brand colors**: `brand-accent` (blue, `#2563eb`), `cta` (blue, `#2563eb`), `surface` (dark, `#0f0f0f`).
- **Static export**: `images.unoptimized: true` in next.config.ts. No API routes, no server features.

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

## Design Direction

이 랜딩페이지는 **웹 제작 에이전시의 포트폴리오 겸 광고 페이지**다. 방문자가 "이 회사가 만든 사이트가 이 정도면, 우리 사이트도 맡겨볼 만하겠다"고 느껴야 한다. 즉, 이 페이지 자체가 실력을 증명하는 쇼케이스여야 한다.

- **Dark Cinematic, 절제된 화려함**: 어두운 배경 + 큰 타이포그래피 + 넓은 여백 + 단일 accent blue. 과시가 아닌 "이 정도는 기본"이라는 여유. 효과 하나하나가 의도적.
- **GSAP 스크롤 애니메이션**: ScrollTrigger 기반 등장 애니메이션, Hero char-by-char stagger. 모든 애니메이션은 once: true, 0.6~0.8s duration, power3.out ease.
- **Glass card UI**: 카드는 `bg-white/[0.04]` + `border-white/[0.06]` 반투명 스타일. Pricing 인기 플랜은 animated gradient border.
- **이모지 금지, SVG 아이콘 사용**: 모든 아이콘은 lucide-react SVG로 통일.
- **CTA 블루톤 통일**: brand blue(`#2563eb`) fill 버튼 + glow shadow.
- **타겟 고객은 IT 비전문 사업자**: 기술 용어를 최소화하고, 문장은 쉽고 직관적으로.
