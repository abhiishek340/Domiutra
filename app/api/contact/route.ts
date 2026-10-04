import { NextResponse, type NextRequest } from "next/server";
import { contactSchema, MIN_FILL_MS } from "@/lib/validation/contact";
import { createRateLimiter } from "@/lib/contact/rate-limit";
import { deliverContact } from "@/lib/contact/deliver";
import { clientKey, isSameOrigin } from "@/lib/http/request";

const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });
const MAX_BODY_BYTES = 20_000;

export type ContactApiResponse =
  | { ok: true }
  | { ok: false; error: "invalid" | "rate_limited" | "not_configured" | "delivery_failed" | "bad_request"; fieldErrors?: Record<string, string[]> };

function json(body: ContactApiResponse, status: number, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return json({ ok: false, error: "bad_request" }, 403);
  }

  const rate = limiter.check(clientKey(req));
  if (!rate.allowed) {
    return json({ ok: false, error: "rate_limited" }, 429, { "Retry-After": String(rate.retryAfterSeconds) });
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: "bad_request" }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  // Spam traps: a filled honeypot or an implausibly fast submission is
  // accepted silently (no signal to the bot) and dropped.
  if (body && typeof body === "object") {
    const b = body as Record<string, unknown>;
    const honeypot = typeof b.website === "string" && b.website.length > 0;
    const tooFast = typeof b.startedAt === "number" && Date.now() - b.startedAt < MIN_FILL_MS;
    if (honeypot || tooFast) return json({ ok: true }, 200);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      (fieldErrors[key] ??= []).push(issue.message);
    }
    return json({ ok: false, error: "invalid", fieldErrors }, 422);
  }

  const result = await deliverContact(parsed.data);
  if (!result.ok) {
    return json({ ok: false, error: result.code }, result.code === "not_configured" ? 503 : 502);
  }
  return json({ ok: true }, 200);
}
