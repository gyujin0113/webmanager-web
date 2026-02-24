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
const title = "WebManager | 홈페이지 제작 · 유지보수 에이전시";
const description =
  "홈페이지 제작부터 유지보수까지 올인원. 수정 무제한, 빠른 제작, 합리적인 가격으로 웹사이트를 만들어드립니다. 웹 제작 에이전시 WebManager.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "홈페이지 제작",
    "웹사이트 제작",
    "홈페이지 제작 업체",
    "웹사이트 제작 비용",
    "홈페이지 유지보수",
    "웹사이트 관리 대행",
    "홈페이지 수정",
    "반응형 홈페이지",
    "랜딩페이지 제작",
    "웹 에이전시",
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
