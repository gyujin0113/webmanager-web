import { Banknote, Clock, Gauge } from "lucide-react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";

const problems = [
  {
    icon: Banknote,
    title: "비싼 유지보수 비용",
    description:
      "매달 나가는 유지보수 비용이 부담되시나요? 작은 수정에도 추가 견적이 나오는 구조는 비효율적입니다.",
  },
  {
    icon: Clock,
    title: "수정할 때마다 추가 비용",
    description:
      "텍스트 하나 바꾸는 데도 비용이 발생하고, 응답까지 며칠씩 걸리는 경험을 하셨을 겁니다.",
  },
  {
    icon: Gauge,
    title: "느리고 무거운 사이트",
    description:
      "페이지 로딩이 3초 이상 걸리면 방문자의 53%가 이탈합니다. 속도는 곧 매출입니다.",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="h-dvh snap-start flex items-center bg-surface">
      <Container>
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              이런 고민, 하고 계시지 않나요?
            </h2>
            <p className="mt-4 text-muted-foreground">
              많은 사업자분들이 겪고 있는 웹사이트 문제들입니다.
            </p>
          </div>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((item, i) => (
            <FadeIn key={item.title} delay={i * 120}>
              <div className="bg-white rounded-2xl p-8 border border-border hover:border-brand-accent/20 transition-colors duration-300 h-full">
                <div className="w-10 h-10 rounded-lg bg-brand-accent/5 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-brand-accent" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
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
