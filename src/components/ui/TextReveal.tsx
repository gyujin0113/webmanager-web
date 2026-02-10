"use client";

import { useEffect, useRef, useState } from "react";

interface Segment {
  text: string;
  highlight?: boolean;
  break?: boolean;
}

interface TextRevealProps {
  segments: Segment[];
  className?: string;
  style?: React.CSSProperties;
  charDelay?: number;
}

export default function TextReveal({
  segments,
  className = "",
  style,
  charDelay = 40,
}: TextRevealProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  let charIndex = 0;

  return (
    <h1 ref={ref} className={className} style={style}>
      {segments.map((seg, i) => (
        <span key={i}>
          {seg.break && <br />}
          {seg.text.split("").map((char) => {
            const idx = charIndex++;
            return (
              <span
                key={idx}
                className={`inline-block transition-all duration-300 ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-3"
                } ${seg.highlight ? "text-accent" : ""}`}
                style={{
                  transitionDelay: visible ? `${idx * charDelay}ms` : "0ms",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
