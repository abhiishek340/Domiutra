import type { Metadata } from "next";
import { getAllArticles } from "@/lib/content/articles";
import { buildMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/sections/PageHero";
import { InsightsBrowser } from "@/components/sections/InsightsBrowser";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = buildMetadata({
  title: "Insights: Outsourcing, Modernization, AI & Engineering Leadership",
  description:
    "Practical guides for technology leaders on software outsourcing, managed services, application modernization, AI in engineering, and building U.S.-managed global teams.",
  path: "/insights",
  eyebrow: "Insights",
});

export default async function InsightsPage() {
  const articles = await getAllArticles();
  const [featured] = articles;

  return (
    <>
      <PageHero
        breadcrumbs={[{ name: "Insights", path: "/insights" }]}
        eyebrow="Insights"
        title="Clear thinking on building and running technology."
        intro={<p>Decision guides for CTOs, CIOs, and engineering leaders. No trend reports, no gated downloads.</p>}
      />

      <section aria-label="Articles" className="surface-light py-20 md:py-24">
        <div className="container-site">
          {featured && (
            <div className="mb-20 grid gap-8 md:grid-cols-12">
              <p className="label-mono text-ink-text-muted md:col-span-3">Latest</p>
              <ArticleCard article={featured} featured className="md:col-span-8" />
            </div>
          )}
          <InsightsBrowser articles={articles} />
        </div>
      </section>

      <FinalCTA title="Want to talk through your situation?" body="Articles are general. Your systems, constraints, and goals aren’t. We’re happy to think it through with you." />
    </>
  );
}
