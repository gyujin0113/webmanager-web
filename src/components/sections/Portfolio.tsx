import { ExternalLink } from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

const works = [
  {
    title: "WebManager",
    category: "Agency Landing Page",
    description: "GSAP 스크롤 애니메이션, 다크 시네마틱 디자인, 풀 반응형",
    tech: ["Next.js", "GSAP", "Tailwind CSS"],
    href: "#hero",
    live: true,
  },
  {
    title: "Coming Soon",
    category: "E-Commerce",
    description: "새로운 프로젝트가 준비 중입니다.",
    tech: [],
    href: null,
    live: false,
  },
  {
    title: "Coming Soon",
    category: "Corporate Site",
    description: "새로운 프로젝트가 준비 중입니다.",
    tech: [],
    href: null,
    live: false,
  },
];

export default function Portfolio() {
  return (
    <section
      id="portfolio"
      className="min-h-dvh md:h-dvh md:snap-start flex items-center py-16 md:py-0 bg-surface"
    >
      <Container>
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold tracking-tight">
              Portfolio
            </h2>
            <p className="mt-4 text-muted-foreground">
              직접 확인하세요. 이 사이트가 첫 번째 작업물입니다.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {works.map((work, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div
                className={`rounded-2xl border h-full flex flex-col overflow-hidden ${
                  work.live
                    ? "border-brand-accent/20 bg-white/[0.04]"
                    : "border-white/[0.04] bg-white/[0.02] opacity-50"
                }`}
              >
                <div className="aspect-video bg-white/[0.03] flex items-center justify-center border-b border-white/[0.04]">
                  {work.live ? (
                    <span className="text-xs text-brand-accent font-medium tracking-wider uppercase">
                      Live Site
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground tracking-wider uppercase">
                      TBD
                    </span>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-xs text-brand-accent font-medium tracking-wider uppercase">
                    {work.category}
                  </span>
                  <h3 className="mt-2 text-lg font-bold">{work.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                    {work.description}
                  </p>
                  {work.tech.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                      {work.tech.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-1 rounded-md bg-white/[0.06] text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {work.href && (
                    <a
                      href={work.href}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-accent hover:underline"
                    >
                      보러 가기 <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
