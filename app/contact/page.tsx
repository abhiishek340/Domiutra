import type { Metadata } from "next";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";
import { ContactForm } from "@/components/forms/ContactForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SplitTextReveal } from "@/components/animations/SplitTextReveal";
import { isBriefEnabled } from "@/lib/brief/config";
import { BotOrb } from "@/components/brief/BotOrb";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "Contact Domiutra",
  description:
    "Tell us what you're trying to build, modernize, automate, or operate. Start a conversation with Domiutra's U.S.-based team.",
  path: "/contact",
  eyebrow: "Contact",
});

const nextSteps = [
  { title: "We read it", body: "A U.S.-based member of our team reviews your message, not an auto-responder." },
  { title: "We reply", body: "You get a direct response by email with questions or a suggested next step." },
  { title: "We talk", body: "If there’s a fit, a short call to understand your systems, goals, and constraints." },
  { title: "You get a plan", body: "A written proposal: approach, team shape, engagement model, and timeline." },
];

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      <div aria-hidden="true" className="bg-grid mask-fade-b pointer-events-none absolute inset-0 opacity-25" />
      <div className="container-site relative">
        <div className="animate-fade mb-10">
          <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
        </div>
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h1 className="text-h1 font-semibold">
              <SplitTextReveal text="Let’s solve something important." stagger={0.05} />
            </h1>
            <p className="animate-rise mt-6 max-w-md text-lead text-fg-muted" style={{ animationDelay: "0.1s" }}>
              Tell us what you’re trying to build, modernize, automate, or operate.
            </p>

            {isBriefEnabled() && (
              <Link
                href="/brief"
                className="animate-fade group mt-8 flex items-center gap-3 rounded-md border border-line-strong bg-ink-900/60 p-4 transition-colors hover:border-mint/50"
                style={{ animationDelay: "0.25s" }}
              >
                <BotOrb size={32} />
                <span>
                  <span className="block text-sm font-medium text-fg">Not sure how to describe it?</span>
                  <span className="block text-sm text-fg-muted group-hover:text-fg">Draft a project brief with our AI assistant →</span>
                </span>
              </Link>
            )}

            <div className="animate-fade mt-14" style={{ animationDelay: "0.15s" }}>
              <h2 className="label-mono text-fg-subtle">What happens next</h2>
              <ol className="mt-6 space-y-0">
                {nextSteps.map((s, i) => (
                  <li key={s.title} className="relative grid grid-cols-[2.25rem_1fr] pb-6 last:pb-0">
                    {i < nextSteps.length - 1 && <span aria-hidden="true" className="absolute left-[0.6875rem] top-7 bottom-1 w-px bg-line-strong" />}
                    <span className="flex size-6 items-center justify-center rounded-full border border-mint/50 font-mono text-[0.65rem] text-mint">{i + 1}</span>
                    <div>
                      <p className="font-medium">{s.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-fg-muted">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {site.publicEmail && (
              <div className="mt-12 border-t border-line pt-6">
                <p className="label-mono text-fg-subtle">Email</p>
                <a href={`mailto:${site.publicEmail}`} className="mt-2 inline-block text-lg underline decoration-line-strong underline-offset-4 hover:decoration-mint">
                  {site.publicEmail}
                </a>
              </div>
            )}
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="rounded-lg border border-line bg-ink-950/80 p-6 backdrop-blur-sm md:p-10">
              <Suspense fallback={<div className="h-[720px]" aria-hidden="true" />}>
                <ContactForm publicEmail={site.publicEmail} schedulingUrl={site.schedulingUrl} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
