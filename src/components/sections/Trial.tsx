import { Check } from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TrialForm from "@/components/ui/TrialForm";
import { KAKAO_URL } from "@/lib/formConfig";
import { TRIAL_CATALOG_MAX, TRIAL_DAYS } from "@/lib/pricing";

const included = [
  `${TRIAL_DAYS}일 무료 — 카드 등록도, 약정도 없습니다`,
  `질문 ${TRIAL_CATALOG_MAX}개를 저희가 사이트를 보고 직접 작성합니다`,
  "설치는 스크립트 한 줄. 원하시면 저희가 대신 넣어드립니다",
];

export default function Trial() {
  return (
    <section
      id="trial"
      className="min-h-dvh md:min-h-dvh md:snap-start scroll-mt-24 flex items-center py-16 md:py-0 bg-surface relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-brand-accent/[0.06] rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 max-w-5xl mx-auto">
          <div>
            <ScrollReveal>
              <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold tracking-tight">
                이 페이지 우하단 버튼이
                <br />
                바로 그 위젯입니다
              </h2>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                눌러보시고 마음에 드시면, 같은 걸 사장님 홈페이지에 달아드립니다.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <ul className="mt-8 space-y-3">
                {included.map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-brand-accent mt-0.5 shrink-0" strokeWidth={2} />
                    {line}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.15}>
            <TrialForm />
            <p className="mt-4 text-xs text-muted-foreground text-right">
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
