import type { NextRequest } from "next/server";

/** Best-effort client identifier for rate limiting (first X-Forwarded-For hop). */
export function clientKey(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip") || "unknown";
}

/**
 * Same-origin check: browsers send Origin on cross-origin POSTs. Compare it to
 * the host the browser actually used (Host / X-Forwarded-Host), not the
 * server's internal URL, so LAN IPs, custom domains, and proxies all work.
 */
export function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
