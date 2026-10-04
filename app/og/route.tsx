import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

/**
 * Open Graph / X card image. `/og?title=…&eyebrow=…`
 * Dark technical canvas with the mark, wordmark, and page title. Inputs are
 * length-limited; output is cached by the CDN.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = (searchParams.get("title") || "Build. Modernize. Operate.").slice(0, 120);
  const eyebrow = (searchParams.get("eyebrow") || "U.S.-managed · Globally delivered").slice(0, 60);
  const titleSize = title.length > 70 ? 54 : title.length > 40 ? 64 : 80;

  // Background node positions for the system-diagram motif.
  const nodes = [
    [820, 120], [1000, 200], [1110, 360], [930, 470], [760, 330], [1080, 540],
  ] as const;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#080b10",
          color: "#f4f7f6",
          fontFamily: "sans-serif",
        }}
      >
        {/* grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -200,
            top: -100,
            width: 900,
            height: 800,
            display: "flex",
            background: "radial-gradient(closest-side, rgba(122,240,195,0.16), transparent)",
          }}
        />
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", inset: 0 }}>
          {nodes.map(([x, y], i) => {
            const next = nodes[(i + 1) % nodes.length]!;
            return <path key={`l${i}`} d={`M${x} ${y} H${next[0]} V${next[1]}`} stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" fill="none" />;
          })}
          {nodes.map(([x, y], i) => (
            <rect key={`n${i}`} x={x - 46} y={y - 16} width="92" height="32" rx="6" fill="#0c1016" stroke={i === 4 ? "#7af0c3" : "rgba(255,255,255,0.2)"} />
          ))}
          {nodes.map(([x, y], i) => (
            <circle key={`c${i}`} cx={x - 30} cy={y} r="4" fill="#7af0c3" opacity={i === 4 ? 1 : 0.5} />
          ))}
        </svg>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", width: "100%", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="52" height="52" viewBox="0 0 32 32" fill="none">
              <rect x="4" y="4" width="4.5" height="24" rx="1" fill="#f4f7f6" />
              <path d="M12.5 6.25H16a9.75 9.75 0 0 1 0 19.5h-3.5" stroke="#f4f7f6" strokeWidth="4.5" />
              <circle cx="16" cy="16" r="2.6" fill="#7af0c3" />
            </svg>
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 8 }}>DOMIUTRA</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
            <div style={{ fontSize: 22, color: "#7af0c3", letterSpacing: 3, textTransform: "uppercase", display: "flex" }}>{eyebrow}</div>
            <div style={{ fontSize: titleSize, fontWeight: 700, lineHeight: 1.04, letterSpacing: -2, marginTop: 20, display: "flex" }}>{title}</div>
          </div>

          <div style={{ display: "flex", fontSize: 22, color: "#a9b3b8" }}>
            Engineering · Modernization · Cloud · AI · Operations
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable" },
    },
  );
}
