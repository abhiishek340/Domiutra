import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { leaders } from "@/lib/data/leadership";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { LeadershipGrid } from "@/components/sections/LeadershipGrid";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/animations/Reveal";

export const metadata: Metadata = buildMetadata({
  title: "About Domiutra",
  description:
    "Domiutra is a U.S.-based technology services company providing U.S.-managed engineering, modernization, cloud, AI, and managed services through global delivery teams.",
  path: "/about",
  eyebrow: "About",
});

const principles = [
  {
    name: "Accountability",
    line: "We own the work, not just the task.",
    body: "A task can be completed while the outcome fails. We take responsibility for whether the system works, the release lands, and the problem is actually solved, and we say so early when it isn’t.",
  },
  {
    name: "Practicality",
    line: "Technology decisions should serve business goals.",
    body: "We prefer the boring solution that works over the impressive one that needs explaining. Architecture, tools, and AI are chosen for the outcome, the budget, and the team that has to live with them.",
  },
  {
    name: "Continuity",
    line: "The relationship should survive the launch.",
    body: "Most of a system’s life happens after go-live. We document, plan for handover, and, when it makes sense, stay on to operate and improve what we built.",
  },
];

const gaps = [
  { left: "We need engineers", right: "Staff augmentation gives you people. You still own the plan, the management, and the outcome." },
  { left: "We need this problem solved", right: "Large consultancies solve problems, often with overhead sized for the largest enterprises." },
  { left: "Domiutra", right: "Accountable delivery with U.S.-based leadership and global engineering capacity, sized for mid-market reality." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ name: "About", path: "/about" }]}
        eyebrow="About Domiutra"
        title="Technology should make the business easier to run."
        intro={
          <p>
            Domiutra is a U.S.-based technology services company. We help companies build, modernize, and operate the systems they depend on, combining accountable U.S. leadership with global engineering capacity.
          </p>
        }
      />

      <section aria-labelledby="philosophy-title" className="py-20 md:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Eyebrow className="mb-6">Philosophy</Eyebrow>
            <h2 id="philosophy-title" className="text-h2 font-semibold">Why Domiutra exists.</h2>
          </Reveal>
          <Reveal className="space-y-6 text-lead text-fg-muted lg:col-span-6 lg:col-start-7" delay={0.06}>
            <p>
              Growing companies carry the same technology load as large ones, without the same in-house depth. The usual options force a trade-off: hire slowly, manage contractors yourself, or pay for enterprise-consultancy overhead.
            </p>
            <p className="text-fg">
              Domiutra offers a different shape: a partner that owns delivery, is accountable in the U.S., and draws on global engineering capacity sized to the work.
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="surface-light py-20 md:py-24">
        <div className="container-site">
          <Reveal>
            <Eyebrow tone="light" className="mb-6">Principles</Eyebrow>
            <h2 id="principles-title" className="max-w-2xl text-h2 font-semibold">Three commitments that shape every engagement.</h2>
          </Reveal>
          <RevealGroup as="ol" className="mt-14 grid gap-px overflow-hidden rounded-md border border-line-dark bg-line-dark md:grid-cols-3">
            {principles.map((p, i) => (
              <RevealItem as="li" key={p.name} className="flex flex-col bg-paper p-7 md:p-9">
                <span className="font-mono text-sm text-mint-deep">0{i + 1}</span>
                <h3 className="mt-10 text-h2 font-semibold">{p.name}</h3>
                <p className="mt-3 text-lg font-medium text-ink-text">{p.line}</p>
                <p className="mt-4 leading-relaxed text-ink-text-muted">{p.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section aria-labelledby="gap-title" className="py-20 md:py-24">
        <div className="container-site">
          <Reveal className="max-w-4xl">
            <Eyebrow className="mb-6">Positioning</Eyebrow>
            <h2 id="gap-title" className="text-h2 font-semibold">
              Built for the gap between “we need engineers” and “we need this problem solved.”
            </h2>
          </Reveal>
          <RevealGroup as="dl" className="mt-14">
            {gaps.map((g, i) => (
              <RevealItem
                key={g.left}
                className={`grid gap-3 border-t py-7 md:grid-cols-[22rem_1fr] md:gap-10 ${i === gaps.length - 1 ? "border-b border-mint/50" : "border-line"}`}
              >
                <dt className={`text-h3 font-semibold ${i === gaps.length - 1 ? "text-mint" : "text-fg-muted"}`}>
                  {i < gaps.length - 1 ? `“${g.left}”` : g.left}
                </dt>
                <dd className={`text-lg leading-relaxed ${i === gaps.length - 1 ? "text-fg" : "text-fg-muted"}`}>{g.right}</dd>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <LeadershipGrid leaders={leaders} />

      <FinalCTA />
    </>
  );
}
