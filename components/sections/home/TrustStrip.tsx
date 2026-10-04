import { cn } from "@/lib/utils/cn";

const principles = ["U.S.-managed", "Global delivery", "Security-first", "Flexible engagement", "Outcome-focused"];

/** Oversized infinite ticker of operating principles (static under reduced motion). */
export function TrustStrip() {
  const loop = [...principles, ...principles];
  return (
    <section aria-label="How Domiutra operates" className="overflow-hidden border-y border-line py-7 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <ul data-loop="" className="marquee flex w-max items-center gap-10 md:gap-14">
        {loop.map((p, i) => (
          <li
            key={`${p}-${i}`}
            aria-hidden={i >= principles.length ? true : undefined}
            className="flex items-center gap-10 whitespace-nowrap text-3xl font-semibold tracking-tight md:gap-14 md:text-5xl"
          >
            <span className={cn(i % 2 === 0 ? "text-fg" : "text-transparent [-webkit-text-stroke:1px_rgb(244_247_246/0.45)]")}>{p}</span>
            <span aria-hidden="true" className="size-2 rounded-full bg-mint shadow-[0_0_16px_rgb(122_240_195/0.8)]" />
          </li>
        ))}
      </ul>
    </section>
  );
}
