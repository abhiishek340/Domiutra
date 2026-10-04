import { services } from "@/lib/data/services";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/animations/Reveal";
import { SpotlightGroup } from "@/components/animations/SpotlightGroup";

export function ServicesSection() {
  return (
    <section aria-labelledby="services-title" className="py-20 md:py-28">
      <div className="container-site">
        <SectionHeading id="services-title" eyebrow="Services" title="Six ways to move forward." />
        <SpotlightGroup className="mt-12">
          <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <RevealItem key={service.slug} className="flex">
                <ServiceCard service={service} className="w-full" />
              </RevealItem>
            ))}
          </RevealGroup>
        </SpotlightGroup>
      </div>
    </section>
  );
}
