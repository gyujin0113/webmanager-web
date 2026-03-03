import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ContactForm from "@/components/ui/ContactForm";

export default function CTA() {
  return (
    <section
      id="contact"
      className="min-h-dvh md:min-h-dvh md:snap-start flex flex-col"
    >
      <div className="flex-1 flex items-center relative overflow-hidden py-16 md:py-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-brand-accent/[0.06] rounded-full blur-3xl pointer-events-none" />

        <Container className="relative z-10 max-w-lg">
          <ScrollReveal>
            <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold tracking-tight text-center">
              프로젝트를 시작해 보세요
            </h2>
            <p className="mt-3 text-sm text-muted-foreground text-center">
              부담 없이 문의해 주세요. 24시간 내에 회신드립니다.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mt-8">
              <ContactForm />
              <p className="mt-4 text-xs text-muted-foreground text-right">
                카카오톡이 편하신가요?{" "}
                <a
                  href="https://open.kakao.com/me/webmanager"
                  className="text-foreground/60 underline underline-offset-2 hover:text-foreground transition-colors"
                >
                  오픈채팅으로 문의하기
                </a>
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </div>

      <footer className="border-t border-white/[0.06] py-6 text-sm text-muted-foreground">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; 2025 WebManager. All rights reserved.</p>
          <a
            href="mailto:contact@webmanager.co.kr"
            className="hover:text-foreground transition-colors cursor-pointer py-2"
          >
            이메일 문의
          </a>
        </Container>
      </footer>
    </section>
  );
}
