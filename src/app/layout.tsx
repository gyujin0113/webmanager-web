import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Script from "next/script";
import { WIDGET_GUIDE_PATH, WIDGET_SCRIPT_SRC, WIDGET_SITE_ID } from "@/lib/widgetConfig";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const siteUrl = "https://webmanager.co.kr";
const siteName = "WebManager";
const title = "Web Manager — 홈페이지 AI 안내 위젯";
const description =
  "홈페이지에 스크립트 한 줄로 다는 AI 안내 위젯. 방문자가 묻는 질문에 바로 답하고, 원하는 페이지로 데려다줍니다. 30일 무료 체험.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "홈페이지 안내 위젯",
    "웹사이트 AI 위젯",
    "홈페이지 챗봇 대안",
    "사이트 가이드 위젯",
    "워드프레스 위젯",
    "아임웹 위젯",
    "카페24 위젯",
    "홈페이지 문의 전환",
    "방문자 이탈 방지",
    "웹사이트 안내 챗봇",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    other: {
      "naver-site-verification": "7c28f256185451b34c837682d4b1eb22b6c8275d",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} antialiased`}>
        {children}
        <Script
          src={WIDGET_SCRIPT_SRC}
          strategy="afterInteractive"
          data-site={WIDGET_SITE_ID}
          data-guide={WIDGET_GUIDE_PATH}
        />
      </body>
    </html>
  );
}
