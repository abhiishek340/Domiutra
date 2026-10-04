import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Info } from "lucide-react";
import { caseStudies, getCaseStudy } from "@/lib/data/case-studies";
import { getService } from "@/lib/data/services";
import { buildMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { StepFlow } from "@/components/diagrams/StepFlow";
import { CaseStudyKindBadge } from "@/components/cards/CaseStudyCard";
import { Reveal, RevealGroup, RevealItem } from "@/components/animations/Reveal";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return buildMetadata({
    title: study.title,
    description: study.summary,
    path: `/work/${study.slug}`,
    eyebrow: study.kind === "representative" ? "Representative engagement" : "Case study",
  });
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  const representative = study.kind === "representative";

  const narrative = [
    { label: "Challenge", body: study.challenge },
    { label: "Approach", body: study.approach },
    { label: "Solution", body: study.solution },
  ];

  return (
    <>
      <PageHero
        breadcrumbs={[
          { name: "Work", path: "/work" },
          { name: study.industry, path: `/work/${study.slug}` },
        ]}
        eyebrow={<CaseStudyKindBadge kind={study.kind} />}
        title={study.title}
        intro={<p>{study.summary}</p>}
      />

      {representative && (
        <div className="border-b border-line bg-sky/[0.06]">
          <p className="container-site flex gap-3 py-4 text-sm text-fg-muted">
            <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-sky" />
            This is a representative engagement: an illustrative example of how we would approach a common situation. It is not a description of a specific customer project.
          </p>
        </div>
      )}

      <section aria-label="Engagement overview" className="py-20 md:py-24">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <dl className="space-y-6 lg:sticky lg:top-32">
              <div>
                <dt className="label-mono text-fg-subtle">Industry</dt>
                <dd className="mt-2">{study.industry}</dd>
              </div>
              <div>
                <dt className="label-mono text-fg-subtle">Services</dt>
                <dd className="mt-2">
                  <ul className="space-y-1">
                    {study.services.map((s) => {
                      const svc = getService(s);
                      return (
                        <li key={s}>
                          <Link href={`/services/${s}`} className="underline decoration-line-strong underline-offset-4 hover:decoration-mint">
                            {svc?.title ?? s}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="label-mono text-fg-subtle">Technologies</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {study.technologies.map((t) => (
                    <span key={t} className="rounded-xs border border-line-strong px-2 py-0.5 text-sm">
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </aside>

          <div className="lg:col-span-8 lg:col-start-5">
            <RevealGroup className="space-y-12">
              {narrative.map((n, i) => (
                <RevealItem key={n.label} className="grid gap-4 border-t border-line pt-8 md:grid-cols-[10rem_1fr]">
                  <h2 className="label-mono text-mint">
                    0{i + 1} · {n.label}
                  </h2>
                  <p className="text-lg leading-relaxed text-fg">{n.body}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      <section aria-labelledby="architecture-title" className="border-y border-line bg-ink-900 py-20 md:py-24">
        <div className="container-site">
          <Reveal>
            <h2 id="architecture-title" className="label-mono text-fg-subtle">Architecture</h2>
          </Reveal>
          <div className="mt-6">
            <StepFlow steps={study.architecture} label="Architecture outline" />
          </div>
        </div>
      </section>

      <section aria-labelledby="outcomes-title" className="py-20 md:py-24">
        <div className="container-site grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 id="outcomes-title" className="text-h2 font-semibold">
              {representative ? "How success is measured" : "Outcomes"}
            </h2>
            {representative && (
              <p className="mt-4 text-fg-muted">
                Metrics we would agree with you before the work starts. Targets are set per engagement after baselining.
              </p>
            )}
          </Reveal>
          <RevealGroup as="ul" className="lg:col-span-7 lg:col-start-6">
            {study.outcomes.map((o) => (
              <RevealItem as="li" key={o} className="flex gap-4 border-t border-line py-5 text-lg last:border-b">
                <span aria-hidden="true" className="mt-3 h-px w-4 shrink-0 bg-mint" />
                {o}
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <FinalCTA title="Facing something similar?" body="Tell us about the system and the constraints. We’ll tell you how we’d approach it." />
    </>
  );
}
