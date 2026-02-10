import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import TextReveal from "@/components/ui/TextReveal";
import ScrollDown from "@/components/ui/ScrollDown";

const headlineSegments = [
  { text: "원래 디자인 그대로" },
  { text: "수정은 ", break: true },
  { text: "무제한", highlight: true },
];

export default function Hero() {
  return (
    <section id="hero" className="h-dvh snap-start flex items-center relative">
      <Container className="text-center">
        <FadeIn>
          <p className="text-sm font-medium text-muted tracking-wide mb-6">
            골치 아픈 홈페이지 관리, 이제 그만 신경 쓰세요
          </p>
        </FadeIn>
        <TextReveal
          segments={headlineSegments}
          className="font-black tracking-tight leading-[1.1]"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
        />
        <FadeIn delay={800}>
          <p className="mt-8 text-base sm:text-lg text-muted max-w-xl mx-auto leading-relaxed">
            &ldquo;텍스트 하나 바꾸는데 며칠 걸리고 돈 드나요?&rdquo;
            <br className="hidden sm:block" />
            새로 만들지 않고 엔진만 최신으로 교체해 드립니다.
            <br className="hidden sm:block" />
            <span className="text-foreground font-medium">월 구독으로 개발팀을 채용하세요.</span>
          </p>
        </FadeIn>
        <FadeIn delay={1000}>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="#contact" className="min-w-64">
              무료 진단 받기 (내 사이트 견적)
            </Button>
            <Button href="#pricing" variant="outline" className="min-w-64">
              서비스 소개서 보기
            </Button>
          </div>
        </FadeIn>
      </Container>
      <ScrollDown href="#problem" />
    </section>
  );
}
