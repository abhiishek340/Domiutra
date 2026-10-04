import { services } from "@/lib/data/services";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/animations/Reveal";

export function ServicesSection() {
  return (
    <section aria-labelledby="services-title" className="py-20 md:py-28">
      <div className="container-site">
        <SectionHeading
          id="services-title"
          align="split"
          eyebrow="Services"
          title="One partner. Six ways to move forward."
          intro="Build something new, modernize what you have, or hand us the job of running it."
        />
        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <RevealItem key={service.slug} className="flex">
              <ServiceCard service={service} className="w-full" />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
