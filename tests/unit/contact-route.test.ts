// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const deliverContact = vi.fn();
vi.mock("@/lib/contact/deliver", () => ({ deliverContact: (...args: unknown[]) => deliverContact(...args) }));

const { POST } = await import("@/app/api/contact/route");

const valid = {
  firstName: "Jordan",
  lastName: "Lee",
  email: "jordan@example.com",
  company: "Example Co",
  interest: "cloud-devops",
  message: "We need help migrating three services to AWS this quarter.",
  startedAt: Date.now() - 60_000,
};

let ipCounter = 0;
function request(body: unknown, headers: Record<string, string> = {}, raw?: string) {
  ipCounter++;
  return new NextRequest("http://localhost:3000/api/contact", {
    method: "POST",
    body: raw ?? JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      host: "localhost:3000",
      "x-forwarded-for": `198.51.100.${ipCounter}`,
      ...headers,
    },
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => deliverContact.mockReset());

  it("delivers a valid submission and returns 200", async () => {
    deliverContact.mockResolvedValue({ ok: true });
    const res = await POST(request(valid, { origin: "http://localhost:3000" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(deliverContact).toHaveBeenCalledWith(expect.objectContaining({ email: "jordan@example.com", interest: "cloud-devops" }));
    expect(res.headers.get("cache-control")).toBe("no-store");
  });

  it("accepts same-host requests from any hostname (e.g. a LAN IP)", async () => {
    deliverContact.mockResolvedValue({ ok: true });
    const res = await POST(request(valid, { origin: "http://10.0.0.5:3000", host: "10.0.0.5:3000" }));
    expect(res.status).toBe(200);
  });

  it("honors X-Forwarded-Host behind a proxy", async () => {
    deliverContact.mockResolvedValue({ ok: true });
    const res = await POST(
      request(valid, { origin: "https://www.domiutra.com", host: "internal:3000", "x-forwarded-host": "www.domiutra.com" }),
    );
    expect(res.status).toBe(200);
  });

  it("rejects cross-origin and malformed origins with 403", async () => {
    expect((await POST(request(valid, { origin: "https://evil.example" }))).status).toBe(403);
    expect((await POST(request(valid, { origin: "not a url" }))).status).toBe(403);
    expect(deliverContact).not.toHaveBeenCalled();
  });

  it("returns 422 with field errors for invalid input", async () => {
    const res = await POST(request({ ...valid, email: "nope", message: "short" }));
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toBe("invalid");
    expect(Object.keys(body.fieldErrors)).toEqual(expect.arrayContaining(["email", "message"]));
    expect(deliverContact).not.toHaveBeenCalled();
  });

  it("returns 400 for unparseable JSON and 413 for oversized bodies", async () => {
    expect((await POST(request(null, {}, "{not json"))).status).toBe(400);
    expect((await POST(request(null, {}, "x".repeat(25_000)))).status).toBe(413);
  });

  it("silently accepts but drops honeypot and too-fast submissions", async () => {
    const honeypot = await POST(request({ ...valid, website: "http://spam.example" }));
    const tooFast = await POST(request({ ...valid, startedAt: Date.now() }));
    expect(honeypot.status).toBe(200);
    expect(tooFast.status).toBe(200);
    expect(deliverContact).not.toHaveBeenCalled();
  });

  it("returns 503 when email isn't configured, never a fake success", async () => {
    deliverContact.mockResolvedValue({ ok: false, code: "not_configured" });
    const res = await POST(request(valid));
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, error: "not_configured" });
  });

  it("returns 502 when the email provider fails", async () => {
    deliverContact.mockResolvedValue({ ok: false, code: "delivery_failed" });
    expect((await POST(request(valid))).status).toBe(502);
  });

  it("rate limits repeated submissions from one client", async () => {
    const headers = { "x-forwarded-for": "203.0.113.77" };
    const statuses: number[] = [];
    for (let i = 0; i < 7; i++) statuses.push((await POST(request({}, headers))).status);
    expect(statuses.slice(0, 5).every((s) => s !== 429)).toBe(true);
    expect(statuses.slice(5)).toEqual([429, 429]);
    const limited = await POST(request({}, headers));
    expect(Number(limited.headers.get("retry-after"))).toBeGreaterThan(0);
  });
});
