import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { industries } from "@/lib/data/industries";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/animations/Reveal";

export function IndustriesSection() {
  return (
    <section aria-labelledby="industries-title" className="py-20 md:py-28">
      <div className="container-site">
        <SectionHeading
          id="industries-title"
          eyebrow="Industries"
          title="Built for critical systems."
        />
        <RevealGroup as="ul" className="mt-12 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <RevealItem as="li" key={industry.slug} className="bg-ink-950">
              <Link
                href={`/industries/${industry.slug}`}
                className="group flex h-full flex-col p-6 transition-colors hover:bg-ink-900 md:p-7"
              >
                <span className="flex items-center justify-between">
                  <Icon name={industry.icon} className="size-5 text-mint" />
                  <ArrowUpRight aria-hidden="true" className="size-4 text-fg-subtle transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-mint" />
                </span>
                <span className="mt-6 text-lg font-semibold tracking-tight">{industry.name}</span>
                <span className="mt-1.5 text-[0.95rem] leading-relaxed text-fg-muted">{industry.statement}</span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
