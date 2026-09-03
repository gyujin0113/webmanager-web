import { ArrowRight, DoorOpen, Map, PhoneOff } from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import FeatureCard from "@/components/ui/FeatureCard";

/**
 * The problem is stated from the *visitor's* side, not the owner's — the owner
 * already knows where everything is, which is exactly why the leak is invisible.
 */
const problems = [
  {
    icon: PhoneOff,
    title: "전화번호를 못 찾는다",
    description: "연락처는 푸터 맨 아래. 스크롤하다 지쳐 그냥 창을 닫습니다.",
    answer: "질문 한 번 누르면 바로 그 자리로",
  },
  {
    icon: Map,
    title: "가격 페이지가 어디 있는지 모른다",
    description: "메뉴를 네 단계 들어가야 나오는 정보. 대부분은 도중에 포기합니다.",
    answer: "“가격이 얼마예요?” 한 번이면 가격 안내로",
  },
  {
    icon: DoorOpen,
    title: "문의는 하고 싶은데 폼까지 안 간다",
    description: "무엇부터 써야 할지 막막해서, 문의 버튼 앞에서 멈춥니다.",
    answer: "못 찾은 질문은 문의 폼에 그대로 채워서 전달",
  },
];

function CardBody({ description, answer }: { description: string; answer: string }) {
  return (
    <>
      {description}
      {/* 해결책 줄은 문제 서술보다 묻히면 안 된다 — 화살표 아이콘 + 본문색 세미볼드로 위계를 올린다. */}
      <span className="mt-3.5 flex items-start gap-2 border-t border-white/[0.06] pt-3">
        <ArrowRight className="mt-0.5 h-[15px] w-[15px] shrink-0 text-brand-accent" strokeWidth={2} />
        <span className="text-[13px] font-semibold leading-normal text-foreground">위젯: {answer}</span>
      </span>
    </>
  );
}

export default function Why() {
  return (
    <section
      id="why"
      className="min-h-dvh md:h-dvh md:pt-(--header-h) md:pb-0 md:snap-start scroll-mt-(--header-h) md:scroll-mt-0 flex items-center py-16 bg-surface"
    >
      <Container>
        <ScrollReveal>
          <div className="text-center mb-[clamp(1.5rem,4vh,3rem)]">
            <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold tracking-tight">
              방문자는 3초 안에 못 찾으면 나갑니다
            </h2>
            <p className="mt-[clamp(0.75rem,2vh,1rem)] text-muted-foreground">
              사이트에 정보가 없어서가 아니라, 어디 있는지 몰라서 나갑니다.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-[clamp(1rem,2.5vh,1.5rem)] max-w-5xl mx-auto">
          {problems.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.1}>
              <FeatureCard
                icon={item.icon}
                title={item.title}
                description={<CardBody description={item.description} answer={item.answer} />}
              />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
