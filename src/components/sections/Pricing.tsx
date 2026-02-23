import { Check } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/ui/ScrollReveal";

const plans = [
  {
    name: "초기 제작비",
    price: "150만원~",
    period: "1회",
    description: "기존 사이트 클론 + 성능 최적화 + 반응형 구현",
    features: [
      "기존 디자인 1:1 클론",
      "Next.js 기반 초고속 사이트",
      "모바일 완벽 대응",
      "SEO 기본 설정",
      "Cloudflare 배포",
    ],
    popular: false,
  },
  {
    name: "월 유지비",
    price: "30만원~",
    period: "/월",
    description: "수정 무제한 + 호스팅 + 보안 + 성능 모니터링",
    features: [
      "콘텐츠 수정 무제한",
      "호스팅 & 도메인 관리",
      "SSL 인증서 & 보안",
      "성능 모니터링 & 리포트",
      "48시간 내 대응",
    ],
    popular: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="min-h-dvh md:h-dvh md:snap-start flex items-center py-20 md:py-0 bg-surface">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              투명한 가격 정책
            </h2>
            <p className="mt-4 text-muted-foreground">
              숨겨진 비용 없이, 명확한 가격으로 안내드립니다.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 0.15}>
              <div className="relative h-full">
                {plan.popular && (
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-brand-accent via-purple-500 to-brand-accent bg-[length:200%_100%] animate-gradient-x" />
                )}
                <div
                  className={`relative rounded-2xl p-6 sm:p-8 h-full flex flex-col ${
                    plan.popular
                      ? "bg-[#0f0f0f]"
                      : "bg-white/[0.04] border border-white/[0.06]"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-6 bg-brand-accent text-white text-xs font-medium px-3 py-1 rounded-full">
                      추천
                    </span>
                  )}
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                  <ul className="mt-4 space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check className="w-4 h-4 text-brand-accent mt-0.5 shrink-0" strokeWidth={2} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    href="#contact"
                    variant="primary"
                    className={`mt-6 w-full ${
                      plan.popular
                        ? "bg-brand-accent text-white border-brand-accent hover:bg-brand-accent-dark"
                        : ""
                    }`}
                  >
                    상담 신청
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
