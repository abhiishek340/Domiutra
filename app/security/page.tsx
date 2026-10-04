import type { Metadata } from "next";
import { securityPractices } from "@/lib/data/delivery";
import { certifications } from "@/lib/data/trust";
import { buildMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/animations/Reveal";

export const metadata: Metadata = buildMetadata({
  title: "Security: How Domiutra Protects Customer Systems and Data",
  description:
    "Security is part of delivery at Domiutra: least privilege, MFA, secure development, secrets management, environment separation, logging, incident response, and controlled production access.",
  path: "/security",
  eyebrow: "Security",
});

const engagementSteps = [
  { title: "Understand your obligations", body: "Data types, regulatory requirements, contractual commitments, and your internal policies." },
  { title: "Agree on an access model", body: "Who can access what, from where, using which identity provider and devices, and how access is approved and removed." },
  { title: "Build controls into delivery", body: "Pipeline checks, review rules, environment boundaries, and logging set up before production work begins." },
  { title: "Review and adapt", body: "Access reviews and control checks on a regular cadence, and whenever the scope changes." },
];

export default function SecurityPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ name: "Security", path: "/security" }]}
        eyebrow="Security"
        title="Security is part of delivery."
        intro={
          <p>
            Security requirements are defined around each customer’s environment, data, regulatory obligations, and risk profile. These are the practices we build every engagement on.
          </p>
        }
      />

      <section aria-labelledby="practices-title" className="py-20 md:py-24">
        <div className="container-site">
          <SectionHeading id="practices-title" align="split" eyebrow="Baseline practices" title="The defaults, before customization." />
          <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {securityPractices.map((p, i) => (
              <RevealItem key={p.title} className="bg-ink-950 p-7">
                <span className="font-mono text-xs text-mint">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-fg-muted">{p.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section aria-labelledby="per-customer-title" className="surface-light py-20 md:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <Eyebrow tone="light" className="mb-6">Per engagement</Eyebrow>
            <h2 id="per-customer-title" className="text-h2 font-semibold">Shaped around your environment.</h2>
          </Reveal>
          <RevealGroup as="ol" className="lg:col-span-7 lg:col-start-6">
            {engagementSteps.map((s, i) => (
              <RevealItem as="li" key={s.title} className="grid grid-cols-[3rem_1fr] border-t border-line-dark-strong py-7 last:border-b">
                <span className="font-mono text-sm text-mint-deep">0{i + 1}</span>
                <div>
                  <h3 className="text-h3 font-semibold">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-text-muted">{s.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section aria-labelledby="certs-title" className="py-20">
        <div className="container-site max-w-3xl">
          <h2 id="certs-title" className="label-mono text-fg-subtle">Certifications and attestations</h2>
          {certifications.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {certifications.map((c) => (
                <li key={c.name} className="text-lg text-fg">
                  {c.name}
                  {c.detail && <span className="block text-sm text-fg-muted">{c.detail}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-lg leading-relaxed text-fg">
              We list third-party certifications here only once they’re formally obtained. If your procurement process requires specific evidence, tell us early and we’ll explain what we can provide, including completing your security questionnaire.
            </p>
          )}
        </div>
      </section>

      <FinalCTA title="Have specific security requirements?" body="Share them early. We’ll design the access model and controls with your team before work starts." />
    </>
  );
}
