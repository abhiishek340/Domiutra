// @vitest-environment node
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { footerNav, legalNav, primaryNav, servicesMenu } from "@/lib/data/navigation";
import { services } from "@/lib/data/services";
import { industries } from "@/lib/data/industries";
import { getArticleSlugs } from "@/lib/content/articles";

const APP = join(process.cwd(), "app");

/** Resolves an internal href to an App Router page file (static or [slug]). */
function routeExists(href: string): boolean {
  const path = href.split("#")[0]!.split("?")[0]!;
  if (path === "/") return existsSync(join(APP, "page.tsx"));
  const parts = path.replace(/^\//, "").split("/");
  if (existsSync(join(APP, ...parts, "page.tsx"))) return true;
  const [section, slug] = parts;
  if (parts.length !== 2 || !section || !slug) return false;
  const dynamic = existsSync(join(APP, section, "[slug]", "page.tsx"));
  const known: Record<string, string[]> = {
    services: services.map((s) => s.slug),
    industries: industries.filter((i) => i.hasPage).map((i) => i.slug),
    insights: getArticleSlugs(),
  };
  return dynamic && (known[section]?.includes(slug) ?? true);
}

describe("navigation", () => {
  it("keeps the primary nav short", () => {
    expect(primaryNav).toHaveLength(5);
  });

  it("links only to routes that exist", () => {
    const links = [
      ...primaryNav,
      ...servicesMenu.flatMap((c) => c.links),
      ...Object.values(footerNav).flat(),
      ...legalNav,
    ];
    const broken = links.filter((l) => !routeExists(l.href)).map((l) => l.href);
    expect(broken).toEqual([]);
  });

  it("lists every service in the mega-menu and footer", () => {
    const menuHrefs = servicesMenu.flatMap((c) => c.links.map((l) => l.href));
    for (const s of services) {
      expect(menuHrefs).toContain(`/services/${s.slug}`);
      expect(footerNav.Services.map((l) => l.href)).toContain(`/services/${s.slug}`);
    }
  });
});
