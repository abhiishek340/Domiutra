import { ButtonLink } from "@/components/ui/Button";
import { SplitTextReveal } from "@/components/animations/SplitTextReveal";
import { RotatingWords } from "@/components/animations/RotatingWords";
import { HeroSystem } from "@/components/diagrams/HeroSystem";

const focusAreas = ["engineering", "cloud", "AI", "operations"] as const;

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-28 pb-16 md:pt-36 lg:min-h-[min(100svh,900px)] lg:pb-20">
      <div aria-hidden="true" className="bg-grid mask-fade-b pointer-events-none absolute inset-0 opacity-40" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 h-[640px] w-[820px] rounded-full bg-[radial-gradient(closest-side,rgb(122_240_195/0.10),transparent)] blur-2xl"
      />

      <div className="container-site relative grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <p className="animate-fade label-mono flex flex-wrap items-center gap-x-2 text-fg-muted">
            <span className="inline-block size-1.5 rounded-full bg-mint" aria-hidden="true" />
            <span>Technology teams for</span>
            <RotatingWords words={focusAreas} className="text-mint" />
          </p>

          <h1 id="hero-title" className="mt-7 text-display font-semibold">
            <SplitTextReveal text="Build. Modernize. Operate." stagger={0.06} />
          </h1>

          <p className="animate-rise mt-8 max-w-lg text-lead text-fg-muted" style={{ animationDelay: "0.18s" }}>
            U.S.-managed engineering, cloud, AI, and operations teams for companies that need more capacity without more complexity.
          </p>

          <div className="animate-rise mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6" style={{ animationDelay: "0.25s" }}>
            <ButtonLink href="/contact" size="lg" arrow>
              Talk to Domiutra
            </ButtonLink>
            <ButtonLink href="/services" variant="ghost" size="lg" arrow>
              Explore services
            </ButtonLink>
          </div>
        </div>

        <div className="animate-fade relative lg:col-span-6" style={{ animationDelay: "0.1s" }}>
          <HeroSystem className="mx-auto max-w-[580px]" />
          <p className="sr-only">
            Illustration: Domiutra as the orchestration layer connecting applications, APIs, data, AI services, and a cloud runtime.
          </p>
        </div>
      </div>
    </section>
  );
}
