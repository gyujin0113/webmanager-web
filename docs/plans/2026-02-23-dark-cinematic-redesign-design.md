# Dark Cinematic Redesign Design

## Goal
Generalist Lab 랜딩페이지를 "이 사이트 자체가 실력 증명"이 되는 수준으로 리디자인. 비주얼 임팩트 80%, 신뢰 요소 20%. 절제된 화려함 — 과시가 아닌 여유.

## Design Principles
- **Restrained Cinematic**: 어둡고 시네마틱하되 과하지 않게. 효과 하나하나가 의도적이어야 함
- **Agency-as-Portfolio**: 이 페이지를 보면 "다양한 기술을 다룰 수 있는 팀"이라는 확신이 들어야 함
- **Marketability**: IT 비전문 사업자가 봐도 "전문적이다"라고 느끼는 수준. 기술 용어 최소화

## Color System
- Background: `#0a0a0a` (near-black), sections alternate `#0f0f0f` / `#0a0a0a`
- Text: `#fafafa` (primary), `#888` (muted)
- Accent: `#2563eb` (brand blue, unchanged) — dark bg에서 더 강렬
- Cards: `rgba(255,255,255,0.04)` + `rgba(255,255,255,0.08)` border
- Subtle gradients: accent blue를 배경 glow로 은은하게 활용

## Tech Changes
- **Add**: `gsap`, `@gsap/react` (ScrollTrigger included in gsap)
- **Replace**: FadeIn/TextReveal → GSAP-based equivalents
- **Keep**: Next.js 16, Tailwind v4, shadcn/ui, lucide-react, CVA

## Section-by-Section Design

### Header
- 배경: `bg-white/80` → `bg-black/60 backdrop-blur-md`
- 로고 텍스트 화이트, CTA 버튼 accent blue outline

### Hero
- 다크 배경 + 미세한 CSS dot grid 패턴 (pseudo-element)
- GSAP SplitText 대체: 글자 단위 stagger 등장 (기존 TextReveal 로직을 GSAP으로 교체)
- 서브카피/버튼 순차 등장 (GSAP timeline)
- CTA 버튼: accent blue fill + subtle box-shadow glow
- 배경에 은은한 radial gradient (accent blue, opacity 5~8%)

### Problem
- 다크 배경, 카드는 반투명 glass 스타일
- ScrollTrigger로 카드 stagger 등장 (y: 40 → 0, opacity)
- 카드 hover: 미세한 border 밝아짐 (accent blue 10%)

### Solution
- 동일 다크 톤, 약간 다른 배경색 (`#0f0f0f`)으로 섹션 구분
- 4개 카드 ScrollTrigger stagger
- 아이콘에 accent blue glow (subtle)

### Pricing
- 인기 플랜: animated gradient border (accent blue → purple → blue 순환, subtle)
- 일반 플랜: 기본 glass card
- ScrollTrigger 등장

### Process
- 4단계 카드 + 화살표
- ScrollTrigger로 순차 등장
- 스텝 번호에 accent color

### Portfolio (신규 섹션, Process 뒤)
- 2~3개 슬롯, 현재는 placeholder 또는 이 사이트 자체를 첫 작업물로
- 이미지 썸네일 + 간단한 설명
- 나중에 실제 포트폴리오로 교체 가능한 구조

### FAQ
- 다크 배경, 아코디언 스타일 유지
- GSAP으로 부드러운 높이 전환

### CTA
- 배경에 accent blue radial glow (중앙, opacity 8%)
- CTA 박스 border에 미세한 accent 반영
- 버튼: accent blue fill

## Mobile Strategy
- Desktop (md+): scroll-snap mandatory + full GSAP ScrollTrigger
- Mobile: no snap, natural scroll, GSAP simplified (stagger 줄임, 복잡한 효과 생략)
- 섹션 높이: desktop `h-dvh`, mobile `auto` (min-h 없이 자연스러운 높이)

## Animation Philosophy
- 모든 애니메이션은 "한 번만" 실행 (once: true)
- 등장 속도: 0.6~0.8s, ease-out
- Stagger: 0.08~0.12s per item
- 과한 패럴랙스나 3D 효과는 배제 — "절제된" 무브먼트만
