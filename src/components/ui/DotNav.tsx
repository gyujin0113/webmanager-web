"use client";

import { useEffect, useState } from "react";

const allSections = ["hero", "why", "showcase", "how", "pricing", "trial", "faq"];

const dotSections = [
  { id: "why", label: "왜" },
  { id: "showcase", label: "사례" },
  { id: "how", label: "원리" },
  { id: "pricing", label: "가격" },
  { id: "trial", label: "체험" },
  { id: "faq", label: "FAQ" },
];

export default function DotNav() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    allSections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0.5 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const hidden = active === "hero";

  return (
    <nav className={`fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3 transition-opacity duration-300 ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
      {dotSections.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          aria-label={label}
          className="group flex items-center justify-end gap-2"
        >
          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {label}
          </span>
          <span
            className={`block rounded-full transition-all duration-300 ${
              active === id
                ? "w-3 h-3 bg-brand-accent"
                : "w-2 h-2 bg-white/20 hover:bg-white/40"
            }`}
          />
        </a>
      ))}
    </nav>
  );
}
