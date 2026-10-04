import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { services, getService } from "@/lib/data/services";
import { buildMetadata } from "@/lib/seo/metadata";
import { serviceJsonLd } from "@/lib/seo/jsonld";
import { PageHero } from "@/components/sections/PageHero";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { ServiceDiagram } from "@/components/diagrams/ServiceDiagram";
import { JsonLd } from "@/components/content/JsonLd";
import { ServiceGlyph } from "@/components/diagrams/ServiceGlyph";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/animations/Reveal";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return buildMetadata({
    title: service.seo.title,
    description: service.seo.description,
    path: `/services/${service.slug}`,
    eyebrow: service.title,
  });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const contactHref = `/contact?service=${service.slug}`;

  return (
    <>
      <JsonLd data={serviceJsonLd({ name: service.title, description: service.seo.description, path: `/services/${service.slug}` })} />

      <PageHero
        breadcrumbs={[
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ]}
        eyebrow={
          <span className="flex items-center gap-3">
            <span className="text-mint">{service.number}</span>
            <span className="h-px w-6 bg-line-strong" aria-hidden="true" />
            {service.pillar}
          </span>
        }
        title={service.headline}
        intro={<p>{service.intro}</p>}
        actions={
          <ButtonLink href={contactHref} size="lg" arrow>
            {service.cta.label}
          </ButtonLink>
        }
        visual={
          <div className="relative hidden aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border border-line bg-ink-900/60 p-10 text-mint/60 lg:flex">
            <div aria-hidden="true" className="bg-dots mask-radial absolute inset-0 opacity-60" />
            <ServiceGlyph kind={service.diagram.key} className="relative h-auto w-full" />
            <Icon name={service.icon} className="absolute right-5 top-5 size-5 text-mint" />
            <p className="label-mono absolute bottom-5 left-5 text-fg-subtle">{service.tags.join(" · ")}</p>
          </div>
        }
      />

      {/* When it fits + how it works */}
      <section aria-labelledby="signals-title" className="py-20 md:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <Eyebrow className="mb-5">When it fits</Eyebrow>
            <h2 id="signals-title" className="text-h2 font-semibold">Signs you need this.</h2>
          </Reveal>
          <RevealGroup as="ul" className="lg:col-span-7 lg:col-start-6">
            {service.signals.map((signal) => (
              <RevealItem as="li" key={signal} className="flex gap-4 border-t border-line py-5 text-lg leading-relaxed last:border-b">
                <span aria-hidden="true" className="mt-3.5 h-px w-4 shrink-0 bg-mint" />
                {signal}
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <div className="container-site mt-20">
          <Reveal>
            <p className="label-mono mb-6 text-fg-subtle">{service.diagram.title}</p>
          </Reveal>
          <ServiceDiagram service={service} />
        </div>
      </section>

      {/* Capabilities */}
      <section aria-labelledby="capabilities-title" className="surface-light py-20 md:py-24">
        <div className="container-site">
          <SectionHeading id="capabilities-title" tone="light" eyebrow="Capabilities" title="What we do." />
          <RevealGroup as="ul" className="mt-12 grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">
            {service.capabilities.map((cap) => (
              <RevealItem as="li" key={cap.title} className="border-t border-line-dark-strong py-6">
                <h3 className="text-lg font-semibold tracking-tight">{cap.title}</h3>
                <p className="mt-1.5 leading-relaxed text-ink-text-muted">{cap.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* FAQ, with technologies and security as quiet context */}
      <section aria-labelledby="faq-title" className="py-20 md:py-24">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <Eyebrow className="mb-5">Questions</Eyebrow>
            <h2 id="faq-title" className="text-h2 font-semibold">Straight answers.</h2>

            <p className="label-mono mt-12 text-fg-subtle">Technologies we often use</p>
            <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Example technologies">
              {service.technologies
                .flatMap((g) => g.items)
                .slice(0, 14)
                .map((t) => (
                  <li key={t} className="rounded-xs border border-line-strong px-2 py-0.5 text-sm text-fg-muted">
                    {t}
                  </li>
                ))}
            </ul>
            <p className="mt-3 text-xs text-fg-subtle">Examples, not a limit. We work in your stack.</p>

            <p className="mt-10 flex gap-3 text-sm leading-relaxed text-fg-muted">
              <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-mint" />
              <span>
                Security is shaped around your environment and obligations.{" "}
                <Link href="/security" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-mint">
                  Our approach
                </Link>
              </span>
            </p>
          </Reveal>
          <div className="lg:col-span-7 lg:col-start-6">
            <FAQ items={service.faqs} />
          </div>
        </div>
      </section>

      <FinalCTA
        title={service.cta.title}
        primary={{ label: service.cta.label, href: contactHref }}
        secondary={{ label: "All services", href: "/services" }}
      />
    </>
  );
}
