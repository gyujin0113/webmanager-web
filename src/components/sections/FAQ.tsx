"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import ScrollDown from "@/components/ui/ScrollDown";

const faqs = [
  {
    question: "기존 사이트 디자인을 그대로 옮길 수 있나요?",
    answer:
      "네, 기존 디자인을 픽셀 단위로 클론합니다. 필요에 따라 부분 개선도 가능합니다. 클론 과정에서 성능 최적화가 자동으로 적용됩니다.",
  },
  {
    question: "제작 기간은 얼마나 걸리나요?",
    answer:
      "일반적인 기업 사이트 기준 2주 이내에 완료됩니다. 페이지 수와 복잡도에 따라 달라질 수 있으며, 상담 시 정확한 일정을 안내드립니다.",
  },
  {
    question: "월 유지비에 포함되는 수정 범위는 어디까지인가요?",
    answer:
      "텍스트, 이미지 교체, 레이아웃 변경, 새 섹션 추가 등 일반적인 콘텐츠 수정이 모두 포함됩니다. 대규모 기능 추가(결제 시스템, 회원 시스템 등)는 별도 견적이 필요합니다.",
  },
  {
    question: "어떤 기술 스택을 사용하나요?",
    answer:
      "Next.js, TypeScript, Tailwind CSS를 기본 스택으로 사용하며, Cloudflare Pages에 배포합니다. 글로벌 CDN으로 어디서든 빠른 로딩 속도를 보장합니다.",
  },
  {
    question: "계약 기간 제한이 있나요?",
    answer:
      "최소 계약 기간은 없습니다. 월 단위로 유지비가 청구되며, 언제든 해지할 수 있습니다. 해지 시 소스 코드와 도메인 소유권을 모두 인계해 드립니다.",
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
    <div className="border-b border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="font-medium pr-4 text-sm sm:text-base">{question}</span>
        <span
          className={`shrink-0 text-muted transition-transform duration-200 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-40 pb-4" : "max-h-0"
        }`}
      >
        <p className="text-sm text-muted leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="h-dvh snap-start flex items-center bg-surface relative">
      <Container className="max-w-3xl">
        <FadeIn>
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold">
              자주 묻는 질문
            </h2>
          </div>
        </FadeIn>
        <FadeIn>
          <div>
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} {...faq} />
            ))}
          </div>
        </FadeIn>
      </Container>
      <ScrollDown href="#contact" />
    </section>
  );
}
