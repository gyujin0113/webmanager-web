import { ImageResponse } from "next/og";
import { WIDGET_MONTHLY, manwon } from "@/lib/pricing";

export const dynamic = "force-static";
export const alt = "WebManager — 홈페이지 AI 안내 위젯";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND = "WebManager";
const HEADLINE = "홈페이지 AI 안내 위젯";
/** 가격은 `src/lib/pricing.ts` 단일 출처에서. */
const SUB = `한 줄 설치 · 월 ${manwon(WIDGET_MONTHLY)}`;
const SITE = "webmanager.co.kr";

/**
 * Google Fonts 는 `text=` 에 적은 글자만 서브셋으로 내려준다 — 빠진 글자는 두부(tofu)로 찍힌다.
 * 그래서 목록을 손으로 관리하지 않고 실제 렌더되는 문자열에서 뽑는다: 카피를 고쳐도 자동으로 따라온다.
 */
const glyphs = Array.from(new Set([BRAND, HEADLINE, SUB, SITE].join(""))).join("");

export default async function OgImage() {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(glyphs)}`,
  ).then((r) => r.text());

  const fontUrl = css.match(/src:\s*url\(([^)]+)\)/)?.[1];
  const fontData = fontUrl
    ? await fetch(fontUrl).then((r) => r.arrayBuffer())
    : new ArrayBuffer(0);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          fontFamily: "'Noto Sans KR'",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Blue glow */}
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Brand name */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#888888",
            letterSpacing: "0.08em",
          }}
        >
          {BRAND}
        </div>

        {/* Product headline */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#fafafa",
            letterSpacing: "-0.025em",
            marginTop: 20,
          }}
        >
          {HEADLINE}
        </div>

        {/* Price / install */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#2563eb",
            marginTop: 20,
          }}
        >
          {SUB}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            fontSize: 18,
            fontWeight: 700,
            color: "#666666",
            letterSpacing: "0.05em",
          }}
        >
          {SITE}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Noto Sans KR",
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );
}
