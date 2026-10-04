import { getLegalDoc, type LegalSlug } from "@/lib/content/legal";
import { formatDate } from "@/lib/utils/date";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

/** Shared renderer for privacy, terms, and accessibility starter documents. */
export async function LegalPage({ slug, path }: { slug: LegalSlug; path: string }) {
  const { meta, Content } = await getLegalDoc(slug);
  return (
    <>
      <header className="border-b border-line pt-32 pb-14 md:pt-40 md:pb-16">
        <div className="container-site">
          <Breadcrumbs items={[{ name: meta.title, path }]} />
          <h1 className="mt-10 text-h1 font-semibold">{meta.title}</h1>
          <p className="mt-5 max-w-2xl text-lead text-fg-muted">{meta.description}</p>
          <p className="label-mono mt-8 text-fg-subtle">
            Last updated <time dateTime={meta.lastUpdated}>{formatDate(meta.lastUpdated)}</time>
          </p>
        </div>
      </header>
      <div className="surface-light py-16 md:py-24">
        <div className="container-site grid lg:grid-cols-12">
          <div className="prose-domiutra lg:col-span-7 lg:col-start-3">
            <Content />
          </div>
        </div>
      </div>
    </>
  );
}
