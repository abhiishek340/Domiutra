import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/animations/Reveal";

const reasons = [
  { title: "U.S.-managed accountability", body: "One U.S.-based lead owns scope, escalation, and outcomes." },
  { title: "Global engineering capacity", body: "Engineering, QA, cloud, and AI skills without a long hiring plan." },
  { title: "Transparent delivery", body: "Scope, milestones, status, and risks shared on a fixed cadence." },
  { title: "Built for operations", body: "We can keep running and improving the system after launch." },
  { title: "AI-aware engineering", body: "AI where it measurably helps. Engineers still review every change." },
  { title: "Security-first", body: "Least-privilege access and controls shaped to your environment." },
];

export function WhySection() {
  return (
    <section aria-labelledby="why-title" className="surface-light py-20 md:py-28">
      <div className="container-site">
        <SectionHeading
          id="why-title"
          tone="light"
          align="split"
          eyebrow="Why Domiutra"
          title="Accountable delivery, not just added headcount."
          intro="Capacity is easy to buy. Ownership of the outcome is harder. Our model is built around the second."
        />
        <RevealGroup as="ul" className="mt-12 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <RevealItem as="li" key={r.title} className="border-t border-line-dark-strong py-6">
              <span className="font-mono text-xs text-mint-deep">0{i + 1}</span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">{r.title}</h3>
              <p className="mt-1.5 leading-relaxed text-ink-text-muted">{r.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
