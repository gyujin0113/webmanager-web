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
        "방치된 웹사이트를 구출합니다. 기존 디자인 그대로 클론 복원, 수정 무제한 월 구독 관리 서비스.",
    },
    {
      "@type": "ProfessionalService",
      name: "WebManager",
      url: "https://webmanager.co.kr",
      description:
        "웹사이트 클론 복원 · 무제한 관리 서비스. 연락 두절된 업체 대신, 기존 디자인 그대로 복원하고 월 구독으로 관리합니다.",
      email: "contact@webmanager.co.kr",
      priceRange: "₩₩",
      sameAs: ["https://open.kakao.com/me/webmanager"],
      areaServed: {
        "@type": "Country",
        name: "KR",
      },
      serviceType: [
        "웹사이트 관리",
        "웹사이트 유지보수",
        "홈페이지 클론 복원",
        "홈페이지 수정 대행",
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
