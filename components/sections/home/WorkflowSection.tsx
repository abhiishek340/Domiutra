import { workflowStages } from "@/lib/data/delivery";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DrawLine, PopMarkers } from "@/components/animations/DrawLine";
import { ButtonLink } from "@/components/ui/Button";

/** Four steps on a line that draws itself as the section scrolls in. */
export function WorkflowSection() {
  return (
    <section aria-labelledby="workflow-title" className="border-t border-line bg-ink-900 py-20 md:py-28">
      <div className="container-site">
        <SectionHeading id="workflow-title" eyebrow="How we work" title="Backlog to production." />
        <div className="relative mt-14">
          <div className="absolute left-0 right-0 top-5 hidden h-px bg-line md:block">
            <DrawLine className="h-px w-full bg-gradient-to-r from-mint via-mint to-sky" />
          </div>
          <PopMarkers className="relative grid gap-10 md:grid-cols-4 md:gap-6">
            {workflowStages.map((stage) => (
              <li key={stage.number}>
                <span
                  data-pop=""
                  className="relative flex size-10 items-center justify-center rounded-full border border-mint/60 bg-ink-900 font-mono text-xs text-mint shadow-[0_0_24px_-4px_rgb(122_240_195/0.5)]"
                >
                  {stage.number}
                </span>
                <h3 className="mt-5 text-2xl font-semibold tracking-tight">{stage.name}</h3>
                <p className="mt-2 text-fg-muted">{stage.items.join(" · ")}</p>
              </li>
            ))}
          </PopMarkers>
        </div>
        <div className="mt-12">
          <ButtonLink href="/delivery-model" variant="ghost" arrow>
            Our delivery model
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
