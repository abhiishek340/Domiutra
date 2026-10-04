import type { Metadata } from "next";
import { Info } from "lucide-react";
import { caseStudies } from "@/lib/data/case-studies";
import { buildMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { CaseStudyCard } from "@/components/cards/CaseStudyCard";
import { RevealGroup, RevealItem } from "@/components/animations/Reveal";

export const metadata: Metadata = buildMetadata({
  title: "Work: Case Studies and Representative Engagements",
  description:
    "How Domiutra approaches modernization, dedicated product teams, AI-assisted workflows, and managed operations. Representative engagements are clearly labeled.",
  path: "/work",
  eyebrow: "Work",
});

export default function WorkPage() {
  const clientWork = caseStudies.filter((c) => c.kind === "client");
  const representative = caseStudies.filter((c) => c.kind === "representative");

  return (
    <>
      <PageHero
        breadcrumbs={[{ name: "Work", path: "/work" }]}
        eyebrow="Work"
        title="How we approach the problems we’re hired to solve."
        intro={<p>Each engagement is documented the same way: the challenge, our approach, the architecture, and how success is measured.</p>}
      />

      <section aria-labelledby="client-work-title" className="py-20 md:py-24">
        <div className="container-site">
          <h2 id="client-work-title" className="label-mono text-fg-subtle">Client case studies</h2>
          {clientWork.length > 0 ? (
            <RevealGroup className="mt-6 grid gap-4 md:grid-cols-2">
              {clientWork.map((c) => (
                <RevealItem key={c.slug} className="flex">
                  <CaseStudyCard study={c} className="w-full" />
                </RevealItem>
              ))}
            </RevealGroup>
          ) : (
            <div className="mt-6 grid gap-6 rounded-lg border border-dashed border-line-strong p-8 md:grid-cols-[auto_1fr] md:p-12">
              <span className="flex size-12 items-center justify-center rounded-full border border-line-strong">
                <span aria-hidden="true" className="size-2 rounded-full bg-mint animate-pulse-soft" data-loop="" />
              </span>
              <div>
                <p className="text-h3 font-semibold">Case study publishing soon.</p>
                <p className="mt-3 max-w-2xl leading-relaxed text-fg-muted">
                  We publish client work only with explicit permission and real, verified outcomes. Until then, the representative engagements below show how we structure common problems. If you’d like to speak with us about relevant experience, we’re happy to walk through it directly.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {representative.length > 0 && (
        <section aria-labelledby="rep-work-title" className="border-t border-line bg-ink-900 py-20 md:py-24">
          <div className="container-site">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <h2 id="rep-work-title" className="text-h2 font-semibold">Representative engagements</h2>
              <p className="flex max-w-md gap-2 text-sm text-fg-muted">
                <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-sky" />
                Illustrative engagement shapes based on common situations. They are not customer projects and contain no customer results.
              </p>
            </div>
            <RevealGroup className="mt-12 grid gap-4 md:grid-cols-2">
              {representative.map((c) => (
                <RevealItem key={c.slug} className="flex">
                  <CaseStudyCard study={c} className="w-full" />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      <FinalCTA />
    </>
  );
}
