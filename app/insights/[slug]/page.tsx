import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticles, getArticle, getArticleSlugs } from "@/lib/content/articles";
import { formatDate } from "@/lib/utils/date";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleJsonLd } from "@/lib/seo/jsonld";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/content/JsonLd";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const result = await getArticle(slug);
  if (!result) return {};
  const { article } = result;
  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/insights/${article.slug}`,
    eyebrow: `Insights · ${article.category}`,
    type: "article",
    publishedTime: article.publishedAt,
  });
}

export default async function ArticlePage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const result = await getArticle(slug);
  if (!result) notFound();
  const { article, Content } = result;
  const related = (await getAllArticles()).filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <>
      <JsonLd data={articleJsonLd(article)} />
      <article>
        <header className="relative overflow-hidden border-b border-line pt-32 pb-16 md:pt-40 md:pb-20">
          <div aria-hidden="true" className="bg-grid mask-fade-b pointer-events-none absolute inset-0 opacity-30" />
          <div className="container-site relative">
            <div className="animate-fade mb-10">
              <Breadcrumbs
                items={[
                  { name: "Insights", path: "/insights" },
                  { name: article.category, path: `/insights/${article.slug}` },
                ]}
              />
            </div>
            <div className="max-w-4xl">
              <p className="animate-fade label-mono text-mint">{article.category}</p>
              <h1 className="animate-rise mt-5 text-h1 font-semibold">{article.title}</h1>
              <p className="animate-rise mt-6 max-w-2xl text-lead text-fg-muted" style={{ animationDelay: "0.15s" }}>
                {article.excerpt}
              </p>
              <dl className="animate-fade mt-10 flex flex-wrap gap-x-10 gap-y-3 text-sm" style={{ animationDelay: "0.25s" }}>
                <div>
                  <dt className="label-mono text-fg-subtle">Published</dt>
                  <dd className="mt-1">
                    <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                  </dd>
                </div>
                <div>
                  <dt className="label-mono text-fg-subtle">Reading time</dt>
                  <dd className="mt-1">{article.readingTime}</dd>
                </div>
                <div>
                  <dt className="label-mono text-fg-subtle">By</dt>
                  <dd className="mt-1">{article.author ?? site.name}</dd>
                </div>
              </dl>
            </div>
          </div>
        </header>

        <div className="surface-light py-16 md:py-24">
          <div className="container-site grid lg:grid-cols-12">
            <div className="prose-domiutra lg:col-span-7 lg:col-start-3">
              <Content />
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="surface-light border-t border-line-dark py-20">
          <div className="container-site">
            <h2 id="related-title" className="label-mono text-ink-text-muted">Keep reading</h2>
            <ul className="mt-8 grid gap-10 md:grid-cols-3">
              {related.map((a) => (
                <li key={a.slug} className="flex">
                  <ArticleCard article={a} className="w-full" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <FinalCTA />
    </>
  );
}
