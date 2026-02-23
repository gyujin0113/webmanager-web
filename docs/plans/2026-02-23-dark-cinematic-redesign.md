# Dark Cinematic Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the Generalist Lab landing page from a light/minimal design to a dark cinematic agency showcase that proves technical capability through restrained, intentional visual effects.

**Architecture:** Replace CSS color system to dark palette, install GSAP + @gsap/react for scroll-triggered animations, replace existing FadeIn/TextReveal with GSAP-powered equivalents, add Portfolio placeholder section. Mobile: no scroll-snap, simplified animations, natural height.

**Tech Stack:** Next.js 16, Tailwind v4, GSAP 3 + @gsap/react + ScrollTrigger, shadcn/ui, lucide-react

**Key Constraint:** SplitText is a paid GSAP plugin — we build character-split manually (wrap each char in a `<span>`, animate with gsap stagger). This is exactly what the current TextReveal does, but we'll power it with GSAP timelines instead of CSS transitions.

---

### Task 1: Install GSAP dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install gsap and @gsap/react**

Run:
```bash
npm install gsap @gsap/react
```

**Step 2: Verify installation**

Run:
```bash
npm run build
```
Expected: Build succeeds, no errors.

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add gsap and @gsap/react dependencies"
```

---

### Task 2: Dark color system in globals.css

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Replace `:root` color tokens with dark palette**

Replace the entire `:root` block and `@theme inline` brand colors:

```css
:root {
  --background: #0a0a0a;
  --foreground: #fafafa;
  --card: #111111;
  --card-foreground: #fafafa;
  --popover: #111111;
  --popover-foreground: #fafafa;
  --primary: oklch(0.55 0.22 264);
  --primary-foreground: #fafafa;
  --secondary: #1a1a1a;
  --secondary-foreground: #fafafa;
  --muted: #1a1a1a;
  --muted-foreground: #888888;
  --accent: #1a1a1a;
  --accent-foreground: #fafafa;
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.577 0.245 27.325);
  --border: rgba(255, 255, 255, 0.08);
  --input: rgba(255, 255, 255, 0.08);
  --ring: oklch(0.55 0.22 264);
  --radius: 0.625rem;

  /* Custom brand tokens */
  --brand-accent: #2563eb;
  --brand-accent-dark: #1d4ed8;
  --brand-cta: #2563eb;
  --brand-cta-dark: #1d4ed8;
  --brand-surface: #0f0f0f;
}
```

**Step 2: Update scroll-snap for mobile strategy**

Keep the existing mobile proximity / desktop mandatory split from the previous task. Additionally update section heights to use responsive approach:

In `@layer base`, after the scroll snap rules, update body:

```css
body {
  @apply bg-background text-foreground;
  font-family: var(--font-sans), system-ui, sans-serif;
}
```

No changes needed here since `bg-background` and `text-foreground` will pick up the new dark tokens.

**Step 3: Verify the dark theme renders**

Run:
```bash
npm run dev
```
Open browser, verify dark background with white text. Cards/borders should be subtle against dark bg.

**Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "style: switch to dark cinematic color palette"
```

---

### Task 3: Update Header for dark theme

**Files:**
- Modify: `src/components/layout/Header.tsx`

**Step 1: Update Header classes**

Change from light to dark glass effect:
- `bg-white/80` → `bg-black/60`
- `border-border/50` → `border-white/5`
- CTA button: add `text-brand-accent` explicitly, border subtle

```tsx
<header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-md">
  <Container className="flex items-center justify-between h-16">
    <a href="#" className="text-lg font-bold tracking-tight text-foreground">
      Generalist Lab
    </a>
    <a
      href="#contact"
      className="text-xs font-medium px-4 py-2 rounded-lg border border-white/10 hover:border-brand-accent/50 text-brand-accent cursor-pointer transition-all duration-200"
    >
      무료 진단 받기
    </a>
  </Container>
</header>
```

**Step 2: Verify**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "style: update header to dark glass effect"
```

---

### Task 4: Create GSAP-powered ScrollReveal component

**Files:**
- Create: `src/components/ui/ScrollReveal.tsx`
- Keep: `src/components/ui/FadeIn.tsx` (will be removed later after all sections migrate)

**Step 1: Create ScrollReveal component**

This replaces FadeIn. Uses GSAP + ScrollTrigger with `useGSAP` hook.

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  y = 40,
  duration = 0.8,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    gsap.from(ref.current, {
      y,
      opacity: 0,
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 85%",
        once: true,
      },
    });
  }, { scope: ref });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/components/ui/ScrollReveal.tsx
git commit -m "feat: add GSAP-powered ScrollReveal component"
```

---

### Task 5: Create GSAP-powered HeroTitle component

**Files:**
- Create: `src/components/ui/HeroTitle.tsx`

**Step 1: Create HeroTitle**

Replaces TextReveal for the Hero section. Uses GSAP timeline for character-by-character stagger (no paid SplitText needed — we wrap chars in spans manually, same approach as current TextReveal but with GSAP power).

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Segment {
  text: string;
  highlight?: boolean;
  break?: boolean;
}

interface HeroTitleProps {
  segments: Segment[];
  className?: string;
  style?: React.CSSProperties;
}

export default function HeroTitle({ segments, className = "", style }: HeroTitleProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    const chars = ref.current.querySelectorAll(".hero-char");

    gsap.from(chars, {
      y: 60,
      opacity: 0,
      duration: 0.6,
      stagger: 0.03,
      ease: "power3.out",
    });
  }, { scope: ref });

  return (
    <h1 ref={ref} className={className} style={style}>
      {segments.map((seg, i) => (
        <span key={i}>
          {seg.break && <br />}
          {seg.text.split("").map((char, j) => (
            <span
              key={`${i}-${j}`}
              className={`inline-block hero-char ${seg.highlight ? "text-brand-accent" : ""}`}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/components/ui/HeroTitle.tsx
git commit -m "feat: add GSAP-powered HeroTitle with char stagger animation"
```

---

### Task 6: Redesign Hero section

**Files:**
- Modify: `src/components/sections/Hero.tsx`

**Step 1: Rewrite Hero with dark theme + GSAP animations**

- Dark background with subtle dot grid pattern (CSS pseudo-element)
- Subtle radial gradient glow (accent blue, low opacity)
- Use HeroTitle instead of TextReveal
- Use GSAP timeline for sequential entrance (subtitle → buttons)
- CTA button: accent blue fill with glow
- Mobile: `min-h-dvh`, Desktop: `md:h-dvh md:snap-start`

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import HeroTitle from "@/components/ui/HeroTitle";
import ScrollDown from "@/components/ui/ScrollDown";

gsap.registerPlugin(useGSAP);

const headlineSegments = [
  { text: "원래 디자인 그대로" },
  { text: "수정은 ", break: true },
  { text: "무제한", highlight: true },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({ delay: 0.6 });

    tl.from(".hero-subtitle", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    })
    .from(".hero-desc", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    }, "-=0.3")
    .from(".hero-buttons", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    }, "-=0.3");
  }, { scope: containerRef });

  return (
    <section
      id="hero"
      className="min-h-dvh md:h-dvh md:snap-start flex items-center relative overflow-hidden"
    >
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-3xl pointer-events-none" />

      <Container className="text-center relative z-10" ref={containerRef}>
        <p className="hero-subtitle text-sm font-medium text-muted-foreground tracking-wide mb-6">
          골치 아픈 홈페이지 관리, 이제 그만 신경 쓰세요
        </p>
        <HeroTitle
          segments={headlineSegments}
          className="font-black tracking-tight leading-[1.1]"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
        />
        <p className="hero-desc mt-8 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          &ldquo;텍스트 하나 바꾸는데 며칠 걸리고 돈 드나요?&rdquo;
          <br className="hidden sm:block" />
          새로 만들지 않고 엔진만 최신으로 교체해 드립니다.
          <br className="hidden sm:block" />
          <span className="text-foreground font-medium">월 구독으로 개발팀을 채용하세요.</span>
        </p>
        <div className="hero-buttons mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href="#contact" variant="primary" className="w-full sm:w-64 bg-brand-accent text-white border-brand-accent hover:bg-brand-accent-dark shadow-lg shadow-brand-accent/20">
            무료 진단 받기 (내 사이트 견적)
          </Button>
          <Button href="#pricing" variant="outline" className="w-full sm:w-64">
            서비스 소개서 보기
          </Button>
        </div>
      </Container>
      <ScrollDown href="#problem" />
    </section>
  );
}
```

Note: Container currently doesn't forward refs. We need to update it (see Step 2).

**Step 2: Update Container to forward refs**

Modify `src/components/ui/Container.tsx`:

```tsx
import { forwardRef } from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, className = "" }, ref) => {
    return (
      <div ref={ref} className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";
export default Container;
```

**Step 3: Verify**

Run: `npm run build`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git add src/components/sections/Hero.tsx src/components/ui/Container.tsx
git commit -m "feat: redesign Hero with dark theme, GSAP animations, accent glow"
```

---

### Task 7: Redesign Problem section

**Files:**
- Modify: `src/components/sections/Problem.tsx`

**Step 1: Rewrite with dark theme + ScrollReveal**

- Dark background (default `#0a0a0a`, using `bg-surface` which is now `#0f0f0f`)
- Glass cards: semi-transparent bg + subtle border
- Replace FadeIn with ScrollReveal
- Mobile: natural height, Desktop: `md:h-dvh md:snap-start`

```tsx
import { Banknote, Clock, Gauge } from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

const problems = [
  {
    icon: Banknote,
    title: "비싼 유지보수 비용",
    description:
      "매달 나가는 유지보수 비용이 부담되시나요? 작은 수정에도 추가 견적이 나오는 구조는 비효율적입니다.",
  },
  {
    icon: Clock,
    title: "수정할 때마다 추가 비용",
    description:
      "텍스트 하나 바꾸는 데도 비용이 발생하고, 응답까지 며칠씩 걸리는 경험을 하셨을 겁니다.",
  },
  {
    icon: Gauge,
    title: "느리고 무거운 사이트",
    description:
      "페이지 로딩이 3초 이상 걸리면 방문자의 53%가 이탈합니다. 속도는 곧 매출입니다.",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="min-h-dvh md:h-dvh md:snap-start flex items-center py-20 md:py-0 bg-surface">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              이런 고민, 하고 계시지 않나요?
            </h2>
            <p className="mt-4 text-muted-foreground">
              많은 사업자분들이 겪고 있는 웹사이트 문제들입니다.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.1}>
              <div className="bg-white/[0.04] rounded-2xl p-6 sm:p-8 border border-white/[0.06] hover:border-brand-accent/20 transition-colors duration-300 h-full">
                <div className="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-brand-accent" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

**Step 2: Verify**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/components/sections/Problem.tsx
git commit -m "style: redesign Problem section with dark glass cards and ScrollReveal"
```

---

### Task 8: Redesign Solution section

**Files:**
- Modify: `src/components/sections/Solution.tsx`

**Step 1: Same pattern as Problem — dark theme, glass cards, ScrollReveal, responsive heights**

```tsx
import { Zap, Infinity, Target, Rocket } from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

const solutions = [
  {
    icon: Zap,
    title: "클론 + 성능 개선",
    description:
      "기존 디자인을 그대로 옮기면서 최신 기술로 속도를 극대화합니다. Core Web Vitals 올그린 달성.",
  },
  {
    icon: Infinity,
    title: "수정 무제한",
    description:
      "월 유지비에 수정이 포함되어 있습니다. 텍스트, 이미지, 레이아웃 변경 요청에 추가 비용 없이 대응합니다.",
  },
  {
    icon: Target,
    title: "올인원 관리",
    description:
      "도메인, 호스팅, SSL, 보안 업데이트까지 한 번에 관리합니다. 신경 쓸 것 없이 사업에만 집중하세요.",
  },
  {
    icon: Rocket,
    title: "빠른 제작",
    description:
      "표준화된 워크플로우로 2주 이내 제작 완료. 빠르게 시작하고, 운영하면서 개선해 나갑니다.",
  },
];

export default function Solution() {
  return (
    <section id="solution" className="min-h-dvh md:h-dvh md:snap-start flex items-center py-20 md:py-0">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Generalist Lab이 해결합니다
            </h2>
            <p className="mt-4 text-muted-foreground">
              더 나은 방식으로, 더 합리적인 가격에.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.08}>
              <div className="rounded-2xl p-6 border border-white/[0.06] hover:border-brand-accent/20 transition-colors duration-300 h-full bg-white/[0.02]">
                <div className="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-brand-accent" strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 text-base font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

**Step 2: Verify & Commit**

```bash
npm run build
git add src/components/sections/Solution.tsx
git commit -m "style: redesign Solution section with dark theme and ScrollReveal"
```

---

### Task 9: Redesign Pricing section

**Files:**
- Modify: `src/components/sections/Pricing.tsx`

**Step 1: Rewrite — dark theme, animated gradient border on popular plan**

The popular plan gets a CSS animated gradient border using a pseudo-element with `@keyframes` rotation. The regular plan stays glass-style.

```tsx
import { Check } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/ui/ScrollReveal";

const plans = [
  {
    name: "초기 제작비",
    price: "150만원~",
    period: "1회",
    description: "기존 사이트 클론 + 성능 최적화 + 반응형 구현",
    features: [
      "기존 디자인 1:1 클론",
      "Next.js 기반 초고속 사이트",
      "모바일 완벽 대응",
      "SEO 기본 설정",
      "Cloudflare 배포",
    ],
    popular: false,
  },
  {
    name: "월 유지비",
    price: "30만원~",
    period: "/월",
    description: "수정 무제한 + 호스팅 + 보안 + 성능 모니터링",
    features: [
      "콘텐츠 수정 무제한",
      "호스팅 & 도메인 관리",
      "SSL 인증서 & 보안",
      "성능 모니터링 & 리포트",
      "48시간 내 대응",
    ],
    popular: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="min-h-dvh md:h-dvh md:snap-start flex items-center py-20 md:py-0 bg-surface">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              투명한 가격 정책
            </h2>
            <p className="mt-4 text-muted-foreground">
              숨겨진 비용 없이, 명확한 가격으로 안내드립니다.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 0.15}>
              <div className="relative h-full">
                {/* Animated gradient border for popular plan */}
                {plan.popular && (
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-brand-accent via-purple-500 to-brand-accent bg-[length:200%_100%] animate-gradient-x" />
                )}
                <div
                  className={`relative rounded-2xl p-6 sm:p-8 h-full flex flex-col ${
                    plan.popular
                      ? "bg-[#0f0f0f]"
                      : "bg-white/[0.04] border border-white/[0.06]"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-6 bg-brand-accent text-white text-xs font-medium px-3 py-1 rounded-full">
                      추천
                    </span>
                  )}
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                  <ul className="mt-4 space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check className="w-4 h-4 text-brand-accent mt-0.5 shrink-0" strokeWidth={2} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    href="#contact"
                    variant="primary"
                    className={`mt-6 w-full ${
                      plan.popular
                        ? "bg-brand-accent text-white border-brand-accent hover:bg-brand-accent-dark"
                        : ""
                    }`}
                  >
                    상담 신청
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

**Step 2: Add `animate-gradient-x` keyframes to globals.css**

Add after existing keyframes:

```css
@keyframes gradient-x {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient-x {
  animation: gradient-x 3s ease infinite;
}
```

**Step 3: Verify & Commit**

```bash
npm run build
git add src/components/sections/Pricing.tsx src/app/globals.css
git commit -m "feat: redesign Pricing with animated gradient border on popular plan"
```

---

### Task 10: Redesign Process section

**Files:**
- Modify: `src/components/sections/Process.tsx`

**Step 1: Dark theme, ScrollReveal, accent step numbers**

```tsx
import { MessageSquare, Code2, Globe, Settings } from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

const steps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "상담",
    description: "현재 사이트와 요구사항을 파악합니다. 무료로 진행됩니다.",
  },
  {
    icon: Code2,
    step: "02",
    title: "제작",
    description: "디자인 클론과 성능 최적화를 동시에 진행합니다.",
  },
  {
    icon: Globe,
    step: "03",
    title: "배포",
    description: "최종 확인 후 도메인 연결과 함께 사이트를 오픈합니다.",
  },
  {
    icon: Settings,
    step: "04",
    title: "운영",
    description: "월 유지비로 수정, 관리, 모니터링을 지속합니다.",
  },
];

export default function Process() {
  return (
    <section id="process" className="min-h-dvh md:h-dvh md:snap-start flex items-center py-20 md:py-0">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">진행 과정</h2>
            <p className="mt-4 text-muted-foreground">
              상담부터 운영까지, 4단계로 심플하게.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, i) => (
            <ScrollReveal key={item.step} delay={i * 0.1}>
              <div className="relative p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-brand-accent" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-bold text-brand-accent tracking-widest">
                    STEP {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-11 right-0 translate-x-1/2 text-white/10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

**Step 2: Verify & Commit**

```bash
npm run build
git add src/components/sections/Process.tsx
git commit -m "style: redesign Process section with dark theme and ScrollReveal"
```

---

### Task 11: Add Portfolio placeholder section

**Files:**
- Create: `src/components/sections/Portfolio.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/ui/DotNav.tsx`

**Step 1: Create Portfolio section**

Minimal showcase section with 2-3 placeholder slots. The first slot references "이 사이트" as the portfolio piece.

```tsx
import { ExternalLink } from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

const works = [
  {
    title: "Generalist Lab",
    category: "Agency Landing Page",
    description: "GSAP 스크롤 애니메이션, 다크 시네마틱 디자인, 풀 반응형",
    tech: ["Next.js", "GSAP", "Tailwind CSS"],
    href: "#hero",
    live: true,
  },
  {
    title: "Coming Soon",
    category: "E-Commerce",
    description: "새로운 프로젝트가 준비 중입니다.",
    tech: [],
    href: null,
    live: false,
  },
  {
    title: "Coming Soon",
    category: "Corporate Site",
    description: "새로운 프로젝트가 준비 중입니다.",
    tech: [],
    href: null,
    live: false,
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="min-h-dvh md:h-dvh md:snap-start flex items-center py-20 md:py-0 bg-surface">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Portfolio</h2>
            <p className="mt-4 text-muted-foreground">
              직접 확인하세요. 이 사이트가 첫 번째 작업물입니다.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-6">
          {works.map((work, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div
                className={`rounded-2xl border h-full flex flex-col overflow-hidden ${
                  work.live
                    ? "border-brand-accent/20 bg-white/[0.04]"
                    : "border-white/[0.04] bg-white/[0.02] opacity-50"
                }`}
              >
                {/* Thumbnail placeholder */}
                <div className="aspect-video bg-white/[0.03] flex items-center justify-center border-b border-white/[0.04]">
                  {work.live ? (
                    <span className="text-xs text-brand-accent font-medium tracking-wider uppercase">
                      Live Site
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground tracking-wider uppercase">
                      TBD
                    </span>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-xs text-brand-accent font-medium tracking-wider uppercase">
                    {work.category}
                  </span>
                  <h3 className="mt-2 text-lg font-bold">{work.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                    {work.description}
                  </p>
                  {work.tech.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {work.tech.map((t) => (
                        <span key={t} className="text-xs px-2 py-1 rounded-md bg-white/[0.06] text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {work.href && (
                    <a
                      href={work.href}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-accent hover:underline"
                    >
                      보러 가기 <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

**Step 2: Add Portfolio to page.tsx**

Insert `<Portfolio />` between `<Process />` and `<FAQ />`:

```tsx
import Portfolio from "@/components/sections/Portfolio";
// ... in the JSX:
<Process />
<Portfolio />
<FAQ />
```

**Step 3: Update DotNav to include Portfolio**

Add `{ id: "portfolio", label: "Portfolio" }` to `dotSections` after "process", and add `"portfolio"` to `allSections` after "process".

**Step 4: Verify & Commit**

```bash
npm run build
git add src/components/sections/Portfolio.tsx src/app/page.tsx src/components/ui/DotNav.tsx
git commit -m "feat: add Portfolio placeholder section with live site showcase"
```

---

### Task 12: Redesign FAQ section

**Files:**
- Modify: `src/components/sections/FAQ.tsx`

**Step 1: Dark theme, ScrollReveal, keep accordion logic**

```tsx
"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ScrollDown from "@/components/ui/ScrollDown";

const faqs = [
  {
    question: "기존 사이트 디자인을 그대로 옮길 수 있나요?",
    answer:
      "네, 기존 디자인을 픽셀 단위로 클론합니다. 필요에 따라 부분 개선도 가능합니다. 클론 과정에서 성능 최적화가 자동으로 적용됩니다.",
  },
  {
    question: "제작 기간은 얼마나 걸리나요?",
    answer:
      "일반적인 기업 사이트 기준 2주 이내에 완료됩니다. 페이지 수와 복잡도에 따라 달라질 수 있으며, 상담 시 정확한 일정을 안내드립니다.",
  },
  {
    question: "월 유지비에 포함되는 수정 범위는 어디까지인가요?",
    answer:
      "텍스트, 이미지 교체, 레이아웃 변경, 새 섹션 추가 등 일반적인 콘텐츠 수정이 모두 포함됩니다. 대규모 기능 추가(결제 시스템, 회원 시스템 등)는 별도 견적이 필요합니다.",
  },
  {
    question: "어떤 기술 스택을 사용하나요?",
    answer:
      "Next.js, TypeScript, Tailwind CSS를 기본 스택으로 사용하며, Cloudflare Pages에 배포합니다. 글로벌 CDN으로 어디서든 빠른 로딩 속도를 보장합니다.",
  },
  {
    question: "계약 기간 제한이 있나요?",
    answer:
      "최소 계약 기간은 없습니다. 월 단위로 유지비가 청구되며, 언제든 해지할 수 있습니다. 해지 시 소스 코드와 도메인 소유권을 모두 인계해 드립니다.",
  },
];

function AccordionItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/[0.06]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="font-medium pr-4 text-sm sm:text-base">{question}</span>
        <span
          className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-40 pb-4" : "max-h-0"
        }`}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="min-h-dvh md:h-dvh md:snap-start flex items-center py-20 md:py-0 relative">
      <Container className="max-w-3xl">
        <ScrollReveal>
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold">
              자주 묻는 질문
            </h2>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div>
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} {...faq} />
            ))}
          </div>
        </ScrollReveal>
      </Container>
      <ScrollDown href="#contact" />
    </section>
  );
}
```

**Step 2: Verify & Commit**

```bash
npm run build
git add src/components/sections/FAQ.tsx
git commit -m "style: redesign FAQ section with dark theme and ScrollReveal"
```

---

### Task 13: Redesign CTA section + Footer

**Files:**
- Modify: `src/components/sections/CTA.tsx`

**Step 1: Rewrite with accent glow, strong CTA button**

```tsx
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function CTA() {
  return (
    <section id="contact" className="min-h-dvh md:h-dvh md:snap-start flex flex-col">
      <div className="flex-1 flex items-center relative overflow-hidden">
        {/* Background accent glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-accent/[0.06] rounded-full blur-3xl pointer-events-none" />

        <Container className="relative z-10">
          <ScrollReveal>
            <div className="rounded-3xl border border-white/[0.06] py-10 px-6 sm:py-16 sm:px-8 text-center bg-white/[0.02]">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                지금 바로 시작하세요
              </h2>
              <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
                무료 상담을 통해 현재 사이트의 개선 포인트와 예상 비용을 안내받으세요.
                <br />
                부담 없이 문의해 주세요.
              </p>
              <div className="mt-8">
                <a
                  href="https://open.kakao.com/"
                  className="inline-flex items-center justify-center rounded-lg px-8 py-3.5 text-sm font-medium bg-brand-accent text-white hover:bg-brand-accent-dark cursor-pointer transition-all duration-200 shadow-lg shadow-brand-accent/20"
                >
                  무료 상담 신청하기
                </a>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </div>
      <footer className="border-t border-white/[0.06] py-6 text-sm text-muted-foreground">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; 2025 Generalist Lab. All rights reserved.</p>
          <a href="mailto:hello@generalistlab.com" className="hover:text-foreground transition-colors cursor-pointer">
            이메일 문의
          </a>
        </Container>
      </footer>
    </section>
  );
}
```

**Step 2: Verify & Commit**

```bash
npm run build
git add src/components/sections/CTA.tsx
git commit -m "style: redesign CTA section with accent glow and strong CTA button"
```

---

### Task 14: Update DotNav and ScrollDown for dark theme

**Files:**
- Modify: `src/components/ui/DotNav.tsx`
- Modify: `src/components/ui/ScrollDown.tsx`

**Step 1: DotNav — update dot colors for dark bg**

The inactive dot uses `bg-border` which is now `rgba(255,255,255,0.08)` — should be slightly more visible. Change inactive dot to `bg-white/20` and hover to `bg-white/40`.

**Step 2: ScrollDown — colors should be fine since `text-muted-foreground` maps to `#888` now.**

Verify and adjust if needed.

**Step 3: Verify & Commit**

```bash
npm run build
git add src/components/ui/DotNav.tsx src/components/ui/ScrollDown.tsx
git commit -m "style: adjust DotNav and ScrollDown colors for dark theme"
```

---

### Task 15: Clean up deprecated components + update CLAUDE.md

**Files:**
- Delete: `src/components/ui/FadeIn.tsx`
- Delete: `src/components/ui/TextReveal.tsx`
- Modify: `CLAUDE.md` (update architecture section, design direction, current state)

**Step 1: Verify no remaining imports of FadeIn or TextReveal**

Search for `FadeIn` and `TextReveal` imports across all files. If any remain, replace with ScrollReveal/HeroTitle.

**Step 2: Delete deprecated files**

```bash
rm src/components/ui/FadeIn.tsx src/components/ui/TextReveal.tsx
```

**Step 3: Update CLAUDE.md**

Update these sections:
- Tech Stack: add GSAP + @gsap/react
- Component Structure: add ScrollReveal, HeroTitle, Portfolio; remove FadeIn, TextReveal
- Key Patterns: add GSAP animation pattern, responsive section height strategy
- Design Direction: update to Dark Cinematic theme description
- Current state: reflect completed redesign

**Step 4: Verify final build**

```bash
npm run build
```
Expected: Clean build, no errors.

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove deprecated FadeIn/TextReveal, update CLAUDE.md for dark redesign"
```

---

### Task 16: Final verification

**Step 1: Full build**

```bash
npm run build
```

**Step 2: Lint**

```bash
npm run lint
```

**Step 3: Visual check**

Run `npm run dev`, open browser, verify:
- All sections render with dark theme
- GSAP animations trigger on scroll
- Hero char-by-char animation plays on load
- Pricing animated border works
- Portfolio section visible
- DotNav includes Portfolio
- Mobile: no snap, natural heights
- Desktop: snap works, full-viewport sections
