import type { Metadata } from "next";
import { deliveryStages } from "@/lib/data/delivery";
import { buildMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { ProcessStages } from "@/components/diagrams/ProcessStages";
import { DeliveryLayers } from "@/components/diagrams/DeliveryLayers";
import { DeliveryModelExplorer } from "@/components/diagrams/DeliveryModelExplorer";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/animations/Reveal";

export const metadata: Metadata = buildMetadata({
  title: "How Domiutra Delivers: U.S.-Managed Global Delivery Model",
  description:
    "Domiutra's delivery model: U.S.-based account leadership, solution architecture and delivery management, and global engineering teams, across seven stages from discovery to operations.",
  path: "/delivery-model",
  eyebrow: "Delivery model",
});

export default function DeliveryModelPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ name: "Delivery model", path: "/delivery-model" }]}
        eyebrow="How Domiutra delivers"
        title="U.S.-managed. Globally delivered. Built for outcomes."
        intro={
          <p>
            We build flexible delivery teams around your requirements, time zones, security needs, and technology environment. You get one accountable relationship and a process designed to make progress visible.
          </p>
        }
      />

      <section aria-labelledby="structure-title" className="py-20 md:py-24">
        <div className="container-site grid gap-14 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-4">
            <Eyebrow className="mb-6">Structure</Eyebrow>
            <h2 id="structure-title" className="text-h2 font-semibold">Who you work with, and who’s accountable.</h2>
            <p className="mt-6 text-fg-muted">
              U.S.-based leadership owns the relationship and outcomes. Global engineering capacity is assembled around each engagement.
            </p>
          </Reveal>
          <div className="lg:col-span-7 lg:col-start-6">
            <DeliveryLayers />
          </div>
        </div>
      </section>

      <section aria-labelledby="stages-title" className="py-20 md:py-24">
        <div className="container-site">
          <SectionHeading
            id="stages-title"
            align="split"
            eyebrow="Process"
           
            title="Seven stages, one clear split of responsibility."
          />
          <div className="mt-16">
            <ProcessStages stages={deliveryStages} />
          </div>
        </div>
      </section>

      <section aria-labelledby="models-title" className="border-t border-line bg-ink-900 py-20 md:py-24">
        <div className="container-site">
          <SectionHeading id="models-title" align="split" eyebrow="Engagement shapes" title="The right team for the work." />
          <Reveal className="mt-14">
            <DeliveryModelExplorer />
          </Reveal>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
