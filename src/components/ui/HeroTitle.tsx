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
