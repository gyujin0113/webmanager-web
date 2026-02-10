import { Check } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";

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
    variant: "outline" as const,
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
    variant: "primary" as const,
    popular: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="h-dvh snap-start flex items-center bg-surface">
      <Container>
        <FadeIn>
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              투명한 가격 정책
            </h2>
            <p className="mt-4 text-muted">
              숨겨진 비용 없이, 명확한 가격으로 안내드립니다.
            </p>
          </div>
        </FadeIn>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 150}>
              <div
                className={`rounded-2xl p-6 sm:p-8 border h-full flex flex-col ${
                  plan.popular
                    ? "border-foreground bg-white shadow-lg shadow-foreground/5 relative"
                    : "border-border bg-white"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-6 bg-foreground text-white text-xs font-medium px-3 py-1 rounded-full">
                    추천
                  </span>
                )}
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black">{plan.price}</span>
                  <span className="text-muted text-sm">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted">{plan.description}</p>
                <ul className="mt-4 space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm"
                    >
                      <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" strokeWidth={2} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  href="#contact"
                  variant={plan.variant}
                  className="mt-6 w-full"
                >
                  상담 신청
                </Button>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
