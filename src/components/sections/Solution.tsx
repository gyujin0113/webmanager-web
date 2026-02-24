import { Infinity, Gauge, Scale } from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import FeatureCard from "@/components/ui/FeatureCard";

const solutions = [
  {
    icon: Infinity,
    title: "수정 무제한",
    description: <>월 유지비에 수정이 포함됩니다.<br />추가 비용 없이 수정해드립니다.</>,
  },
  {
    icon: Gauge,
    title: "빠른 제작",
    description: <>1달 걸릴 작업, 2주면 해결.<br />나머지는 사업에 집중하세요.</>,
  },
  {
    icon: Scale,
    title: "합리적인 가격",
    description: <>기존 디자인 그대로 구현합니다.<br />불필요한 작업을 빼 저렴합니다.</>,
  },
];

export default function Solution() {
  return (
    <section id="solution" className="min-h-dvh md:h-dvh md:snap-start flex items-center py-20 md:py-0">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Generalist Lab이 해결합니다
            </h2>
            <p className="mt-4 text-muted-foreground">
              더 투명하고, 더 합리적인 가격으로 작업합니다.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
          {solutions.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.08}>
              <FeatureCard icon={item.icon} title={item.title} description={item.description} />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
