import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#080b10" }}>
        <svg width="112" height="112" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="4" width="4.5" height="24" rx="1" fill="#f4f7f6" />
          <path d="M12.5 6.25H16a9.75 9.75 0 0 1 0 19.5h-3.5" stroke="#f4f7f6" strokeWidth="4.5" />
          <circle cx="16" cy="16" r="2.6" fill="#7af0c3" />
        </svg>
      </div>
    ),
    size,
  );
}
