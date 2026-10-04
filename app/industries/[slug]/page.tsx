import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { industries, getIndustry } from "@/lib/data/industries";
import { getService } from "@/lib/data/services";
import { buildMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { IndustryArt } from "@/components/diagrams/IndustryArt";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { RevealGroup, RevealItem } from "@/components/animations/Reveal";

export const dynamicParams = false;

export function generateStaticParams() {
  return industries.filter((i) => i.hasPage).map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/industries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};
  return buildMetadata({
    title: industry.seo.title,
    description: industry.seo.description,
    path: `/industries/${industry.slug}`,
    eyebrow: industry.name,
  });
}

export default async function IndustryPage({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry || !industry.hasPage) notFound();

  return (
    <>
      <PageHero
        breadcrumbs={[
          { name: "Industries", path: "/industries" },
          { name: industry.name, path: `/industries/${industry.slug}` },
        ]}
        eyebrow={
          <span className="flex items-center gap-2">
            <Icon name={industry.icon} className="size-4 text-mint" />
            {industry.name}
          </span>
        }
        title={industry.headline}
        intro={<p>{industry.intro}</p>}
        actions={
          <>
            <ButtonLink href="/contact" size="lg" arrow>Talk to Domiutra</ButtonLink>
            <ButtonLink href="/services" variant="ghost" size="lg" arrow>Explore services</ButtonLink>
          </>
        }
        visual={
          <div className="rounded-lg border border-line bg-ink-900/60 p-8 text-mint/70">
            <IndustryArt slug={industry.slug} />
          </div>
        }
      />

      <section aria-labelledby="pressures-title" className="py-20 md:py-24">
        <div className="container-site">
          <SectionHeading id="pressures-title" align="split" eyebrow="What we hear" title="The pressures behind the work." />
          <RevealGroup as="ol" className="mt-14 grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-3">
            {industry.pressures.map((p, i) => (
              <RevealItem as="li" key={p.title} className="bg-ink-950 p-7 md:p-8">
                <span className="font-mono text-xs text-mint">0{i + 1}</span>
                <h3 className="mt-4 text-h3 font-semibold">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-fg-muted">{p.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section aria-labelledby="help-title" className="surface-light py-20 md:py-24">
        <div className="container-site">
          <SectionHeading id="help-title" tone="light" align="split" eyebrow="How we help" title="Where we typically start." />
          <RevealGroup className="mt-14 grid gap-4 md:grid-cols-3">
            {industry.howWeHelp.map((h) => (
              <RevealItem key={h.title} className="flex flex-col rounded-md border border-line-dark bg-white p-6 md:p-8">
                <h3 className="text-h3 font-semibold">{h.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-text-muted">{h.description}</p>
                <ul className="mt-auto flex flex-wrap gap-2 pt-8">
                  {h.services.map((slug) => {
                    const s = getService(slug);
                    if (!s) return null;
                    return (
                      <li key={slug}>
                        <Link
                          href={`/services/${slug}`}
                          className="inline-flex items-center gap-1 rounded-sm border border-line-dark-strong px-2.5 py-1 text-sm hover:border-mint-deep hover:text-mint-deep"
                        >
                          {s.shortTitle}
                          <ArrowUpRight aria-hidden="true" className="size-3.5" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <FinalCTA title={`Working on something in ${industry.name.toLowerCase()}?`} />
    </>
  );
}
