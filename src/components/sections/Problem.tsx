import { Lock, Receipt, TrendingDown } from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import FeatureCard from "@/components/ui/FeatureCard";

const problems = [
  {
    icon: Lock,
    title: "소스코드 없는 인질 상태",
    description: <>소스코드도, 호스팅 권한도<br />전달받은게 없으신가요?</>,
  },
  {
    icon: Receipt,
    title: "수정할 때마다 추가금",
    description: <>텍스트 한 줄에 5만 원?<br />배너 하나에 일주일?</>,
  },
  {
    icon: TrendingDown,
    title: "아까운 고정 유지보수비",
    description: <>업데이트는 1년에 단 몇 번.<br />비용은 매달 수십만 원 청구.</>,
  },
];

export default function Problem() {
  return (
    <section id="problem" className="min-h-dvh md:h-dvh md:snap-start flex items-center py-16 md:py-0 bg-surface">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold tracking-tight">
              이런 고민, 하고 계신가요?
            </h2>
            <p className="mt-4 text-muted-foreground">
              사이트는 있는데, 관리가 안 되는 대표님들의 공통 고민입니다.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
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
