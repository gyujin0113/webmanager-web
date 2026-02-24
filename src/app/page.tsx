import Header from "@/components/layout/Header";
import DotNav from "@/components/ui/DotNav";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import Solution from "@/components/sections/Solution";
import Pricing from "@/components/sections/Pricing";
import Process from "@/components/sections/Process";
import Portfolio from "@/components/sections/Portfolio";
import FAQ from "@/components/sections/FAQ";
import CTA from "@/components/sections/CTA";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "WebManager",
      url: "https://webmanager.co.kr",
      description:
        "홈페이지 제작부터 유지보수까지 올인원. 수정 무제한, 빠른 제작, 합리적인 가격으로 웹사이트를 만들어드립니다.",
    },
    {
      "@type": "ProfessionalService",
      name: "WebManager",
      url: "https://webmanager.co.kr",
      description:
        "홈페이지 제작 · 유지보수 에이전시. 수정 무제한, 빠른 제작, 합리적인 가격.",
      areaServed: {
        "@type": "Country",
        name: "KR",
      },
      serviceType: [
        "홈페이지 제작",
        "웹사이트 유지보수",
        "랜딩페이지 제작",
        "반응형 웹 개발",
      ],
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <DotNav />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Pricing />
        <Process />
        <Portfolio />
        <FAQ />
        <CTA />
      </main>
    </>
  );
}
