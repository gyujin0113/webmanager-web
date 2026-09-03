import Image from "next/image";
import { ChevronRight, MessageSquare } from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

const CAPTION = "국내 바이오 제조사 적용 중";

/**
 * The three steps carry numbers that match the callout dots drawn on the frame,
 * so the picture and the explanation read as one thing instead of two columns.
 */
const steps = [
  {
    title: "질문을 누르면",
    description: "사이트에 맞춰 미리 써둔 질문 목록에서 하나를 고릅니다.",
  },
  {
    title: "그 페이지로 이동",
    description: "답과 함께, 답이 있는 페이지로 바로 데려다줍니다.",
  },
  {
    title: "못 찾은 질문은 문의 폼으로",
    description: "목록에 없던 질문은 문의 폼에 자동으로 채워져 사장님께 옵니다.",
  },
];

interface ShowcaseProps {
  /**
   * Anonymized screenshot of a live install, e.g. `/showcase/site-1.webp`.
   * Until one is approved for publication the annotated mockup below stands in.
   */
  showcaseImageSrc?: string;
}

function NumberDot({ n, className = "" }: { n: number; className?: string }) {
  return (
    <span
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-accent text-xs font-bold text-white shadow-[0_0_0_4px_rgba(37,99,235,0.25)] ${className}`}
    >
      {n}
    </span>
  );
}

/** Skeleton of a customer page with the widget open, annotated with ①②③ callouts. */
function SiteMockup() {
  const chips = ["제품 문의는 어디로?", "가격이 얼마예요?", "오시는 길"];
  return (
    <div aria-hidden="true" className="pointer-events-none relative h-[300px] select-none bg-[#f2f3f6]">
      {/* Fake site header */}
      <div className="flex items-center justify-between border-b border-[#111827]/[0.06] bg-white px-4 py-3">
        <span className="h-3 w-[74px] rounded bg-[#d3d7df]" />
        <span className="flex gap-2">
          <span className="h-2 w-8 rounded bg-[#e2e5ea]" />
          <span className="h-2 w-8 rounded bg-[#e2e5ea]" />
          <span className="h-2 w-8 rounded bg-[#e2e5ea]" />
        </span>
      </div>
      {/* Fake page content — ② the section the widget lands the visitor on */}
      <div className="flex flex-col gap-2.5 px-4 py-5">
        <span className="h-4 w-[190px] rounded bg-[#c8cdd7]" />
        <span className="h-2 w-[240px] rounded bg-[#dde0e6]" />
        <span className="h-2 w-[220px] rounded bg-[#dde0e6]" />
        <span className="relative mt-2 w-[150px]">
          <span className="block h-[34px] w-full rounded-lg border-[1.5px] border-dashed border-brand-accent bg-[#e6e9ee]" />
          <NumberDot n={2} className="absolute -right-2.5 -top-2.5" />
        </span>
      </div>
      {/* Open widget panel (miniature) */}
      <div className="absolute bottom-3 right-3 flex h-[224px] w-[172px] flex-col overflow-hidden rounded-xl bg-white text-[#111827] shadow-[0_24px_64px_-16px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,0,0,0.05)]">
        <div
          className="flex items-center gap-1.5 px-2.5 py-2 text-white"
          style={{ background: "linear-gradient(135deg, #1e40af 0%, #17307f 100%)" }}
        >
          <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[7px] bg-white/[0.18]">
            <MessageSquare className="h-3 w-3" strokeWidth={2} />
          </span>
          <span className="text-[10px] font-bold leading-tight">무엇을 도와드릴까요?</span>
        </div>
        <div className="flex flex-1 flex-col gap-1.5 bg-[#f4f5f7] p-2">
          <span className="relative">
            <span className="flex flex-col overflow-hidden rounded-[10px] border border-[#111827]/[0.08] bg-white">
              {chips.map((chip, i) => (
                <span
                  key={chip}
                  className={`flex min-h-[30px] items-center justify-between gap-1.5 py-1.5 pl-2.5 pr-2 text-[9.5px] leading-snug ${
                    i > 0 ? "border-t border-[#111827]/[0.08]" : ""
                  }`}
                >
                  {chip}
                  <ChevronRight className="h-2.5 w-2.5 shrink-0 text-[#9ca3af]" strokeWidth={2} />
                </span>
              ))}
            </span>
            <NumberDot n={1} className="absolute -left-2.5 -top-2" />
          </span>
          <span className="relative mt-auto">
            <span className="flex h-7 items-center rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-2.5 text-[9.5px] text-[#9ca3af]">
              직접 질문하기
            </span>
            <NumberDot n={3} className="absolute -right-2 -top-2" />
          </span>
        </div>
      </div>
    </div>
  );
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
      {showcaseImageSrc ? (
        <div className="relative aspect-video bg-[#0a0a0a]">
          <Image
            src={showcaseImageSrc}
            alt={CAPTION}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <SiteMockup />
      )}
      {/* Proof band — the one true fact we have, promoted instead of a gray caption. */}
      <div className="flex items-center justify-center gap-2 border-t border-brand-accent/20 bg-brand-accent/[0.08] py-3">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        <p className="text-[13px] font-bold text-foreground">{CAPTION}</p>
      </div>
    </div>
  );
}

export default function Showcase({ showcaseImageSrc }: ShowcaseProps) {
  return (
    <section
      id="showcase"
      className="min-h-dvh md:h-dvh md:pt-(--header-h) md:pb-0 md:snap-start scroll-mt-(--header-h) md:scroll-mt-0 flex items-center py-16"
    >
      <Container>
        <ScrollReveal>
          <div className="text-center mb-[clamp(1.5rem,4vh,3rem)]">
            <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold tracking-tight">
              이미 쓰고 있는 사이트
            </h2>
            <p className="mt-[clamp(0.75rem,2vh,1rem)] text-muted-foreground">
              방문자가 질문을 누르는 순간 무슨 일이 일어나는지 보세요.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-[clamp(2rem,5vh,3rem)] max-w-5xl mx-auto">
          <ScrollReveal>
            <BrowserFrame showcaseImageSrc={showcaseImageSrc} />
          </ScrollReveal>

          <div className="space-y-[clamp(1rem,2.5vh,1.5rem)]">
            {steps.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 0.1}>
                <div className="flex gap-4">
                  <NumberDot n={i + 1} className="mt-0.5" />
                  <div>
                    <h3 className="text-base font-bold">{step.title}</h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
