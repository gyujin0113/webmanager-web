"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowDownRight, ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Button, { buttonVariants } from "@/components/ui/Button";
import HeroTitle from "@/components/ui/HeroTitle";
import ScrollDown from "@/components/ui/ScrollDown";
import WidgetPreview from "@/components/ui/WidgetPreview";
import { cn } from "@/lib/utils";
import { TRIAL_DAYS, WIDGET_MONTHLY, manwon } from "@/lib/pricing";

gsap.registerPlugin(useGSAP);

/**
 * The widget boots itself from a `<script>` tag and exposes its controller on
 * `window` — it is not a React component, so this is the only handle we have.
 */
declare global {
  interface Window {
    WebmanagerGuide?: { open?: () => void; close?: () => void; version?: string };
  }
}

const headlineSegments = [
  { text: "홈페이지에 " },
  { text: "AI 안내 위젯을", break: true },
  { text: " 달아드립니다.", highlight: true },
];

const TRIAL_ANCHOR = "#trial";

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
      }, "-=0.3")
      .from(".hero-preview", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      }, "-=0.5");
  }, { scope: containerRef });

  /** Open the demo widget in place; fall back to the trial form if it never booted. */
  function openWidget() {
    const open = window.WebmanagerGuide?.open;
    if (typeof open === "function") {
      open();
      return;
    }
    window.location.hash = TRIAL_ANCHOR;
  }

  return (
    <section
      id="hero"
      className="min-h-dvh md:h-dvh md:pt-(--header-h) md:snap-start scroll-mt-(--header-h) md:scroll-mt-0 flex items-center relative overflow-hidden"
    >
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Accent glow — slow pulse */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-brand-accent/5 rounded-full blur-3xl pointer-events-none animate-[glow-pulse_6s_ease-in-out_infinite]" />

      {/*
        2칼럼(lg 이상): 제품(위젯 첫 화면)을 첫 화면에서 바로 보여준다 — "지금 눌러보기"가
        가리키는 대상이 눈앞에 있어야 이해 비용이 준다. lg 미만에서는 미리보기를 숨긴다:
        모바일에선 우하단의 진짜 위젯이 그 역할을 하고, 뷰포트 맞춤도 지켜야 한다.
      */}
      <Container className="relative z-10 grid items-center gap-12 lg:grid-cols-2 lg:gap-14" ref={containerRef}>
        <div className="text-center lg:text-left">
          <span className="hero-subtitle inline-flex items-center gap-2.5 text-sm font-medium tracking-wider text-foreground/80 border border-[#1E293B] rounded-full px-5 py-2 mb-[clamp(1.5rem,4vh,2.5rem)]">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse shrink-0" />
            홈페이지 AI 안내 위젯 · 한 줄 설치
          </span>
          <HeroTitle
            segments={headlineSegments}
            className="font-black tracking-[-0.03em] leading-[1.12]"
            style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)" }}
          />
          <div className="hero-desc mt-[clamp(1.5rem,4vh,2.5rem)] max-w-2xl mx-auto lg:mx-0">
            <p className="text-base sm:text-lg leading-[1.6] tracking-wide text-[#9CA3AF]">
              방문자가 묻는 질문에 바로 답하고, 원하는 페이지로 데려다줍니다.
              <br className="hidden sm:block" />
              <span className="text-foreground font-medium">
                설치는 한 줄, 월 {manwon(WIDGET_MONTHLY)}.
              </span>
            </p>
          </div>
          <div className="hero-buttons mt-[clamp(1.5rem,4vh,2.5rem)]">
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button
                href={TRIAL_ANCHOR}
                variant="primary"
                className="w-full sm:w-56 bg-gradient-to-b from-[#3B82F6] to-brand-accent text-white border-brand-accent hover:brightness-110 shadow-lg shadow-brand-accent/20 hover:shadow-xl hover:shadow-brand-accent/40 text-[15px] font-bold gap-1.5"
              >
                {TRIAL_DAYS}일 무료 체험
                <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
              </Button>
              <button
                type="button"
                onClick={openWidget}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full sm:w-56 gap-1.5 border-white/10 text-muted-foreground hover:border-white/30 hover:bg-white/[0.03]",
                )}
              >
                지금 눌러보기
                <ArrowDownRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              우하단 버튼이 바로 그 위젯입니다.
              <span className="hidden lg:inline"> 옆의 화면이 그대로 열립니다.</span>
            </p>
          </div>
        </div>
        <div className="hero-preview hidden justify-center lg:flex">
          <WidgetPreview />
        </div>
      </Container>
      <ScrollDown href="#why" />
    </section>
  );
}
