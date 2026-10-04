import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import { CursorGlow } from "@/components/animations/CursorGlow";

type Props = {
  title?: string;
  body?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string } | null;
};

/** Closing call to action with quiet animated system lines behind it. */
export function FinalCTA({
  title = "Have a technology problem worth solving?",
  body = "Tell us what you’re building, modernizing, or running. We’ll reply with a clear next step.",
  primary = { label: "Talk to Domiutra", href: "/contact" },
  secondary = { label: "Explore our services", href: "/services" },
}: Props) {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden border-t border-line bg-ink-950 py-20 md:py-28">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 1440 600"
        fill="none"
      >
        {Array.from({ length: 9 }).map((_, i) => {
          const y = 60 + i * 60;
          return (
            <path
              key={i}
              d={`M0 ${y} C 360 ${y + (i % 2 ? 80 : -80)}, 1080 ${y + (i % 2 ? -80 : 80)}, 1440 ${y}`}
              stroke={i === 4 ? "rgb(122 240 195 / 0.45)" : "rgb(255 255 255 / 0.06)"}
              strokeWidth="1"
              strokeDasharray={i === 4 ? "6 10" : undefined}
              data-loop={i === 4 ? "" : undefined}
              className={i === 4 ? "animate-dash" : undefined}
            />
          );
        })}
      </svg>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-950 to-transparent" />
      <CursorGlow />

      <div className="container-site relative">
        <Reveal className="max-w-4xl">
          <h2 id="cta-title" className="text-h1 font-semibold">
            {title}
          </h2>
          <p className="mt-6 max-w-xl text-lead text-fg-muted">{body}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <ButtonLink href={primary.href} size="lg" arrow>
              {primary.label}
            </ButtonLink>
            {secondary && (
              <ButtonLink href={secondary.href} size="lg" variant="ghost" arrow>
                {secondary.label}
              </ButtonLink>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
