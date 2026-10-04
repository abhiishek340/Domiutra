import { getAllArticles } from "@/lib/content/articles";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/animations/Reveal";
import { ButtonLink } from "@/components/ui/Button";

export async function InsightsSection() {
  const articles = (await getAllArticles()).slice(0, 3);
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="insights-title" className="surface-light py-20 md:py-28">
      <div className="container-site">
        <SectionHeading id="insights-title" tone="light" align="split" eyebrow="Insights" title="Practical guides for technology leaders." />
        <RevealGroup className="mt-12 grid gap-10 md:grid-cols-3">
          {articles.map((a) => (
            <RevealItem key={a.slug} className="flex">
              <ArticleCard article={a} className="w-full" />
            </RevealItem>
          ))}
        </RevealGroup>
        <div className="mt-12">
          <ButtonLink href="/insights" variant="dark" arrow>
            All insights
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
