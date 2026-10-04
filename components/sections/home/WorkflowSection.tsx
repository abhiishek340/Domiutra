import { workflowStages } from "@/lib/data/delivery";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/animations/Reveal";
import { ButtonLink } from "@/components/ui/Button";

/** Compact four-step summary of how engagements run. */
export function WorkflowSection() {
  return (
    <section aria-labelledby="workflow-title" className="border-t border-line bg-ink-900 py-20 md:py-28">
      <div className="container-site">
        <SectionHeading id="workflow-title" align="split" eyebrow="How we work" title="From backlog to production, and beyond." />
        <RevealGroup as="ol" className="relative mt-12 grid gap-8 md:grid-cols-4 md:gap-6">
          <span aria-hidden="true" className="absolute left-0 right-0 top-5 hidden h-px bg-line-strong md:block" />
          {workflowStages.map((stage) => (
            <RevealItem as="li" key={stage.number} className="relative">
              <span className="relative flex size-10 items-center justify-center rounded-full border border-mint/50 bg-ink-900 font-mono text-xs text-mint">
                {stage.number}
              </span>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">{stage.name}</h3>
              <p className="mt-2 max-w-xs text-[0.95rem] leading-relaxed text-fg-muted">{stage.caption}</p>
            </RevealItem>
          ))}
        </RevealGroup>
        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
          <ButtonLink href="/delivery-model" variant="ghost" arrow>
            Our delivery model
          </ButtonLink>
          <ButtonLink href="/engagement-models#estimator" variant="ghost" arrow>
            Plan a team shape
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
