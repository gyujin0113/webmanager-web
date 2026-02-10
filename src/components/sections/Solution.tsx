import { Zap, Infinity, Target, Rocket } from "lucide-react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";

const solutions = [
  {
    icon: Zap,
    title: "클론 + 성능 개선",
    description:
      "기존 디자인을 그대로 옮기면서 최신 기술로 속도를 극대화합니다. Core Web Vitals 올그린 달성.",
  },
  {
    icon: Infinity,
    title: "수정 무제한",
    description:
      "월 유지비에 수정이 포함되어 있습니다. 텍스트, 이미지, 레이아웃 변경 요청에 추가 비용 없이 대응합니다.",
  },
  {
    icon: Target,
    title: "올인원 관리",
    description:
      "도메인, 호스팅, SSL, 보안 업데이트까지 한 번에 관리합니다. 신경 쓸 것 없이 사업에만 집중하세요.",
  },
  {
    icon: Rocket,
    title: "빠른 제작",
    description:
      "표준화된 워크플로우로 2주 이내 제작 완료. 빠르게 시작하고, 운영하면서 개선해 나갑니다.",
  },
];

export default function Solution() {
  return (
    <section id="solution" className="h-dvh snap-start flex items-center">
      <Container>
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Generalist Lab이 해결합니다
            </h2>
            <p className="mt-4 text-muted">
              더 나은 방식으로, 더 합리적인 가격에.
            </p>
          </div>
        </FadeIn>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((item, i) => (
            <FadeIn key={item.title} delay={i * 100}>
              <div className="rounded-2xl p-6 border border-border hover:border-accent/20 transition-colors duration-300 h-full">
                <div className="w-10 h-10 rounded-lg bg-accent/5 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-accent" strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 text-base font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
