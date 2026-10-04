"use client";

/** Last-resort boundary for errors in the root layout itself. Self-contained styles. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-US">
      <body style={{ margin: 0, background: "#080b10", color: "#f4f7f6", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
          <div style={{ maxWidth: 520 }}>
            <p style={{ color: "#7af0c3", fontFamily: "ui-monospace, monospace", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Domiutra
            </p>
            <h1 style={{ fontSize: 36, lineHeight: 1.1, margin: "16px 0" }}>Something went wrong.</h1>
            <p style={{ color: "#a9b3b8", lineHeight: 1.6 }}>The page failed to load. Please try again.</p>
            <button
              onClick={reset}
              style={{ marginTop: 24, background: "#7af0c3", color: "#080b10", border: 0, borderRadius: 4, padding: "12px 20px", fontSize: 15, cursor: "pointer" }}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
