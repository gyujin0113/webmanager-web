import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function CTA() {
  return (
    <section
      id="contact"
      className="min-h-dvh md:h-dvh md:snap-start flex flex-col"
    >
      <div className="flex-1 flex items-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-accent/[0.06] rounded-full blur-3xl pointer-events-none" />

        <Container className="relative z-10">
          <ScrollReveal>
            <div className="rounded-3xl border border-white/[0.06] py-10 px-6 sm:py-16 sm:px-8 text-center bg-white/[0.02]">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                지금 바로 시작하세요
              </h2>
              <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
                무료 상담을 통해 현재 사이트의 개선 포인트와 예상 비용을
                안내받으세요.
                <br />
                부담 없이 문의해 주세요.
              </p>
              <div className="mt-8">
                <a
                  href="https://open.kakao.com/"
                  className="inline-flex items-center justify-center rounded-lg px-8 py-3.5 text-sm font-medium bg-brand-accent text-white hover:bg-brand-accent-dark cursor-pointer transition-all duration-200 shadow-lg shadow-brand-accent/20"
                >
                  무료 상담 신청하기
                </a>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </div>
      <footer className="border-t border-white/[0.06] py-6 text-sm text-muted-foreground">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; 2025 Generalist Lab. All rights reserved.</p>
          <a
            href="mailto:hello@generalistlab.com"
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            이메일 문의
          </a>
        </Container>
      </footer>
    </section>
  );
}
