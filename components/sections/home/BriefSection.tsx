import { BriefAssistant } from "@/components/brief/BriefAssistant";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/animations/Reveal";
import { isBriefEnabled, isDemoMode } from "@/lib/brief/config";

/** Homepage home for the AI brief assistant. Renders nothing until enabled. */
export function BriefSection() {
  if (!isBriefEnabled()) return null;
  return (
    <section aria-labelledby="brief-title" className="relative overflow-hidden py-20 md:py-28">
      <div aria-hidden="true" className="bg-grid mask-radial pointer-events-none absolute inset-0 opacity-30" />
      <div className="container-site relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-5 justify-center">AI brief assistant</Eyebrow>
          <h2 id="brief-title" className="text-h2 font-semibold">
            Describe it. Get a plan.
          </h2>
          <p className="mt-4 text-lead text-fg-muted">One description in, a first-draft project brief out.</p>
        </Reveal>
        <Reveal className="mx-auto mt-12 max-w-4xl" delay={0.08}>
          <BriefAssistant demo={isDemoMode()} />
        </Reveal>
      </div>
    </section>
  );
}
