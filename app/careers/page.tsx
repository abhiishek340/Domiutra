import type { Metadata } from "next";
import { ArrowUpRight, Briefcase } from "lucide-react";
import { getJobs } from "@/lib/careers/jobs";
import { buildMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";
import { PageHero } from "@/components/sections/PageHero";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/animations/Reveal";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Careers at Domiutra",
  description:
    "Build the systems businesses depend on. Engineering culture, ownership, global collaboration, and technical growth at Domiutra.",
  path: "/careers",
  eyebrow: "Careers",
});

const culture = [
  { title: "Ownership", body: "You’re trusted with outcomes, not just tickets. That means context, decision rights, and the expectation that you’ll speak up early." },
  { title: "Engineering culture", body: "Code review, tests, documentation, and blameless incident reviews are how we work, not aspirations on a wiki." },
  { title: "Global collaboration", body: "Teams span time zones by design. We write things down, protect overlap hours, and respect the hours outside them." },
  { title: "Technical growth", body: "Exposure to modern stacks, cloud platforms, modernization work, and AI engineering, with senior engineers who make time to mentor." },
];

export default async function CareersPage() {
  const jobs = await getJobs();

  return (
    <>
      <PageHero
        breadcrumbs={[{ name: "Careers", path: "/careers" }]}
        eyebrow="Careers"
        title="Build the systems businesses depend on."
        intro={<p>We’re building a delivery organization where engineers own real outcomes for real customers, and grow by doing it well.</p>}
      />

      <section aria-labelledby="culture-title" className="py-20 md:py-24">
        <div className="container-site">
          <Reveal className="max-w-2xl">
            <Eyebrow className="mb-6">How we work</Eyebrow>
            <h2 id="culture-title" className="text-h2 font-semibold">What it’s like to build here.</h2>
          </Reveal>
          <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-2">
            {culture.map((c, i) => (
              <RevealItem key={c.title} className="bg-ink-950 p-7 md:p-9">
                <span className="font-mono text-xs text-mint">0{i + 1}</span>
                <h3 className="mt-4 text-h3 font-semibold">{c.title}</h3>
                <p className="mt-3 leading-relaxed text-fg-muted">{c.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section id="open-roles" aria-labelledby="roles-title" className="surface-light py-20 md:py-24">
        <div className="container-site">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow tone="light" className="mb-6">Open roles</Eyebrow>
              <h2 id="roles-title" className="text-h2 font-semibold">Current openings.</h2>
            </div>
            {jobs.length > 0 && <p className="font-mono text-sm text-ink-text-muted">{jobs.length} open {jobs.length === 1 ? "role" : "roles"}</p>}
          </div>

          {jobs.length > 0 ? (
            <ul className="mt-12 border-t border-line-dark-strong" data-testid="job-list">
              {jobs.map((job) => (
                <li key={job.id} className="border-b border-line-dark">
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid gap-2 py-6 md:grid-cols-[1fr_12rem_12rem_auto] md:items-center md:gap-6"
                  >
                    <span className="text-lg font-semibold tracking-tight group-hover:text-mint-deep">{job.title}</span>
                    <span className="text-sm text-ink-text-muted">{job.team}</span>
                    <span className="text-sm text-ink-text-muted">{[job.location, job.type].filter(Boolean).join(" · ")}</span>
                    <ArrowUpRight aria-hidden="true" className="hidden size-5 md:block" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-12 grid gap-6 rounded-md border border-dashed border-line-dark-strong p-8 md:grid-cols-[auto_1fr] md:p-12" data-testid="jobs-empty">
              <span className="flex size-12 items-center justify-center rounded-full border border-line-dark-strong">
                <Briefcase aria-hidden="true" className="size-5 text-mint-deep" />
              </span>
              <div>
                <p className="text-h3 font-semibold">Open roles will be posted here.</p>
                <p className="mt-3 max-w-2xl leading-relaxed text-ink-text-muted">
                  We don’t have published openings right now. When we do, they’ll appear on this page with full descriptions.
                  {site.publicEmail ? (
                    <>
                      {" "}If you’d like to introduce yourself in the meantime, write to{" "}
                      <a className="underline underline-offset-4" href={`mailto:${site.publicEmail}`}>
                        {site.publicEmail}
                      </a>
                      .
                    </>
                  ) : null}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
