import { ButtonLink } from "@/components/ui/Button";
import { WaveField } from "@/components/animations/WaveField";
import { Magnetic } from "@/components/animations/Magnetic";
import { PointerTilt } from "@/components/animations/PointerTilt";
import { cn } from "@/lib/utils/cn";

const WORDS = ["Build.", "Modernize.", "Operate."];

/**
 * Full-screen hero: interactive 3D wave terrain behind a kinetic, three-word title.
 * The letter entrance is CSS-only (runs before hydration, always ends visible).
 */
export function Hero() {
  let letterIndex = 0;
  return (
    <section aria-labelledby="hero-title" className="relative flex min-h-svh items-center overflow-hidden">
      <WaveField className="absolute inset-0 h-full w-full" />
      {/* Aurora: two slow-drifting glows above the horizon */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div data-loop="" className="aurora absolute left-[12%] top-[8%] h-[46vh] w-[52vw] rounded-full bg-[radial-gradient(closest-side,rgb(122_240_195/0.24),transparent)] blur-3xl" />
        <div data-loop="" className="aurora aurora-b absolute right-[8%] top-[18%] h-[40vh] w-[46vw] rounded-full bg-[radial-gradient(closest-side,rgb(141_180_255/0.22),transparent)] blur-3xl" />
      </div>
      {/* Keeps the title crisp over the field */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_44%_52%_at_50%_56%,rgb(8_11_16/0.82),rgb(8_11_16/0.4)_55%,transparent_78%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink-950 to-transparent" />

      <div className="container-site pointer-events-none relative pb-[14vh] pt-28 text-center [&_a]:pointer-events-auto">
        <p data-anim="" className="animate-fade mx-auto inline-flex items-center gap-2 rounded-full border border-line-strong bg-ink-950/60 px-4 py-1.5 backdrop-blur-sm">
          <span aria-hidden="true" data-loop="" className="size-1.5 animate-pulse-soft rounded-full bg-mint" />
          <span className="label-mono text-fg-muted">U.S.-managed · Globally delivered</span>
        </p>

        <PointerTilt className="mt-10">
          <h1 id="hero-title" aria-label="Build. Modernize. Operate." className="hero-title font-semibold">
            {WORDS.map((word, wi) => (
              <span key={word}>
                <span className="block whitespace-nowrap">
                  {[...word].map((ch, ci) => {
                    const d = 0.15 + letterIndex++ * 0.035 + wi * 0.12;
                    const accent = wi === WORDS.length - 1;
                    return (
                      <span
                        key={ci}
                        data-anim=""
                        className={cn("hero-letter", accent && "hero-letter-accent")}
                        style={{ animationDelay: accent ? `${d}s, ${1.4 + ci * 0.11}s` : `${d}s` }}
                      >
                        {ch}
                      </span>
                    );
                  })}
                </span>
                {wi < WORDS.length - 1 ? " " : null}
              </span>
            ))}
          </h1>
        </PointerTilt>

        <p data-anim="" className="animate-rise mx-auto mt-10 max-w-2xl text-lead text-fg-muted" style={{ animationDelay: "1.1s" }}>
          Engineering, cloud, AI, and operations, without the overhead.
        </p>

        <div data-anim="" className="animate-rise mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6" style={{ animationDelay: "1.25s" }}>
          <Magnetic>
            <ButtonLink href="/contact" size="lg" arrow className="shadow-[0_0_40px_-8px_rgb(122_240_195/0.6)]">
              Talk to Domiutra
            </ButtonLink>
          </Magnetic>
          <Magnetic strength={0.2}>
            <ButtonLink href="/services" variant="secondary" size="lg" className="bg-ink-950/50 backdrop-blur-sm">
              Explore services
            </ButtonLink>
          </Magnetic>
        </div>
      </div>

    </section>
  );
}
