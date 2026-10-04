import type { Metadata } from "next";
import { industries } from "@/lib/data/industries";
import { buildMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/sections/PageHero";
import { IndustryCard } from "@/components/cards/IndustryCard";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { RevealGroup, RevealItem } from "@/components/animations/Reveal";

export const metadata: Metadata = buildMetadata({
  title: "Industries: Financial Services, Healthcare, Manufacturing, SaaS & Logistics",
  description:
    "Technology services for industries where systems are long-lived, data is sensitive, and operations can't stop: financial services, healthcare, manufacturing, technology, logistics, and professional services.",
  path: "/industries",
  eyebrow: "Industries",
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ name: "Industries", path: "/industries" }]}
        eyebrow="Industries"
        title="Technology work shaped by how your industry actually operates."
        intro={
          <p>
            Regulation, data sensitivity, uptime, and legacy systems differ by industry. We start from those constraints, then decide what to build, modernize, or operate.
          </p>
        }
      />
      <section aria-label="Industries" className="surface-light py-20 md:py-28">
        <RevealGroup className="container-site grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, i) => (
            <RevealItem key={industry.slug} className={i === 0 ? "flex md:col-span-2" : "flex"}>
              <IndustryCard industry={industry} size={i === 0 ? "lg" : "md"} className="w-full" />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
      <FinalCTA
        title="Don’t see your industry?"
        body="The constraints matter more than the label. Tell us about your systems, data, and obligations."
      />
    </>
  );
}
