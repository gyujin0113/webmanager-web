import { UserX, Lock, Receipt, TrendingDown } from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import FeatureCard from "@/components/ui/FeatureCard";

const problems = [
  {
    icon: UserX,
    title: "연락 두절된 기존 업체",
    description: <>연락 끊긴 기존 업체, 방치된 웹사이트.<br />저희가 그대로 구조해 드립니다.</>,
  },
  {
    icon: Lock,
    title: "소스코드 없는 인질 상태",
    description: <>소스코드가 없어도, 권한이 없어도 괜찮습니다.<br />예전 디자인 그대로 100% 독립시켜 드립니다.</>,
  },
  {
    icon: Receipt,
    title: "수정할 때마다 추가금",
    description: <>텍스트 한 줄 고치는 데 며칠씩 대기하고 추가금까지?<br />월 구독료 하나로 무제한 수정해 드립니다.</>,
  },
  {
    icon: TrendingDown,
    title: "아까운 고정 유지보수비",
    description: <>수정할 일도 없는데 매달 나가는 비싼 유지보수비,<br />아깝지 않으신가요? 거품 낀 고정비를 확 줄여드립니다.</>,
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
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
