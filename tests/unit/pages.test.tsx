import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MDXProvider } from "@mdx-js/react";
import { isValidElement, type ReactNode } from "react";
import { useMDXComponents as getMdxComponents } from "@/mdx-components";
import { services } from "@/lib/data/services";
import { industries } from "@/lib/data/industries";
import { caseStudies } from "@/lib/data/case-studies";
import { getArticleSlugs } from "@/lib/content/articles";

vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

/**
 * Renders every real page in React's development build and fails on any
 * console error. This catches dev-only problems (duplicate keys, invalid
 * nesting, bad props) that production E2E runs can never see.
 */
let errors: string[] = [];
beforeEach(() => {
  errors = [];
  vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
    errors.push(args.map(String).join(" ").slice(0, 200));
  });
});
afterEach(() => vi.restoreAllMocks());

/** Next awaits nested async server components; the test renderer doesn't, so resolve one level here. */
async function resolveServer(node: ReactNode): Promise<ReactNode> {
  if (isValidElement(node) && typeof node.type === "function") {
    const out = (node.type as (p: unknown) => unknown)(node.props);
    if (out instanceof Promise) return (await out) as ReactNode;
  }
  return node;
}

async function renderPage(node: ReactNode | Promise<ReactNode>) {
  const resolved = await resolveServer(await node);
  render(<MDXProvider components={getMdxComponents()}>{resolved}</MDXProvider>);
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  expect(errors).toEqual([]);
}

const params = <T,>(value: T) => ({ params: Promise.resolve(value) }) as never;

describe("dynamic pages render cleanly", () => {
  it.each(services.map((s) => s.slug))("/services/%s", async (slug) => {
    const { default: Page } = await import("@/app/services/[slug]/page");
    await renderPage(Page(params({ slug })));
  });

  it.each(industries.filter((i) => i.hasPage).map((i) => i.slug))("/industries/%s", async (slug) => {
    const { default: Page } = await import("@/app/industries/[slug]/page");
    await renderPage(Page(params({ slug })));
  });

  it.each(caseStudies.map((c) => c.slug))("/work/%s", async (slug) => {
    const { default: Page } = await import("@/app/work/[slug]/page");
    await renderPage(Page(params({ slug })));
  });

  it.each(getArticleSlugs())("/insights/%s", async (slug) => {
    const { default: Page } = await import("@/app/insights/[slug]/page");
    await renderPage(Page(params({ slug })));
  });
});

describe("static pages render cleanly", () => {
  const pages: [string, () => Promise<{ default: () => ReactNode | Promise<ReactNode> }>][] = [
    ["/", () => import("@/app/page")],
    ["/services", () => import("@/app/services/page")],
    ["/industries", () => import("@/app/industries/page")],
    ["/engagement-models", () => import("@/app/engagement-models/page")],
    ["/delivery-model", () => import("@/app/delivery-model/page")],
    ["/work", () => import("@/app/work/page")],
    ["/insights", () => import("@/app/insights/page")],
    ["/about", () => import("@/app/about/page")],
    ["/security", () => import("@/app/security/page")],
    ["/careers", () => import("@/app/careers/page")],
    ["/contact", () => import("@/app/contact/page")],
    ["/privacy", () => import("@/app/privacy/page")],
    ["/terms", () => import("@/app/terms/page")],
    ["/accessibility", () => import("@/app/accessibility/page")],
    ["404", () => import("@/app/not-found")],
  ];

  it.each(pages)("%s", async (_path, load) => {
    const { default: Page } = await load();
    await renderPage(Page());
  });
});

describe("page metadata", () => {
  it("every service, industry, case study, and article has unique, complete metadata", async () => {
    const titles = new Set<string>();
    const check = async (mod: { generateMetadata: (p: never) => Promise<{ title?: unknown; description?: string | null }> }, slug: string) => {
      const meta = await mod.generateMetadata(params({ slug }));
      expect(meta.description?.length ?? 0).toBeGreaterThan(40);
      const title = String(meta.title);
      expect(titles.has(title)).toBe(false);
      titles.add(title);
    };
    const svc = await import("@/app/services/[slug]/page");
    for (const s of services) await check(svc, s.slug);
    const ind = await import("@/app/industries/[slug]/page");
    for (const i of industries.filter((x) => x.hasPage)) await check(ind, i.slug);
    const work = await import("@/app/work/[slug]/page");
    for (const c of caseStudies) await check(work, c.slug);
    const ins = await import("@/app/insights/[slug]/page");
    for (const slug of getArticleSlugs()) await check(ins, slug);

    // Unknown slugs return empty metadata rather than throwing.
    await expect(svc.generateMetadata(params({ slug: "nope" }))).resolves.toEqual({});
  });
});
