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
          {seg.text.split(/(\s+)/).map((token, k) => {
            if (token === "") return null;
            // Whitespace between words: a normal text node, so the browser
            // (not our per-char spans) decides where the line can break.
            if (/^\s+$/.test(token)) return token;

            // A word: keep it on one line by wrapping its char-spans together.
            return (
              <span key={`${i}-${k}`} className="inline-block whitespace-nowrap">
                {token.split("").map((char, j) => (
                  <span
                    key={`${i}-${k}-${j}`}
                    className={`inline-block hero-char ${seg.highlight ? "text-brand-accent" : ""}`}
                  >
                    {char}
                  </span>
                ))}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
