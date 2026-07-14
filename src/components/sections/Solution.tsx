import { LockOpen, Infinity, TrendingUp } from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import FeatureCard from "@/components/ui/FeatureCard";

const solutions = [
  {
    icon: LockOpen,
    title: "완전한 소유권 이전",
    description: <>모든 소스코드와 관리자 권한을<br />그대로 구현하여 양도드립니다.</>,
  },
  {
    icon: Infinity,
    title: "추가금 없는 무제한 수정",
    description: <>월 구독료 하나로, 모든 수정을<br />전담 매니저처럼 처리합니다.</>,
  },
  {
    icon: TrendingUp,
    title: "합리적인 관리 비용",
    description: <>불필요한 거품을 빼고,<br />합리적인 가격으로 관리합니다.</>,
  },
];

export default function Solution() {
  return (
    <section id="solution" className="min-h-dvh md:h-dvh md:snap-start flex items-center py-16 md:py-0">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold tracking-tight">
              Web Manager가 구출합니다
            </h2>
            <p className="mt-4 text-muted-foreground">
              방치된 웹사이트, 저희가 되살립니다.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {solutions.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.1}>
              <FeatureCard icon={item.icon} title={item.title} description={item.description} variant="solution" />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
