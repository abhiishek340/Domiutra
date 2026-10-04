import { absoluteUrl, site } from "@/lib/site";
import type { Article } from "@/lib/data/types";

type JsonLd = Record<string, unknown>;

/** Serialize JSON-LD safely for a <script> tag (escapes `<` to prevent injection). */
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function organizationJsonLd(): JsonLd {
  const sameAs = Object.values(site.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: site.name,
    url: site.url,
    logo: absoluteUrl("/icon.svg"),
    description: site.description,
    slogan: site.tagline,
    ...(sameAs.length ? { sameAs } : {}),
    ...(site.publicEmail
      ? { contactPoint: { "@type": "ContactPoint", contactType: "sales", email: site.publicEmail, areaServed: "US" } }
      : {}),
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: site.name,
    url: site.url,
    publisher: { "@id": absoluteUrl("/#organization") },
    inLanguage: "en-US",
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(crumbs: Crumb[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function articleJsonLd(article: Article): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    mainEntityOfPage: absoluteUrl(`/insights/${article.slug}`),
    image: absoluteUrl(`/og?title=${encodeURIComponent(article.title)}&eyebrow=Insights`),
    author: { "@type": "Organization", name: article.author ?? site.name, url: site.url },
    publisher: { "@id": absoluteUrl("/#organization") },
    articleSection: article.category,
  };
}

export function serviceJsonLd(input: { name: string; description: string; path: string }): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: { "@id": absoluteUrl("/#organization") },
    areaServed: { "@type": "Country", name: "United States" },
  };
}
