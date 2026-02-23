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
