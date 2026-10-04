import { NextResponse, type NextRequest } from "next/server";
import { briefRequestSchema, type Brief } from "@/lib/brief/schema";
import { generateBrief } from "@/lib/brief/generate";
import { createRateLimiter } from "@/lib/contact/rate-limit";
import { clientKey, isSameOrigin } from "@/lib/http/request";

// Each brief is a paid model call: keep per-client usage modest.
const limiter = createRateLimiter({ limit: 8, windowMs: 10 * 60 * 1000 });
const MAX_BODY_BYTES = 4_000;

export type BriefApiResponse =
  | { ok: true; brief: Brief; demo: boolean }
  | {
      ok: false;
      error: "invalid" | "rate_limited" | "not_configured" | "off_topic" | "upstream_error" | "timeout" | "bad_request";
      message?: string;
    };

function json(body: BriefApiResponse, status: number, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

const STATUS = { not_configured: 503, off_topic: 422, upstream_error: 502, timeout: 504 } as const;

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return json({ ok: false, error: "bad_request" }, 403);

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

  const parsed = briefRequestSchema.safeParse(body);
  if (!parsed.success) {
    return json({ ok: false, error: "invalid", message: parsed.error.issues[0]?.message }, 422);
  }

  // Visitor text is used only for this request: never logged or stored.
  const result = await generateBrief(parsed.data.prompt);
  if (!result.ok) return json({ ok: false, error: result.code }, STATUS[result.code]);
  return json({ ok: true, brief: result.brief, demo: result.demo }, 200);
}
