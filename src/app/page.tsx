import Header from "@/components/layout/Header";
import DotNav from "@/components/ui/DotNav";
import LeadCapture from "@/components/LeadCapture";
import Hero from "@/components/sections/Hero";
import Why from "@/components/sections/Why";
import Showcase from "@/components/sections/Showcase";
import How from "@/components/sections/How";
import Pricing from "@/components/sections/Pricing";
import Trial from "@/components/sections/Trial";
import FAQ from "@/components/sections/FAQ";
import { KAKAO_URL } from "@/lib/formConfig";
import { TRIAL_DAYS, WIDGET_ANNUAL, WIDGET_MONTHLY } from "@/lib/pricing";

const siteUrl = "https://webmanager.co.kr";

const productDescription =
  `홈페이지에 스크립트 한 줄로 다는 AI 안내 위젯. 방문자가 자주 묻는 질문에 바로 답하고, 답이 있는 페이지로 안내합니다. ${TRIAL_DAYS}일 무료 체험.`;

/** Prices come from `content/pricing.json` via `src/lib/pricing.ts` — never hardcoded. */
const offers = [
  {
    "@type": "Offer",
    price: WIDGET_MONTHLY,
    priceCurrency: "KRW",
    url: `${siteUrl}/#trial`,
    availability: "https://schema.org/InStock",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: WIDGET_MONTHLY,
      priceCurrency: "KRW",
      billingDuration: 1,
      billingIncrement: 1,
      unitCode: "MON",
    },
  },
  {
    "@type": "Offer",
    price: WIDGET_ANNUAL,
    priceCurrency: "KRW",
    url: `${siteUrl}/#trial`,
    availability: "https://schema.org/InStock",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: WIDGET_ANNUAL,
      priceCurrency: "KRW",
      billingDuration: 1,
      billingIncrement: 1,
      unitCode: "ANN",
    },
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "WebManager",
      url: siteUrl,
      description: productDescription,
    },
    {
      "@type": "Product",
      name: "가이드 위젯",
      url: `${siteUrl}/#pricing`,
      description: productDescription,
      category: "SoftwareApplication",
      brand: {
        "@type": "Brand",
        name: "WebManager",
      },
      offers,
      sameAs: [KAKAO_URL],
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
      <LeadCapture />
      <Header />
      <DotNav />
      <main>
        <Hero />
        <Why />
        <Showcase />
        <How />
        <Pricing />
        <Trial />
        <FAQ />
      </main>
    </>
  );
}
