"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/ui/ScrollReveal";
import {
  ANNUAL_FREE_MONTHS,
  TRIAL_CATALOG_MAX,
  TRIAL_DAYS,
  WIDGET_ANNUAL,
  WIDGET_CATALOG,
  WIDGET_MONTHLY,
  won,
} from "@/lib/pricing";

const TRIAL_ANCHOR = "#trial";

/**
 * One paid tier, on purpose. Splitting it into named grades would make the page
 * longer and the decision harder — simplicity is the product.
 */
const plans = [
  {
    name: `무료 체험 ${TRIAL_DAYS}일`,
    target: "우리 사이트에 맞는지 먼저 확인",
    features: [
      "카드 등록도, 약정도 없음",
      `질문·답 ${TRIAL_CATALOG_MAX}개까지 — 저희가 작성`,
      "체험 종료 시 리포트 1회",
      `${TRIAL_DAYS}일 후 자동 종료 — 버튼만 사라지고 사이트는 그대로`,
    ],
    cta: "체험 신청",
    popular: false,
  },
  {
    name: "가이드 위젯",
    target: "체험이 끝나고 계속 쓰실 때",
    features: [
      `질문·답 ${WIDGET_CATALOG}개 + 매월 갱신 요청 무제한`,
      "매월 리포트 — 답 못 한 질문 전부",
      "기존 문의 폼·전화로 프리필 연결",
      "워드프레스·아임웹·카페24·윅스·직접 만든 사이트 전부",
      "월 결제는 약정 없음",
    ],
    cta: "체험으로 시작",
    popular: true,
  },
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section
      id="pricing"
      className="min-h-dvh md:h-dvh md:snap-start scroll-mt-24 flex items-center py-16 md:py-0"
    >
      <Container>
        <ScrollReveal>
          <div className="text-center mb-8">
            <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold tracking-tight">
              가격은 하나입니다
            </h2>
            <p className="mt-4 text-muted-foreground">
              등급도, 추가금도 없습니다. 쓰는 만큼이 아니라 정액입니다.
            </p>
          </div>
        </ScrollReveal>

        {/* Billing period toggle */}
        <ScrollReveal>
          <div className="flex items-center justify-center gap-3 mb-8">
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`relative text-sm font-medium px-4 py-2 rounded-full transition-colors cursor-pointer ${
                isAnnual
                  ? "bg-brand-accent text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              연 결제
              {isAnnual && (
                <span className="absolute -top-2 -right-2 whitespace-nowrap bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {ANNUAL_FREE_MONTHS}개월 무료
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`text-sm font-medium px-4 py-2 rounded-full transition-colors cursor-pointer ${
                !isAnnual
                  ? "bg-brand-accent text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              월 결제
            </button>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
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

                  <div className="mt-5">
                    {plan.popular ? (
                      <>
                        <div className="flex items-baseline gap-1">
                          <span className="text-[clamp(1.5rem,4vw,2.25rem)] font-black">
                            {won(isAnnual ? WIDGET_ANNUAL : WIDGET_MONTHLY)}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            {isAnnual ? "/년" : "/월"}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          {isAnnual
                            ? `월 결제 시 ${won(WIDGET_MONTHLY)}/월`
                            : `연 결제 시 ${won(WIDGET_ANNUAL)} — ${ANNUAL_FREE_MONTHS}개월 무료`}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-baseline gap-1">
                          <span className="text-[clamp(1.5rem,4vw,2.25rem)] font-black">
                            {won(0)}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          {TRIAL_DAYS}일 동안, 조건 없이
                        </p>
                      </>
                    )}
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
                    href={TRIAL_ANCHOR}
                    variant="primary"
                    className={`mt-6 w-full ${
                      plan.popular
                        ? "bg-brand-accent text-white border-brand-accent hover:bg-brand-accent-dark"
                        : ""
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            제작·리뉴얼은 하지 않습니다. 위젯만 정직하게. (VAT 별도)
          </p>
        </ScrollReveal>
      </Container>
    </section>
  );
}
