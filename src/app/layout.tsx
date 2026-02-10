import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Generalist Lab | 웹사이트 제작 에이전시",
  description:
    "기존 사이트를 더 빠르고, 더 저렴하게. 클론 + 성능 개선 + 유지보수까지 올인원으로 해결하는 웹 제작 에이전시.",
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
