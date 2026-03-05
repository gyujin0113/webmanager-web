import { Search, Copy, Rocket, RefreshCw } from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "현황 진단",
    description: "현재 사이트 상태를 무료로 분석합니다. 복원 범위와 견적을 안내드립니다.",
  },
  {
    icon: Copy,
    step: "02",
    title: "클론 구축",
    description: "기존 디자인을 그대로 최신 환경으로 복원합니다. 평균 2주 내 완료.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "관리 시작",
    description: "도메인 연결, 배포 완료. 이제부터 모든 수정은 저희가 처리합니다.",
  },
  {
    icon: RefreshCw,
    step: "04",
    title: "무제한 수정",
    description: "텍스트, 이미지, 배너 등 운영 수정을 추가 비용 없이 무제한 처리합니다.",
  },
];

export default function Process() {
  return (
    <section id="process" className="min-h-dvh md:h-dvh md:snap-start flex items-center py-16 md:py-0">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold tracking-tight">진행 과정</h2>
            <p className="mt-4 text-muted-foreground">
              진단부터 관리까지, 4단계로 심플하게.
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
