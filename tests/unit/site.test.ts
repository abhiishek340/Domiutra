import { afterEach, describe, expect, it, vi } from "vitest";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/date";

async function loadSite() {
  vi.resetModules();
  return import("@/lib/site");
}

describe("site config", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("prefers NEXT_PUBLIC_SITE_URL and strips a trailing slash", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com/");
    const { site, absoluteUrl } = await loadSite();
    expect(site.url).toBe("https://example.com");
    expect(absoluteUrl("/about")).toBe("https://example.com/about");
    expect(absoluteUrl("about")).toBe("https://example.com/about");
  });

  it("falls back to the Vercel production URL, then localhost", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "domiutra.vercel.app");
    expect((await loadSite()).site.url).toBe("https://domiutra.vercel.app");

    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    expect((await loadSite()).site.url).toBe("http://localhost:3000");
  });

  it("treats blank optional values as unset so nothing fake is shown", async () => {
    vi.stubEnv("NEXT_PUBLIC_CONTACT_EMAIL", "   ");
    vi.stubEnv("NEXT_PUBLIC_LINKEDIN_URL", "https://linkedin.com/company/x");
    const { site } = await loadSite();
    expect(site.publicEmail).toBeUndefined();
    expect(site.social.linkedin).toBe("https://linkedin.com/company/x");
    expect(site.social.x).toBeUndefined();
  });
});

describe("utils", () => {
  it("cn joins truthy class names only", () => {
    expect(cn("a", false, null, undefined, 0, "b")).toBe("a b");
    expect(cn()).toBe("");
  });

  it("formatDate renders a stable U.S. date regardless of time zone", () => {
    expect(formatDate("2026-09-01")).toBe("September 1, 2026");
    expect(formatDate("2026-12-31")).toBe("December 31, 2026");
  });
});
