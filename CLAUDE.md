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
- **shadcn/ui** (new-york style) — `components.json` configured, CLI-ready (`npx shadcn@latest add <component>`)
- `class-variance-authority` (CVA) for component variants
- `clsx` + `tailwind-merge` via `cn()` utility (`src/lib/utils.ts`)
- `tw-animate-css` for shadcn/ui animation primitives
- lucide-react for SVG icons
- Noto Sans KR (Korean font via `next/font/google`)

### Component Structure

- **`src/app/page.tsx`** — Single page composing all sections. No routing.
- **`src/components/sections/`** — 7 full-viewport sections (Hero → Problem → Solution → Pricing → Process → FAQ → CTA+Footer). Each section is `h-dvh snap-start`.
- **`src/components/ui/`** — Shared primitives + shadcn/ui components. Custom: `Button` (CVA-based), `Container`, `FadeIn` (Intersection Observer), `TextReveal` (per-char animation), `DotNav`, `ScrollDown`. New shadcn components go here via CLI.
- **`src/lib/utils.ts`** — `cn()` utility (clsx + tailwind-merge).
- **`src/components/layout/`** — `Header` (fixed top) and `Footer` (embedded in CTA section).

### Key Patterns

- **Scroll snap**: `scroll-snap-type: y mandatory` on `html` (in `@layer base` in globals.css — must use `@layer base` or Tailwind v4 preflight drops it). Each section is a snap point.
- **Client vs Server**: Most components are server components. Only `FadeIn`, `TextReveal`, `DotNav`, and `FAQ` use `"use client"` (for Intersection Observer or useState).
- **Design tokens**: `globals.css` uses shadcn/ui CSS variable system (`:root` → `@theme inline`). Two layers of color tokens:
  - **shadcn system colors**: `primary`, `secondary`, `muted`, `accent`, `destructive` — used by shadcn components.
  - **Brand colors**: `brand-accent` (blue, `#2563eb`), `cta` (blue, `#2563eb`), `surface` (light bg) — use `text-brand-accent`, `bg-brand-accent`, `text-cta` etc. 전체적으로 블루톤 통일.
- **Static export**: `images.unoptimized: true` in next.config.ts. No API routes, no server features.

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

## Design Direction

이 랜딩페이지는 **웹 제작 에이전시의 포트폴리오 겸 광고 페이지**다. 방문자가 "이 회사가 만든 사이트가 이 정도면, 우리 사이트도 맡겨볼 만하겠다"고 느껴야 한다. 즉, 이 페이지 자체가 실력을 증명하는 쇼케이스여야 한다.

- **세련되되 과하지 않게**: Exaggerated Minimalism 기조. 큰 타이포그래피, 넓은 여백, black/white 기반에 단일 accent 컬러. 화려한 효과보다 정돈된 느낌이 우선.
- **최신 트렌드 반영**: scroll snap, per-character text reveal, Intersection Observer 기반 스크롤 애니메이션 등 모던 웹 기법을 적극 활용. 새로운 기능 추가 시에도 최신 CSS/JS 패턴을 우선 검토할 것.
- **이모지 금지, SVG 아이콘 사용**: 모든 아이콘은 lucide-react SVG로 통일. 이모지는 비전문적으로 보인다.
- **CTA도 블루톤으로 통일**: 정보성 요소와 행동 유도 요소 모두 brand blue(`#2563eb`)로 통일하여 일관된 톤 유지.
- **타겟 고객은 IT 비전문 사업자**: 기술 용어를 최소화하고, 문장은 쉽고 직관적으로. "Core Web Vitals"보다 "속도 2배 빠르게" 식으로.
