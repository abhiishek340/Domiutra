// @vitest-environment node
import { describe, expect, it } from "vitest";
import { getAllArticles, getArticle, getArticleSlugs } from "@/lib/content/articles";
import { getLegalDoc } from "@/lib/content/legal";
import { articleCategories } from "@/lib/data/types";

describe("insights content", () => {
  it("discovers every MDX article by filename", () => {
    const slugs = getArticleSlugs();
    expect(slugs.length).toBeGreaterThanOrEqual(5);
    expect(slugs).toContain("staff-augmentation-vs-managed-services");
    expect(slugs.every((s) => /^[a-z0-9-]+$/.test(s))).toBe(true);
  });

  it("parses valid metadata for every article and sorts newest first", async () => {
    const articles = await getAllArticles();
    expect(articles).toHaveLength(getArticleSlugs().length);
    for (const a of articles) {
      expect(articleCategories).toContain(a.category);
      expect(a.excerpt.length).toBeLessThanOrEqual(260);
      expect(a.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    const dates = articles.map((a) => a.publishedAt);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("loads one article with its MDX component, and returns null for unknown slugs", async () => {
    const result = await getArticle("when-application-modernization-makes-financial-sense");
    expect(result?.article.title).toMatch(/modernization/i);
    expect(typeof result?.Content).toBe("function");
    await expect(getArticle("does-not-exist")).resolves.toBeNull();
    await expect(getArticle("../../package")).resolves.toBeNull();
  });
});

describe("legal content", () => {
  it.each(["privacy", "terms", "accessibility"] as const)("%s has valid metadata", async (slug) => {
    const { meta, Content } = await getLegalDoc(slug);
    expect(meta.title.length).toBeGreaterThan(3);
    expect(meta.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(typeof Content).toBe("function");
  });
});
