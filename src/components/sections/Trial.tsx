import { Check } from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TrialForm from "@/components/ui/TrialForm";
import { KAKAO_URL } from "@/lib/formConfig";
import { TRIAL_CATALOG_MAX, TRIAL_DAYS } from "@/lib/pricing";

/**
 * Risk-reversal bullets: the bold lead-in names the risk we removed, the rest
 * says how. Every fact comes from pricing.ts — no invented promises.
 */
const included = [
  { lead: "카드 등록 없음.", rest: "결제 정보를 아예 받지 않습니다" },
  { lead: "손 갈 일 없음.", rest: `질문 ${TRIAL_CATALOG_MAX}개 작성부터 설치까지 저희가 합니다` },
  { lead: `${TRIAL_DAYS}일 후 버튼만 사라짐.`, rest: "사이트에는 아무 영향이 없습니다" },
];

/** 폼 이탈의 주원인인 "얼마나 걸리지? 그 다음은?"을 신청 전에 답해 둔다. */
const timeline = [
  { title: "신청서 제출", note: "1분이면 끝" },
  { title: "24시간 내 연락", note: "질문 초안 확인" },
  { title: "설치까지 저희가", note: "체험 시작" },
];

export default function Trial() {
  return (
    <section
      id="trial"
      className="min-h-dvh md:h-dvh md:pt-(--header-h) md:pb-0 md:snap-start scroll-mt-(--header-h) md:scroll-mt-0 flex items-center py-16 bg-surface relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-brand-accent/[0.06] rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid items-center gap-[clamp(1.5rem,4vh,2.5rem)] lg:grid-cols-2 lg:gap-[clamp(2rem,5vh,3.5rem)] max-w-5xl mx-auto">
          <div>
            <ScrollReveal>
              <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold tracking-tight">
                이 페이지 우하단 버튼이
                <br />
                바로 그 위젯입니다
              </h2>
              <p className="mt-[clamp(0.75rem,2vh,1rem)] text-sm text-muted-foreground leading-relaxed">
                눌러보시고 마음에 드시면, 같은 걸 사장님 홈페이지에 달아드립니다.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <ul className="mt-[clamp(1.25rem,3vh,2rem)] space-y-[clamp(0.5rem,1.6vh,0.75rem)]">
                {included.map((line) => (
                  <li key={line.lead} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-brand-accent mt-0.5 shrink-0" strokeWidth={2} />
                    <span>
                      <span className="font-bold text-foreground">{line.lead}</span> {line.rest}
                    </span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="mt-[clamp(1.5rem,3.5vh,2rem)] flex items-center">
                {timeline.map((step, i) => (
                  <div key={step.title} className="contents">
                    {i > 0 && <span className="mb-[34px] h-px flex-1 bg-brand-accent/30" />}
                    <div className="flex w-24 flex-col items-center gap-1.5 sm:w-[118px]">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-brand-accent/40 bg-brand-accent/15 text-xs font-bold text-brand-accent">
                        {i + 1}
                      </span>
                      <span className="text-center text-xs font-medium">{step.title}</span>
                      <span className="text-center text-[11px] text-muted-foreground">{step.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.15}>
            <TrialForm />
            <p className="mt-[clamp(0.5rem,2vh,1rem)] text-xs text-muted-foreground text-right">
              카카오톡이 편하신가요?{" "}
              <a
                href={KAKAO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 underline underline-offset-2 hover:text-foreground transition-colors"
              >
                오픈채팅으로 문의하기
              </a>
            </p>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
