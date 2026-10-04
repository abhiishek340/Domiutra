import { describe, expect, it } from "vitest";
import { buildMetadata, ogImageUrl } from "@/lib/seo/metadata";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  organizationJsonLd,
  serializeJsonLd,
  serviceJsonLd,
  websiteJsonLd,
} from "@/lib/seo/jsonld";
import { absoluteUrl, site } from "@/lib/site";

describe("ogImageUrl", () => {
  it("encodes the title and optional eyebrow", () => {
    expect(ogImageUrl("A & B")).toBe("/og?title=A+%26+B");
    expect(ogImageUrl("Title", "Services")).toBe("/og?title=Title&eyebrow=Services");
  });
});

describe("buildMetadata", () => {
  const base = { title: "Cloud & DevOps", description: "Desc", path: "/services/cloud-devops" };

  it("sets canonical, Open Graph, X card, and robots", () => {
    const m = buildMetadata({ ...base, eyebrow: "Cloud" });
    expect(m.title).toBe("Cloud & DevOps");
    expect(m.alternates?.canonical).toBe("/services/cloud-devops");
    expect(m.robots).toEqual({ index: true, follow: true });
    expect(m.openGraph).toMatchObject({
      type: "website",
      url: "/services/cloud-devops",
      siteName: "Domiutra",
      title: "Cloud & DevOps | Domiutra",
      locale: "en_US",
    });
    const image = (m.openGraph?.images as { url: string; width: number; height: number }[])[0]!;
    expect(image).toMatchObject({ width: 1200, height: 630 });
    expect(image.url).toBe(ogImageUrl("Cloud & DevOps", "Cloud"));
    expect(m.twitter).toMatchObject({ card: "summary_large_image", images: [image.url] });
  });

  it("supports absolute titles (no template) using the tagline on the image", () => {
    const m = buildMetadata({ ...base, title: "Home title", absoluteTitle: true });
    expect(m.title).toEqual({ absolute: "Home title" });
    expect(m.openGraph?.title).toBe("Home title");
    const image = (m.openGraph?.images as { url: string }[])[0]!;
    expect(image.url).toBe(ogImageUrl(site.tagline));
  });

  it("marks pages noindex when requested", () => {
    expect(buildMetadata({ ...base, noIndex: true }).robots).toEqual({ index: false, follow: true });
  });

  it("adds article type and published time", () => {
    const m = buildMetadata({ ...base, type: "article", publishedTime: "2026-09-01" });
    expect(m.openGraph).toMatchObject({ type: "article", publishedTime: "2026-09-01" });
  });
});

describe("JSON-LD", () => {
  it("escapes < so payloads cannot close the script tag", () => {
    expect(serializeJsonLd({ a: "</script>" })).toBe('{"a":"\\u003c/script>"}');
  });

  it("describes the organization without inventing contact details or social profiles", () => {
    const org = organizationJsonLd();
    expect(org).toMatchObject({ "@type": "Organization", name: "Domiutra", url: site.url, slogan: site.tagline });
    expect(org).not.toHaveProperty("sameAs");
    expect(org).not.toHaveProperty("contactPoint");
    expect(org).not.toHaveProperty("address");
  });

  it("links the website to the organization", () => {
    expect(websiteJsonLd()).toMatchObject({
      "@type": "WebSite",
      publisher: { "@id": absoluteUrl("/#organization") },
      inLanguage: "en-US",
    });
  });

  it("numbers breadcrumbs from 1 with absolute URLs", () => {
    const bc = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
    ]) as { itemListElement: { position: number; item: string }[] };
    expect(bc.itemListElement.map((i) => i.position)).toEqual([1, 2]);
    expect(bc.itemListElement[1]!.item).toBe(absoluteUrl("/services"));
  });

  it("builds article and service entities", () => {
    const article = articleJsonLd({
      slug: "x",
      title: "T",
      excerpt: "E",
      category: "AI",
      publishedAt: "2026-09-01",
      readingTime: "5 min read",
    });
    expect(article).toMatchObject({
      "@type": "Article",
      headline: "T",
      datePublished: "2026-09-01",
      articleSection: "AI",
      author: { name: "Domiutra" },
      mainEntityOfPage: absoluteUrl("/insights/x"),
    });
    expect(serviceJsonLd({ name: "S", description: "D", path: "/services/s" })).toMatchObject({
      "@type": "Service",
      url: absoluteUrl("/services/s"),
      areaServed: { "@type": "Country", name: "United States" },
    });
  });
});
