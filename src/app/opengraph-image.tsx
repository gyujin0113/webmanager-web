import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "WebManager — 홈페이지 제작 · 유지보수 에이전시";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const glyphs = "WebManager홈페이지제작·유지보수에이전시webmanagercokr";

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
            fontSize: 80,
            fontWeight: 700,
            color: "#fafafa",
            letterSpacing: "-0.025em",
          }}
        >
          WebManager
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#888888",
            marginTop: 16,
          }}
        >
          홈페이지 제작 · 유지보수 에이전시
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            fontSize: 18,
            fontWeight: 700,
            color: "#2563eb",
            letterSpacing: "0.05em",
          }}
        >
          webmanager.co.kr
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
