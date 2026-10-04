import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { isBriefEnabled, isDemoMode } from "@/lib/brief/config";
import { BriefAssistant } from "@/components/brief/BriefAssistant";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SplitTextReveal } from "@/components/animations/SplitTextReveal";

export const metadata: Metadata = buildMetadata({
  title: "AI Project Brief Assistant",
  description:
    "Describe your technology situation and get a first-draft project brief: recommended services, engagement model, team shape, phases, risks, and open questions.",
  path: "/brief",
  eyebrow: "Brief assistant",
});

export default function BriefPage() {
  if (!isBriefEnabled()) notFound();
  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-36">
      <div aria-hidden="true" className="bg-grid mask-fade-b pointer-events-none absolute inset-0 opacity-25" />
      <div aria-hidden="true" className="aurora pointer-events-none absolute left-1/2 top-0 h-[50vh] w-[70vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(122_240_195/0.14),transparent)] blur-3xl" data-loop="" />
      <div className="container-site relative">
        <div className="animate-fade mb-10">
          <Breadcrumbs items={[{ name: "Brief assistant", path: "/brief" }]} />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-h1 font-semibold">
            <SplitTextReveal text="Draft your project brief." stagger={0.04} />
          </h1>
          <p className="animate-rise mt-5 text-lead text-fg-muted" style={{ animationDelay: "0.15s" }}>
            Describe what you want to build, modernize, or run. Get services, team shape, phases, and risks in seconds.
          </p>
        </div>
        <div className="animate-rise mx-auto mt-12 max-w-4xl" style={{ animationDelay: "0.25s" }}>
          <BriefAssistant demo={isDemoMode()} />
        </div>
      </div>
    </section>
  );
}
