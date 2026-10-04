import { serializeJsonLd } from "@/lib/seo/jsonld";

type Props = { data: Record<string, unknown> | Record<string, unknown>[] };

/** Structured data. Content is generated from typed site data and escaped. */
export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
