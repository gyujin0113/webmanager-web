import Image from "next/image";
import { ArrowRight, FileText, MousePointerClick } from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

const CAPTION = "국내 바이오 제조사 적용 중";

const steps = [
  {
    icon: MousePointerClick,
    title: "질문을 누르면",
    description: "사이트에 맞춰 미리 써둔 질문 목록에서 하나를 고릅니다.",
  },
  {
    icon: ArrowRight,
    title: "그 페이지로 이동",
    description: "답과 함께, 답이 있는 페이지로 바로 데려다줍니다.",
  },
  {
    icon: FileText,
    title: "못 찾은 질문은 문의 폼으로",
    description: "목록에 없던 질문은 문의 폼에 자동으로 채워져 사장님께 옵니다.",
  },
];

interface ShowcaseProps {
  /**
   * Anonymized screenshot of a live install, e.g. `/showcase/site-1.webp`.
   * Until one is approved for publication the placeholder frame below stands in.
   */
  showcaseImageSrc?: string;
  /** One-line customer quote. Hidden entirely until we actually have one. */
  testimonial?: { quote: string; author: string };
}

function BrowserFrame({ showcaseImageSrc }: { showcaseImageSrc?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] shadow-[0_0_40px_rgba(37,99,235,0.08)]">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-white/[0.03] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
      </div>
      <div className="relative aspect-video bg-[#0a0a0a]">
        {showcaseImageSrc ? (
          <Image
            src={showcaseImageSrc}
            alt={CAPTION}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="h-10 w-10 rounded-full border border-brand-accent/30 bg-brand-accent/[0.08] shadow-[0_0_16px_rgba(37,99,235,0.25)]" />
            <p className="text-sm font-medium text-foreground/80">{CAPTION}</p>
            <p className="text-xs text-muted-foreground">
              고객사 동의 후 실제 화면으로 교체됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Showcase({ showcaseImageSrc, testimonial }: ShowcaseProps) {
  return (
    <section
      id="showcase"
      className="min-h-dvh md:h-dvh md:snap-start scroll-mt-24 flex items-center py-16 md:py-0"
    >
      <Container>
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold tracking-tight">
              이미 쓰고 있는 사이트
            </h2>
            <p className="mt-4 text-muted-foreground">
              방문자가 질문을 누르는 순간 무슨 일이 일어나는지 보세요.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12 max-w-5xl mx-auto">
          <ScrollReveal>
            <BrowserFrame showcaseImageSrc={showcaseImageSrc} />
          </ScrollReveal>

          <div className="space-y-4">
            {steps.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 0.1}>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand-accent/20 bg-brand-accent/[0.08] shadow-[0_0_12px_rgba(37,99,235,0.15)]">
                    <step.icon className="h-5 w-5 text-brand-accent" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">{step.title}</h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}

            {testimonial && (
              <ScrollReveal delay={0.3}>
                <blockquote className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <p className="text-sm leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                  <footer className="mt-2 text-xs text-muted-foreground">
                    {testimonial.author}
                  </footer>
                </blockquote>
              </ScrollReveal>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
