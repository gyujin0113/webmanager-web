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
