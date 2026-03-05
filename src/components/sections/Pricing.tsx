"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/ui/ScrollReveal";

const plans = [
  {
    name: "베이직",
    target: "1~5페이지 소개 사이트",
    monthlyPrice: "5만원",
    cloneAnnual: "무료",
    cloneMonthly: "50만원",
    features: [
      "콘텐츠 수정 무제한",
      "호스팅 · SSL 관리",
      "보안 업데이트",
      "모바일 반응형",
      "48시간 내 대응",
    ],
    popular: false,
  },
  {
    name: "스탠다드",
    target: "여러 페이지 + SEO 관리",
    monthlyPrice: "15만원",
    cloneAnnual: "무료",
    cloneMonthly: "100만원",
    features: [
      "베이직 전체 포함",
      "SEO 최적화 · 검색 등록",
      "성능 모니터링 · 리포트",
      "이미지 · 배너 디자인",
      "24시간 내 대응",
    ],
    popular: true,
  },
  {
    name: "프로",
    target: "로그인 · 관리자 · DB 기능",
    monthlyPrice: "25만원",
    cloneAnnual: "무료~50만원",
    cloneMonthly: "별도 견적",
    features: [
      "스탠다드 전체 포함",
      "관리자 페이지 구축",
      "데이터베이스 연동",
      "기능 개발 · 확장",
      "우선 대응",
    ],
    popular: false,
  },
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="min-h-dvh md:h-dvh md:snap-start flex items-center py-16 md:py-0 bg-surface">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-8">
            <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold tracking-tight">
              투명한 가격 정책
            </h2>
            <p className="mt-4 text-muted-foreground">
              숨겨진 비용 없이, 명확한 가격으로 안내드립니다.
            </p>
          </div>
        </ScrollReveal>

        {/* Toggle */}
        <ScrollReveal>
          <div className="flex items-center justify-center gap-3 mb-8">
            <button
              onClick={() => setIsAnnual(true)}
              className={`relative text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                isAnnual
                  ? "bg-brand-accent text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              연간 계약
              {isAnnual && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  인기
                </span>
              )}
            </button>
            <button
              onClick={() => setIsAnnual(false)}
              className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                !isAnnual
                  ? "bg-brand-accent text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              월간 계약
            </button>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 0.1}>
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
                  <p className="mt-1 text-xs text-muted-foreground">{plan.target}</p>

                  <div className="mt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-muted-foreground">클론(복원)</span>
                      <span className="ml-auto text-sm font-bold">
                        {isAnnual ? plan.cloneAnnual : plan.cloneMonthly}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-[clamp(1.5rem,4vw,2.25rem)] font-black">{plan.monthlyPrice}</span>
                      <span className="text-muted-foreground text-sm">/월</span>
                    </div>
                  </div>

                  <ul className="mt-5 space-y-2.5 flex-1">
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

        <ScrollReveal>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            연간 계약 시 클론(복원) 비용이 무료 또는 대폭 할인됩니다. VAT 별도.
          </p>
        </ScrollReveal>
      </Container>
    </section>
  );
}
