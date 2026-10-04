import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ContactInput } from "@/lib/validation/contact";

const send = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: (...args: unknown[]) => send(...args) };
  },
}));

const { deliverContact, isEmailConfigured } = await import("@/lib/contact/deliver");
const { forwardToCrm } = await import("@/lib/contact/crm");

const input: ContactInput = {
  firstName: "Jordan",
  lastName: "Lee",
  email: "jordan@example.com",
  company: "Example Co",
  role: "",
  interest: "ai-data",
  teamSize: "",
  timeline: "",
  message: "We want to pilot document extraction with human review.",
  website: "",
};

describe("deliverContact (Resend)", () => {
  beforeEach(() => {
    send.mockReset();
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_EMAIL", "sales@example.com, ops@example.com");
    vi.stubEnv("HUBSPOT_ACCESS_TOKEN", "");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("reports configuration status from env", () => {
    expect(isEmailConfigured()).toBe(true);
    vi.stubEnv("CONTACT_EMAIL", "");
    expect(isEmailConfigured()).toBe(false);
  });

  it("sends to every configured inbox with reply-to set to the visitor", async () => {
    send.mockResolvedValue({ error: null });
    await expect(deliverContact(input)).resolves.toEqual({ ok: true });
    const payload = send.mock.calls[0]![0];
    expect(payload).toMatchObject({
      to: ["sales@example.com", "ops@example.com"],
      replyTo: "jordan@example.com",
      subject: "New inquiry: AI & Data · Example Co",
    });
    expect(payload.from).toContain("resend.dev"); // default sender when unset
    expect(payload.text).toContain("Role: —");
  });

  it("uses CONTACT_FROM_EMAIL when provided", async () => {
    vi.stubEnv("CONTACT_FROM_EMAIL", "Domiutra <web@domiutra.com>");
    send.mockResolvedValue({ error: null });
    await deliverContact(input);
    expect(send.mock.calls[0]![0].from).toBe("Domiutra <web@domiutra.com>");
  });

  it("returns delivery_failed when Resend reports an error or throws", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    send.mockResolvedValueOnce({ error: { name: "validation_error", message: "bad from" } });
    await expect(deliverContact(input)).resolves.toEqual({ ok: false, code: "delivery_failed" });
    send.mockRejectedValueOnce(new Error("network"));
    await expect(deliverContact(input)).resolves.toEqual({ ok: false, code: "delivery_failed" });
  });
});

describe("forwardToCrm (HubSpot)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("does nothing when no CRM is configured", async () => {
    vi.stubEnv("HUBSPOT_ACCESS_TOKEN", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await forwardToCrm(input);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("creates a HubSpot contact with mapped properties", async () => {
    vi.stubEnv("HUBSPOT_ACCESS_TOKEN", "pat-123");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201 });
    vi.stubGlobal("fetch", fetchMock);
    await forwardToCrm(input);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://api.hubapi.com/crm/v3/objects/contacts");
    expect(init.headers.Authorization).toBe("Bearer pat-123");
    expect(JSON.parse(init.body).properties).toMatchObject({
      email: "jordan@example.com",
      firstname: "Jordan",
      company: "Example Co",
      message: expect.stringContaining("[AI & Data]"),
    });
  });

  it("treats an existing contact (409) as success and never throws on failure", async () => {
    vi.stubEnv("HUBSPOT_ACCESS_TOKEN", "pat-123");
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 409 }));
    await expect(forwardToCrm(input)).resolves.toBeUndefined();
    expect(errorSpy).not.toHaveBeenCalled();

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    await expect(forwardToCrm(input)).resolves.toBeUndefined();
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining("hubspot"), expect.any(Error));
  });

  it("runs after a successful email and cannot break delivery", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_EMAIL", "sales@example.com");
    vi.stubEnv("HUBSPOT_ACCESS_TOKEN", "pat-123");
    vi.spyOn(console, "error").mockImplementation(() => {});
    send.mockResolvedValue({ error: null });
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("hubspot down")));
    await expect(deliverContact(input)).resolves.toEqual({ ok: true });
  });
});
