// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const generateBrief = vi.fn();
vi.mock("@/lib/brief/generate", () => ({ generateBrief: (...args: unknown[]) => generateBrief(...args) }));

const { POST } = await import("@/app/api/brief/route");

const prompt = "Our billing system is 15 years old and we want to move it to AWS.";
let ip = 0;
function request(body: unknown, headers: Record<string, string> = {}, raw?: string) {
  ip++;
  return new NextRequest("http://localhost:3000/api/brief", {
    method: "POST",
    body: raw ?? JSON.stringify(body),
    headers: { "content-type": "application/json", host: "localhost:3000", "x-forwarded-for": `192.0.2.${ip}`, ...headers },
  });
}

describe("POST /api/brief", () => {
  beforeEach(() => generateBrief.mockReset());

  it("returns the brief on success, without caching", async () => {
    generateBrief.mockResolvedValue({ ok: true, brief: { title: "T" }, demo: false });
    const res = await POST(request({ prompt }, { origin: "http://localhost:3000" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, brief: { title: "T" }, demo: false });
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(generateBrief).toHaveBeenCalledWith(prompt);
  });

  it("blocks cross-origin requests before spending a model call", async () => {
    const res = await POST(request({ prompt }, { origin: "https://evil.example" }));
    expect(res.status).toBe(403);
    expect(generateBrief).not.toHaveBeenCalled();
  });

  it("validates input: bad JSON, oversized bodies, and prompt length", async () => {
    expect((await POST(request(null, {}, "{oops"))).status).toBe(400);
    expect((await POST(request(null, {}, "x".repeat(5000)))).status).toBe(413);
    const short = await POST(request({ prompt: "hi" }));
    expect(short.status).toBe(422);
    expect((await short.json()).message).toMatch(/at least 20/);
    expect(generateBrief).not.toHaveBeenCalled();
  });

  it.each([
    ["not_configured", 503],
    ["off_topic", 422],
    ["upstream_error", 502],
    ["timeout", 504],
  ] as const)("maps %s to HTTP %i", async (code, status) => {
    generateBrief.mockResolvedValue({ ok: false, code });
    const res = await POST(request({ prompt }));
    expect(res.status).toBe(status);
    expect(await res.json()).toEqual({ ok: false, error: code });
  });

  it("rate limits each client to protect model spend", async () => {
    generateBrief.mockResolvedValue({ ok: true, brief: {}, demo: false });
    const headers = { "x-forwarded-for": "198.18.0.9" };
    const statuses: number[] = [];
    for (let i = 0; i < 10; i++) statuses.push((await POST(request({ prompt }, headers))).status);
    expect(statuses.filter((s) => s === 200)).toHaveLength(8);
    expect(statuses.slice(8)).toEqual([429, 429]);
    expect(generateBrief).toHaveBeenCalledTimes(8);
  });
});
