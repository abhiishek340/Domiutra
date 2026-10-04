import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { servicesByPillar } from "@/lib/data/services";
import type { Pillar } from "@/lib/data/types";
import { buildMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/animations/Reveal";

export const metadata: Metadata = buildMetadata({
  title: "Technology Services: Engineering, Modernization, Cloud, AI & Managed Services",
  description:
    "Software engineering, application modernization, cloud and DevOps, AI and data, managed technology services, and QA automation, delivered by U.S.-managed global teams.",
  path: "/services",
  eyebrow: "Services",
});

const pillars: { name: Pillar; line: string; description: string }[] = [
  { name: "Build", line: "New products, platforms, and capabilities.", description: "Engineering teams that design and ship software, data products, and AI features, with quality built in from the first sprint." },
  { name: "Modernize", line: "Move existing systems forward.", description: "Incremental modernization of applications and infrastructure, so change gets cheaper without stopping the business." },
  { name: "Operate", line: "Keep critical systems healthy.", description: "Ongoing ownership of production with agreed service levels, monitoring, and continuous improvement." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ name: "Services", path: "/services" }]}
        eyebrow="Services"
        title="Build. Modernize. Operate."
        intro={<p>Six services, one accountable delivery model. Combine them around the outcome you need.</p>}
        actions={
          <>
            <ButtonLink href="/contact" size="lg" arrow>Talk to Domiutra</ButtonLink>
            <ButtonLink href="/engagement-models#estimator" variant="ghost" size="lg" arrow>Plan a delivery model</ButtonLink>
          </>
        }
      />

      {pillars.map((pillar, pi) => (
        <section
          key={pillar.name}
          aria-labelledby={`pillar-${pillar.name}`}
          className={pi % 2 === 1 ? "border-y border-line bg-ink-900 py-16 md:py-20" : "py-16 md:py-20"}
        >
          <div className="container-site grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="font-mono text-xs text-mint">0{pi + 1}</p>
              <h2 id={`pillar-${pillar.name}`} className="mt-3 text-h1 font-semibold">{pillar.name}</h2>
              <p className="mt-4 text-lg text-fg">{pillar.line}</p>
              <p className="mt-3 max-w-sm text-fg-muted">{pillar.description}</p>
            </div>
            <RevealGroup as="ul" className="lg:col-span-8">
              {servicesByPillar(pillar.name).map((s) => (
                <RevealItem as="li" key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group block border-t border-line py-7 transition-colors last:border-b"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <Icon name={s.icon} className="size-5 text-mint" />
                        <span className="font-mono text-xs text-fg-subtle">{s.number}</span>
                      </div>
                      <h3 className="mt-3 flex items-center gap-2 text-h3 font-semibold transition-colors group-hover:text-mint">
                        {s.title}
                        <ArrowUpRight aria-hidden="true" className="size-5 opacity-50 transition-[transform,opacity] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </h3>
                      <p className="mt-2 max-w-xl text-fg-muted">{s.summary}</p>
                    </div>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      ))}

      <FinalCTA />
    </>
  );
}
