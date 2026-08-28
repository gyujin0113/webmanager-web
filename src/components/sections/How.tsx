import { Code2, Inbox, ShieldCheck } from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import FeatureCard from "@/components/ui/FeatureCard";

/** Three things people are afraid of when they hear "AI 위젯" — answered in order. */
const facts = [
  {
    icon: ShieldCheck,
    title: "미리 작성한 질문과 답으로만 동작합니다",
    description: "AI가 그때그때 지어내는 답이 없습니다. 없는 말을 할 가능성 자체가 없습니다.",
  },
  {
    icon: Code2,
    title: "코드를 건드리지 않습니다",
    description: "스크립트 한 줄이 전부입니다. 사이트와 완전히 격리돼 돌아가고, 용량은 11KB입니다.",
  },
  {
    icon: Inbox,
    title: "못 찾은 질문은 사장님께",
    description: "방문자가 물었는데 답이 없던 질문을 매월 리포트로 모아 알려드립니다.",
  },
];

export default function How() {
  return (
    <section
      id="how"
      className="min-h-dvh md:h-dvh md:pt-(--header-h) md:pb-0 md:snap-start scroll-mt-(--header-h) md:scroll-mt-0 flex items-center py-16 bg-surface"
    >
      <Container>
        <ScrollReveal>
          <div className="text-center mb-[clamp(1.5rem,4vh,3rem)]">
            <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold tracking-tight">
              챗봇이 아닙니다
            </h2>
            <p className="mt-[clamp(0.75rem,2vh,1rem)] text-muted-foreground">
              똑똑한 척하지 않습니다. 정해진 답만, 정확하게 안내합니다.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-[clamp(1rem,2.5vh,1.5rem)] max-w-5xl mx-auto">
          {facts.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.1}>
              <FeatureCard
                icon={item.icon}
                title={item.title}
                description={item.description}
                variant="solution"
              />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
