"use client";

import { useEffect, useState } from "react";

const allSections = ["hero", "problem", "solution", "pricing", "process", "faq", "contact"];

const dotSections = [
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "pricing", label: "Pricing" },
  { id: "process", label: "Process" },
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

  const hidden = active === "hero" || active === "contact";

  return (
    <nav className={`fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 transition-opacity duration-300 ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
      {dotSections.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          aria-label={label}
          className="group flex items-center justify-end gap-2"
        >
          <span className="text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {label}
          </span>
          <span
            className={`block rounded-full transition-all duration-300 ${
              active === id
                ? "w-3 h-3 bg-accent"
                : "w-2 h-2 bg-border hover:bg-muted"
            }`}
          />
        </a>
      ))}
    </nav>
  );
}
