"use client";

import { useId, useState } from "react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Footer from "@/components/layout/Footer";
import { TRIAL_DAYS, WIDGET_MONTHLY, manwon } from "@/lib/pricing";

const faqs = [
  {
    question: "우리 사이트는 워드프레스인데요? 아임웹·카페24도 되나요?",
    answer:
      "스크립트 한 줄을 넣을 수 있는 사이트면 전부 됩니다. 워드프레스·아임웹·카페24·윅스는 물론, 직접 만든 사이트도 전부 지원합니다.",
  },
  {
    question: "챗GPT 같은 건가요?",
    answer:
      "아닙니다. 미리 작성해 둔 질문과 답으로만 동작해서, 없는 말을 지어낼 가능성 자체가 없습니다.",
  },
  {
    question: "질문은 누가 쓰나요?",
    answer:
      "저희가 사이트를 직접 보고 작성해서 확인받습니다. 문구가 마음에 안 드시면 수정 요청은 횟수 제한 없이 받습니다.",
  },
  {
    question: "체험이 끝나면 어떻게 되나요?",
    answer: `${TRIAL_DAYS}일이 지나면 버튼이 자동으로 사라집니다. 사이트에는 아무 영향이 없고, 종료 7일 전에 미리 안내드립니다.`,
  },
  {
    question: "사이트가 느려지나요?",
    answer:
      "위젯은 11KB이고 페이지가 다 뜬 뒤에 실행됩니다. 사이트 코드와 완전히 분리돼 돌아가서 속도에 영향을 주지 않습니다.",
  },
  {
    question: "홈페이지 제작도 하나요?",
    answer:
      "아니요, 위젯만 합니다. 잘하는 하나만 정직하게 하는 편이 서로에게 낫다고 판단했습니다.",
  },
  {
    question: "해지는 어떻게 하나요?",
    answer: `월 ${manwon(WIDGET_MONTHLY)} 결제는 약정이 없어 말씀만 주시면 바로 처리됩니다. 연 결제는 남은 기간만큼 환불을 상담해 드립니다.`,
  },
];

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="border-b border-white/[0.06]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between py-4 text-left cursor-pointer"
      >
        <span className="font-medium pr-4 text-sm sm:text-base">{question}</span>
        <span
          className={`shrink-0 w-8 h-8 flex items-center justify-center text-muted-foreground transition-transform duration-200 ${
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
          isOpen ? "max-h-60 pb-4" : "max-h-0"
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
      className="min-h-dvh md:snap-start scroll-mt-24 flex flex-col"
    >
      <div className="flex-1 flex items-center py-16 md:py-20">
        <Container className="max-w-3xl">
          <ScrollReveal>
            <div className="text-center mb-8">
              <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold">자주 묻는 질문</h2>
              <p className="mt-4 text-muted-foreground">
                여기에 없는 건 카카오톡으로 물어봐 주세요.
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
      </div>
      <Footer />
    </section>
  );
}
