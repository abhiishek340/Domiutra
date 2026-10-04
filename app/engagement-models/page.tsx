import type { Metadata } from "next";
import { engagementModels } from "@/lib/data/engagement-models";
import { buildMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { InteractiveEstimator } from "@/components/forms/InteractiveEstimator";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/animations/Reveal";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = buildMetadata({
  title: "Engagement Models: Project Delivery, Dedicated Teams, Managed Services",
  description:
    "How to engage Domiutra: project delivery, dedicated engineering teams, managed services, or staff augmentation. Who owns what, and when each model fits.",
  path: "/engagement-models",
  eyebrow: "Engagement models",
});

const comparison: { label: string; values: [string, string, string, string] }[] = [
  { label: "Who owns delivery", values: ["Domiutra", "Shared", "Domiutra", "You"] },
  { label: "Commercial basis", values: ["Milestones", "Monthly capacity", "Service fee", "Time & materials"] },
  { label: "Typical length", values: ["Bounded", "Ongoing", "Ongoing", "Short to medium"] },
];

export default function EngagementModelsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ name: "Engagement models", path: "/engagement-models" }]}
        eyebrow="Engagement models"
        title="Engagements built around how you actually work."
        intro={<p>We sell delivery responsibility, not just people. The model you choose decides how much of that responsibility moves to us.</p>}
      />

      <section aria-label="Engagement models" className="py-20 md:py-24">
        <RevealGroup className="container-site grid gap-4 md:grid-cols-2">
          {engagementModels.map((model, i) => (
            <RevealItem
              key={model.slug}
              className={cn(
                "flex flex-col rounded-md border p-6 md:p-8",
                model.primary ? "border-line bg-ink-900" : "border-dashed border-line-strong",
              )}
            >
              <article id={model.slug} className="flex h-full scroll-mt-28 flex-col">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-xs text-mint">0{i + 1}</span>
                  {!model.primary && <span className="label-mono text-fg-subtle">Where appropriate</span>}
                </div>
                <h2 className="mt-5 text-h3 font-semibold">{model.name}</h2>
                <p className="mt-1 text-sm text-mint">{model.bestFor}</p>
                <p className="mt-4 leading-relaxed text-fg-muted">{model.summary}</p>

                <div className="mt-8 grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
                  <div>
                    <h3 className="label-mono text-fg-subtle">You own</h3>
                    <ul className="mt-3 space-y-2 text-sm text-fg">
                      {model.customerResponsibilities.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="label-mono text-mint">We own</h3>
                    <ul className="mt-3 space-y-2 text-sm text-fg">
                      {model.domiutraResponsibilities.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="mt-auto pt-6 text-sm text-fg-subtle">
                  <span className="text-fg-muted">Trade-off:</span> {model.limitations[0]}
                </p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="container-site mt-16">
          <div className="overflow-x-auto" role="region" aria-label="Engagement model comparison" tabIndex={0}>
            <table className="w-full min-w-[640px] border-collapse text-left">
              <caption className="sr-only">Comparison of engagement models</caption>
              <thead>
                <tr className="border-b border-line-strong">
                  <th scope="col" className="py-3 pr-4">
                    <span className="sr-only">Attribute</span>
                  </th>
                  {engagementModels.map((m) => (
                    <th key={m.slug} scope="col" className="py-3 pr-4 text-sm font-semibold">
                      {m.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.label} className="border-b border-line">
                    <th scope="row" className="label-mono py-3.5 pr-4 font-medium text-fg-subtle">
                      {row.label}
                    </th>
                    {row.values.map((v, i) => (
                      <td key={i} className="py-3.5 pr-4 text-sm text-fg-muted">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      <section id="estimator" aria-labelledby="estimator-title" className="scroll-mt-20 border-t border-line bg-ink-900/40 py-20 md:py-24">
        <div className="container-site">
          <SectionHeading
            id="estimator-title"
            align="split"
            eyebrow="Planning tool"
            title="Build your delivery model."
            intro="See how a blended U.S.-managed team might be shaped. No pricing, no email required."
          />
          <Reveal className="mt-12">
            <InteractiveEstimator />
          </Reveal>
        </div>
      </section>

      <FinalCTA title="Not sure which model fits?" body="Describe the work and the outcome you need. We’ll recommend a model and explain the trade-offs." />
    </>
  );
}
