import Image from "next/image";
import type { Leader } from "@/lib/data/types";
import { RevealGroup, RevealItem } from "@/components/animations/Reveal";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

/** Renders nothing when there are no leaders, so no placeholder people appear. */
export function LeadershipGrid({ leaders }: { leaders: Leader[] }) {
  if (leaders.length === 0) return null;
  return (
    <section aria-labelledby="leadership-title" className="border-t border-line py-20 md:py-24">
      <div className="container-site">
        <h2 id="leadership-title" className="text-h2 font-semibold">Leadership</h2>
        <RevealGroup as="ul" className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {leaders.map((l) => (
            <RevealItem as="li" key={l.name}>
              <div className="relative aspect-square overflow-hidden rounded-md border border-line bg-ink-900">
                {l.image ? (
                  <Image src={l.image} alt={`Portrait of ${l.name}`} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover grayscale" />
                ) : (
                  <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-4xl font-semibold text-fg-subtle">
                    {initials(l.name)}
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{l.name}</h3>
              <p className="text-sm text-mint">{l.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">{l.bio}</p>
              {l.linkedin && (
                <a href={l.linkedin} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm underline underline-offset-4">
                  LinkedIn<span className="sr-only"> profile of {l.name} (opens in a new tab)</span>
                </a>
              )}
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
