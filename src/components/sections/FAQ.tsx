"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ScrollDown from "@/components/ui/ScrollDown";

const faqs = [
  {
    question: "소스코드가 없어도 클론이 가능한가요?",
    answer:
      "네, 소스코드 없이도 현재 웹사이트의 디자인을 그대로 복원할 수 있습니다. 화면에 보이는 디자인을 기준으로 최신 기술로 새롭게 구축합니다.",
  },
  {
    question: "기존 디자인을 100% 그대로 복원할 수 있나요?",
    answer:
      "네, 기존 디자인을 최대한 동일하게 복원합니다. 필요에 따라 부분 개선도 가능하며, 복원 과정에서 성능 최적화와 모바일 대응이 자동으로 적용됩니다.",
  },
  {
    question: "수정 무제한이면 진짜 제한이 없나요?",
    answer:
      "텍스트, 이미지 교체, 배너 변경 등 일반적인 콘텐츠 수정은 횟수 제한 없이 포함됩니다. 새 페이지 추가나 기능 개발(결제, 회원 시스템 등)은 별도 견적이 필요합니다.",
  },
  {
    question: "연간 계약과 월간 계약의 차이는 무엇인가요?",
    answer:
      "연간 계약 시 클론(복원) 비용이 무료 또는 대폭 할인됩니다. 월간 계약은 클론 비용이 별도로 발생하지만, 계약 기간 제한이 없어 자유롭게 이용할 수 있습니다.",
  },
  {
    question: "해지하면 사이트는 어떻게 되나요?",
    answer:
      "해지 시 모든 소스코드와 관리자 권한을 100% 인계해 드립니다. 사이트는 고객님 소유이며, 다른 업체로 이전하거나 직접 운영하실 수 있습니다.",
  },
];

function AccordionItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/[0.06]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="font-medium pr-4 text-sm sm:text-base">
          {question}
        </span>
        <span
          className={`shrink-0 w-8 h-8 flex items-center justify-center text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-60 pb-4" : "max-h-0"
        }`}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section
      id="faq"
      className="min-h-dvh md:h-dvh md:snap-start flex items-center py-16 md:py-0 relative"
    >
      <Container className="max-w-3xl">
        <ScrollReveal>
          <div className="text-center mb-8">
            <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold">자주 묻는 질문</h2>
            <p className="mt-4 text-muted-foreground">
              궁금한 점이 있으시면 편하게 문의해 주세요.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div>
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} {...faq} />
            ))}
          </div>
        </ScrollReveal>
      </Container>
      <ScrollDown href="#contact" />
    </section>
  );
}
