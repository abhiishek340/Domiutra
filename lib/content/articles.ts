import fs from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";
import { z } from "zod";
import { articleCategories, type Article } from "@/lib/data/types";

/**
 * Insights content system.
 * Each article is `content/insights/<slug>.mdx` exporting `meta`. Dropping a
 * new file in that folder publishes it: route, listing, sitemap, and JSON-LD.
 * `meta` is validated at build time so a typo fails the build, not the page.
 */

const ARTICLES_DIR = path.join(process.cwd(), "content", "insights");

const articleMetaSchema = z.object({
  title: z.string().min(5),
  excerpt: z.string().min(20).max(260),
  category: z.enum(articleCategories),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  readingTime: z.string(),
  author: z.string().optional(),
  featuredImage: z.string().optional(),
});

type MdxModule = { default: ComponentType<Record<string, unknown>>; meta?: unknown };

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .sort();
}

async function loadModule(slug: string): Promise<MdxModule> {
  return (await import(`@/content/insights/${slug}.mdx`)) as MdxModule;
}

function parseMeta(slug: string, mod: MdxModule): Article {
  const parsed = articleMetaSchema.safeParse(mod.meta);
  if (!parsed.success) {
    throw new Error(`Invalid meta in content/insights/${slug}.mdx: ${parsed.error.message}`);
  }
  return { slug, ...parsed.data };
}

export async function getArticle(
  slug: string,
): Promise<{ article: Article; Content: MdxModule["default"] } | null> {
  if (!getArticleSlugs().includes(slug)) return null;
  const mod = await loadModule(slug);
  return { article: parseMeta(slug, mod), Content: mod.default };
}

export async function getAllArticles(): Promise<Article[]> {
  const slugs = getArticleSlugs();
  const articles = await Promise.all(slugs.map(async (slug) => parseMeta(slug, await loadModule(slug))));
  return articles.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export { formatDate } from "@/lib/utils/date";
