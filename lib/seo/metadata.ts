import type { Metadata } from "next";
import { site } from "@/lib/site";

type BuildMetadataInput = {
  title: string;
  description: string;
  /** Route path, e.g. "/services". Used for canonical URL. */
  path: string;
  /** Small label rendered above the title on the OG image. */
  eyebrow?: string;
  type?: "website" | "article";
  publishedTime?: string;
  noIndex?: boolean;
  /** Use the title as-is instead of applying the "| Domiutra" template. */
  absoluteTitle?: boolean;
};

export function ogImageUrl(title: string, eyebrow?: string): string {
  const params = new URLSearchParams({ title });
  if (eyebrow) params.set("eyebrow", eyebrow);
  return `/og?${params.toString()}`;
}

/**
 * Builds complete per-page metadata: canonical URL, Open Graph and X cards
 * (with a generated image), and robots directives. Relative URLs resolve
 * against `metadataBase` set in the root layout.
 */
export function buildMetadata({
  title,
  description,
  path,
  eyebrow,
  type = "website",
  publishedTime,
  noIndex,
  absoluteTitle,
}: BuildMetadataInput): Metadata {
  const image = {
    url: ogImageUrl(absoluteTitle ? site.tagline : title, eyebrow),
    width: 1200,
    height: 630,
    alt: `${site.name}: ${title}`,
  };
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: site.name,
      title: fullTitle,
      description,
      locale: "en_US",
      images: [image],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.url],
    },
    robots: noIndex ? { index: false, follow: true } : { index: true, follow: true },
  };
}
