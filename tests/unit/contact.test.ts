import { afterEach, describe, expect, it, vi } from "vitest";
import { contactSchema, type ContactInput } from "@/lib/validation/contact";
import { createRateLimiter } from "@/lib/contact/rate-limit";
import { deliverContact, renderEmail } from "@/lib/contact/deliver";

const valid: ContactInput = {
  firstName: "Jordan",
  lastName: "Lee",
  email: "jordan@example.com",
  company: "Example Co",
  role: "VP Engineering",
  interest: "cloud-devops",
  teamSize: "4-8",
  timeline: "1-3",
  message: "We need help migrating three services to AWS this quarter.",
  website: "",
};

describe("contactSchema", () => {
  it("accepts a complete, valid submission", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts optional fields left empty", () => {
    expect(contactSchema.safeParse({ ...valid, role: "", teamSize: "", timeline: "" }).success).toBe(true);
  });

  it.each([
    ["firstName", ""],
    ["email", "not-an-email"],
    ["company", "   "],
    ["message", "too short"],
    ["interest", "time-travel"],
  ] as const)("rejects invalid %s", (field, value) => {
    const result = contactSchema.safeParse({ ...valid, [field]: value });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]?.path[0]).toBe(field);
  });

  it("rejects a filled honeypot", () => {
    expect(contactSchema.safeParse({ ...valid, website: "http://spam.example" }).success).toBe(false);
  });

  it("trims whitespace", () => {
    const parsed = contactSchema.parse({ ...valid, firstName: "  Jordan  " });
    expect(parsed.firstName).toBe("Jordan");
  });
});

describe("rate limiter", () => {
  it("allows up to the limit, then blocks until the window resets", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(limiter.check("ip", 0).allowed).toBe(true);
    expect(limiter.check("ip", 10).allowed).toBe(true);
    const blocked = limiter.check("ip", 20);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(1);
    expect(limiter.check("other-ip", 20).allowed).toBe(true);
    expect(limiter.check("ip", 1001).allowed).toBe(true);
  });
});

describe("renderEmail", () => {
  it("escapes HTML from user input", () => {
    const { html } = renderEmail({ ...valid, company: "<script>alert(1)</script>", message: 'a "quote" & <b>tag</b> here ok' });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("&lt;b&gt;tag&lt;/b&gt;");
  });

  it("keeps the subject on one line", () => {
    const { subject } = renderEmail({ ...valid, company: "Evil\r\nBcc: someone@example.com" });
    expect(subject).not.toMatch(/[\r\n]/);
  });
});

describe("deliverContact", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("reports not_configured instead of pretending to send", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("CONTACT_EMAIL", "");
    await expect(deliverContact(valid)).resolves.toEqual({ ok: false, code: "not_configured" });
  });
});
