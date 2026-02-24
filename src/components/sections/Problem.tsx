import { Wrench, Hourglass, Banknote } from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import FeatureCard from "@/components/ui/FeatureCard";

const problems = [
  {
    icon: Wrench,
    title: "이해가지 않는 추가금",
    description: <>텍스트 하나 고치는데 며칠,<br />수정할 때마다 추가되는 견적 압박?</>,
  },
  {
    icon: Hourglass,
    title: "느린 개발 속도",
    description: <>한 달 넘게 걸리는 제작 기간,<br />오픈 시점만 기다리다 지치셨나요?</>,
  },
  {
    icon: Banknote,
    title: "비싼 제작 비용",
    description: <>부르는 게 값인 거품 낀 견적서,<br />아직도 수백만 원씩 내시나요?</>,
  },
];

export default function Problem() {
  return (
    <section id="problem" className="min-h-dvh md:h-dvh md:snap-start flex items-center py-20 md:py-0 bg-surface">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              이런 고민, 하고 계시지 않나요?
            </h2>
            <p className="mt-4 text-muted-foreground">
              많은 사업자분들이 겪고 있는 웹사이트 문제들입니다.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
          {problems.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.1}>
              <FeatureCard icon={item.icon} title={item.title} description={item.description} />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
