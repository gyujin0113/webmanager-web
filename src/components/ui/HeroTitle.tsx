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

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set(ref.current.querySelectorAll(".hero-char"), { opacity: 1, y: 0 });
      return;
    }

    const chars = ref.current.querySelectorAll(".hero-char");
    const isMobile = window.innerWidth < 640;

    gsap.from(chars, {
      y: isMobile ? 30 : 60,
      opacity: 0,
      duration: isMobile ? 0.4 : 0.6,
      stagger: isMobile ? 0.02 : 0.03,
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
