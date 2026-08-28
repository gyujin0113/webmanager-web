"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowDownRight, ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Button, { buttonVariants } from "@/components/ui/Button";
import HeroTitle from "@/components/ui/HeroTitle";
import ScrollDown from "@/components/ui/ScrollDown";
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
      }, "-=0.3");
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
      className="min-h-dvh md:h-dvh md:snap-start scroll-mt-24 flex items-center relative overflow-hidden"
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

      <Container className="text-center relative z-10" ref={containerRef}>
        <span className="hero-subtitle inline-flex items-center gap-2.5 text-sm font-medium tracking-wider text-foreground/80 border border-[#1E293B] rounded-full px-5 py-2 mb-10">
          <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse shrink-0" />
          홈페이지 AI 안내 위젯 · 한 줄 설치
        </span>
        <HeroTitle
          segments={headlineSegments}
          className="font-black tracking-[-0.03em] leading-[1.1]"
          style={{ fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)" }}
        />
        <div className="hero-desc mt-10 max-w-2xl mx-auto">
          <p className="text-base sm:text-lg leading-[1.6] tracking-wide text-[#9CA3AF]">
            방문자가 묻는 질문에 바로 답하고, 원하는 페이지로 데려다줍니다.
            <br className="hidden sm:block" />
            <span className="text-foreground font-medium">
              설치는 한 줄, 월 {manwon(WIDGET_MONTHLY)}.
            </span>
          </p>
        </div>
        <div className="hero-buttons mt-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              href={TRIAL_ANCHOR}
              variant="primary"
              className="w-full sm:w-64 bg-gradient-to-b from-[#3B82F6] to-brand-accent text-white border-brand-accent hover:brightness-110 shadow-lg shadow-brand-accent/20 hover:shadow-xl hover:shadow-brand-accent/40 text-[15px] font-bold gap-1.5"
            >
              {TRIAL_DAYS}일 무료 체험
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </Button>
            <button
              type="button"
              onClick={openWidget}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full sm:w-64 gap-1.5 border-white/10 text-muted-foreground hover:border-white/30 hover:bg-white/[0.03]",
              )}
            >
              지금 눌러보기
              <ArrowDownRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            우하단 버튼이 바로 그 위젯입니다.
          </p>
        </div>
      </Container>
      <ScrollDown href="#why" />
    </section>
  );
}
