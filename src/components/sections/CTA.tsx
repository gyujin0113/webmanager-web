import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";

export default function CTA() {
  return (
    <section id="contact" className="h-dvh snap-start flex flex-col">
      <div className="flex-1 flex items-center">
        <Container>
          <FadeIn>
            <div className="rounded-3xl bg-foreground text-white py-16 px-8 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                지금 바로 시작하세요
              </h2>
              <p className="mt-4 text-white/60 max-w-lg mx-auto">
                무료 상담을 통해 현재 사이트의 개선 포인트와 예상 비용을
                안내받으세요. 부담 없이 문의해 주세요.
              </p>
              <div className="mt-8">
                <a
                  href="https://open.kakao.com/"
                  className="inline-flex items-center justify-center rounded-lg px-8 py-3.5 text-sm font-medium border border-white/20 hover:border-white text-cta cursor-pointer transition-all duration-200"
                >
                  무료 상담 신청하기
                </a>
              </div>
            </div>
          </FadeIn>
        </Container>
      </div>
      <footer className="border-t border-border py-6 text-sm text-muted">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; 2025 Generalist Lab. All rights reserved.</p>
          <a href="mailto:hello@generalistlab.com" className="hover:text-foreground transition-colors cursor-pointer">
            이메일 문의
          </a>
        </Container>
      </footer>
    </section>
  );
}
