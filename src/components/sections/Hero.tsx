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
  { text: "불합리한 웹 유지보수," },
  { text: "저희가 ", break: true },
  { text: "끝내겠습니다.", highlight: true },
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
      {/* Accent glow — slow pulse */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-brand-accent/5 rounded-full blur-3xl pointer-events-none animate-[glow-pulse_6s_ease-in-out_infinite]" />

      <Container className="text-center relative z-10" ref={containerRef}>
        <span className="hero-subtitle inline-flex items-center gap-2.5 text-sm font-medium tracking-wider text-foreground/80 border border-[#1E293B] rounded-full px-5 py-2 mb-10">
          <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse shrink-0" />
          웹사이트 마이그레이션 · 무제한 유지보수 구독
        </span>
        <HeroTitle
          segments={headlineSegments}
          className="font-black tracking-[-0.03em] leading-[1.1]"
          style={{ fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)" }}
        />
        <div className="hero-desc mt-10 max-w-2xl mx-auto">
          <p className="text-base sm:text-lg leading-[1.6] tracking-wide text-[#9CA3AF]">
            에이전시에 끌려다니며 낭비하던 고정비와 추가금 지옥,
            <br className="hidden sm:block" />
            <span className="text-foreground font-medium">Web Manager가 완전히 끊어냅니다.</span>
          </p>
        </div>
        <div className="hero-buttons mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href="#contact" variant="primary" className="w-full sm:w-64 bg-gradient-to-b from-[#3B82F6] to-brand-accent text-white border-brand-accent hover:brightness-110 shadow-lg shadow-brand-accent/20 hover:shadow-xl hover:shadow-brand-accent/40 text-[15px] font-bold gap-1.5">
            무료 진단 받기
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
          </Button>
          <Button href="#pricing" variant="outline" className="w-full sm:w-64 border-white/10 text-muted-foreground hover:border-white/30 hover:bg-white/[0.03]">
            가격 확인하기
          </Button>
        </div>
      </Container>
      <ScrollDown href="#problem" />
    </section>
  );
}
