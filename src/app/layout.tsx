import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const siteUrl = "https://webmanager.co.kr";
const siteName = "WebManager";
const title = "WebManager | 웹사이트 클론 복원 · 무제한 관리";
const description =
  "방치된 웹사이트를 구출합니다. 기존 디자인 그대로 복원하고, 월 구독으로 수정 무제한 관리. 연락 두절된 업체 대신 WebManager가 책임집니다.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "웹사이트 관리",
    "홈페이지 유지보수",
    "웹사이트 수정 대행",
    "홈페이지 관리 업체",
    "웹사이트 클론",
    "홈페이지 복원",
    "홈페이지 수정 무제한",
    "웹사이트 유지보수 비용",
    "홈페이지 관리 대행",
    "웹사이트 구독 관리",
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
      <body className={`${notoSansKR.variable} antialiased`}>{children}</body>
    </html>
  );
}
