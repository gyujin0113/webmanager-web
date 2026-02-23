import { MessageSquare, Code2, Globe, Settings } from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

const steps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "상담",
    description: "현재 사이트와 요구사항을 파악합니다. 무료로 진행됩니다.",
  },
  {
    icon: Code2,
    step: "02",
    title: "제작",
    description: "디자인 클론과 성능 최적화를 동시에 진행합니다.",
  },
  {
    icon: Globe,
    step: "03",
    title: "배포",
    description: "최종 확인 후 도메인 연결과 함께 사이트를 오픈합니다.",
  },
  {
    icon: Settings,
    step: "04",
    title: "운영",
    description: "월 유지비로 수정, 관리, 모니터링을 지속합니다.",
  },
];

export default function Process() {
  return (
    <section id="process" className="min-h-dvh md:h-dvh md:snap-start flex items-center py-20 md:py-0">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">진행 과정</h2>
            <p className="mt-4 text-muted-foreground">
              상담부터 운영까지, 4단계로 심플하게.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, i) => (
            <ScrollReveal key={item.step} delay={i * 0.1}>
              <div className="relative p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-brand-accent" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-bold text-brand-accent tracking-widest">
                    STEP {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-11 right-0 translate-x-1/2 text-white/10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
