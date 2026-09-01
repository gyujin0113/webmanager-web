"use client";

import { useId, useState } from "react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Footer from "@/components/layout/Footer";
import { KAKAO_URL } from "@/lib/formConfig";
import { TRIAL_DAYS, WIDGET_MONTHLY, manwon } from "@/lib/pricing";

/**
 * 반론 처리 순서: 가장 큰 불안(챗GPT?)부터 속도 → 플랫폼 → 체험 종료 → 작성 주체 →
 * 해지 → 범위 순으로 내려간다. 스크롤 끝까지 온 사람이 가장 뜨거운 리드라, 섹션 끝에
 * CTA 밴드로 페이지를 닫는다.
 */
const faqs = [
  {
    question: "챗GPT 같은 건가요?",
    answer:
      "아닙니다. 미리 작성해 둔 질문과 답으로만 동작해서, 없는 말을 지어낼 가능성 자체가 없습니다.",
  },
  {
    question: "사이트가 느려지나요?",
    answer:
      "위젯은 16KB이고 페이지가 다 뜬 뒤에 실행됩니다. 사이트 코드와 완전히 분리돼 돌아가서 속도에 영향을 주지 않습니다.",
  },
  {
    question: "우리 사이트는 워드프레스인데요? 아임웹·카페24도 되나요?",
    answer:
      "스크립트 한 줄을 넣을 수 있는 사이트면 전부 됩니다. 워드프레스·아임웹·카페24·윅스는 물론, 직접 만든 사이트도 전부 지원합니다.",
  },
  {
    question: "체험이 끝나면 어떻게 되나요?",
    answer: `${TRIAL_DAYS}일이 지나면 버튼이 자동으로 사라집니다. 사이트에는 아무 영향이 없고, 종료 7일 전에 미리 안내드립니다.`,
  },
  {
    question: "질문은 누가 쓰나요?",
    answer:
      "저희가 사이트를 직접 보고 작성해서 확인받습니다. 문구가 마음에 안 드시면 수정 요청은 횟수 제한 없이 받습니다.",
  },
  {
    question: "해지는 어떻게 하나요?",
    answer: `월 ${manwon(WIDGET_MONTHLY)} 결제는 약정이 없어 말씀만 주시면 바로 처리됩니다. 연 결제는 남은 기간만큼 환불을 상담해 드립니다.`,
  },
  {
    question: "홈페이지 제작도 하나요?",
    answer:
      "아니요, 위젯만 합니다. 잘하는 하나만 정직하게 하는 편이 서로에게 낫다고 판단했습니다.",
  },
];

function AccordionItem({
  question,
  answer,
  defaultOpen = false,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className="border-b border-white/[0.06]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between py-4 short:py-3 text-left cursor-pointer"
      >
        <span className="font-medium pr-4 text-sm sm:text-base">{question}</span>
        <span
          className={`shrink-0 w-8 h-8 short:w-6 short:h-6 flex items-center justify-center text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      {/*
        max-h-0 은 시각적으로만 접는다 — aria-hidden·inert 가 없으면 스크린리더와 Tab 이
        닫힌 답변까지 들어간다. inert 는 React 19 의 boolean prop.
      */}
      <div
        id={panelId}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-60 pb-4 short:pb-3" : "max-h-0"
        }`}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section
      id="faq"
      className="min-h-dvh md:pt-(--header-h) md:snap-start scroll-mt-(--header-h) md:scroll-mt-0 flex flex-col"
    >
      {/*
        마지막 섹션이라 md 도 h-dvh 고정 대신 min-h-dvh — 첫 문항 기본 열림 + CTA 밴드만큼
        자연스럽게 자라도 다음 섹션이 없어 스냅 리듬을 깨지 않는다 (스냅은 어차피 proximity).
      */}
      <div className="flex-1 flex items-center py-16 md:py-[clamp(0.75rem,2vh,2rem)]">
        <Container className="max-w-3xl">
          <ScrollReveal>
            <div className="text-center mb-[clamp(1rem,2.5vh,2rem)]">
              <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold">자주 묻는 질문</h2>
              <p className="mt-[clamp(0.75rem,2vh,1rem)] text-muted-foreground">
                여기에 없는 건 카카오톡으로 물어봐 주세요.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div>
              {faqs.map((faq, i) => (
                /* 첫 문항 기본 열림 — 전부 닫혀 있으면 내용 없는 섹션처럼 보인다. */
                <AccordionItem key={faq.question} {...faq} defaultOpen={i === 0} />
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="mt-[clamp(1.5rem,3.5vh,2.5rem)] rounded-2xl border border-brand-accent/25 bg-brand-accent/[0.05] px-6 py-7 text-center">
              <p className="text-base sm:text-lg font-bold">
                {TRIAL_DAYS}일 써보고 결정하세요. 오늘은 신청만 하면 됩니다.
              </p>
              <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <a
                  href="#trial"
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg border border-brand-accent bg-gradient-to-b from-[#3B82F6] to-brand-accent px-7 py-3 text-sm font-bold text-white shadow-lg shadow-brand-accent/20 transition-all duration-200 hover:brightness-110 sm:w-auto"
                >
                  {TRIAL_DAYS}일 무료로 달아보기
                </a>
                <a
                  href={KAKAO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 text-sm text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
                >
                  카카오톡으로 물어보기
                </a>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </div>
      <Footer />
    </section>
  );
}
