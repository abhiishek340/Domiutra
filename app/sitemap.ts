import type { MetadataRoute } from "next";
import { services } from "@/lib/data/services";
import { industries } from "@/lib/data/industries";
import { caseStudies } from "@/lib/data/case-studies";
import { getAllArticles } from "@/lib/content/articles";
import { absoluteUrl } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: Entry["changeFrequency"] = "monthly"): Entry => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
  });

  const articles = await getAllArticles();

  return [
    page("/", 1, "weekly"),
    page("/services", 0.9),
    ...services.map((s) => page(`/services/${s.slug}`, 0.9)),
    page("/industries", 0.7),
    ...industries.filter((i) => i.hasPage).map((i) => page(`/industries/${i.slug}`, 0.7)),
    page("/engagement-models", 0.8),
    page("/delivery-model", 0.8),
    page("/security", 0.6),
    page("/work", 0.6),
    ...caseStudies.map((c) => page(`/work/${c.slug}`, 0.5)),
    page("/insights", 0.7, "weekly"),
    ...articles.map((a) => ({ ...page(`/insights/${a.slug}`, 0.6), lastModified: new Date(`${a.publishedAt}T12:00:00Z`) })),
    page("/about", 0.6),
    page("/careers", 0.5, "weekly"),
    page("/contact", 0.8),
    page("/privacy", 0.2, "yearly"),
    page("/terms", 0.2, "yearly"),
    page("/accessibility", 0.2, "yearly"),
  ];
}
