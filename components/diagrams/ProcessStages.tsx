"use client";

import { useEffect, useRef, useState } from "react";
import { m, useScroll, useSpring } from "motion/react";
import type { DeliveryStage } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

/**
 * Seven-stage process with a sticky rail. The rail's fill tracks scroll
 * progress through the section; the current stage is detected with an
 * IntersectionObserver and marked with aria-current.
 */
export function ProcessStages({ stages }: { stages: DeliveryStage[] }) {
  const container = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start 40%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  useEffect(() => {
    const els = container.current?.querySelectorAll<HTMLElement>("[data-stage]");
    if (!els) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.stage));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={container} className="grid gap-12 lg:grid-cols-12">
      {/* Rail */}
      <nav aria-label="Delivery stages" className="hidden lg:col-span-3 lg:block">
        <div className="sticky top-32 flex gap-5">
          <div className="relative w-px bg-line-strong" aria-hidden="true">
            <m.div className="absolute inset-0 origin-top bg-mint" style={{ scaleY }} />
          </div>
          <ol className="space-y-3 py-1">
            {stages.map((s, i) => (
              <li key={s.number}>
                <a
                  href={`#stage-${s.number}`}
                  aria-current={active === i ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-3 text-sm transition-colors",
                    active === i ? "text-fg" : "text-fg-subtle hover:text-fg-muted",
                  )}
                >
                  <span className={cn("font-mono text-xs", active === i ? "text-mint" : "")}>{s.number}</span>
                  {s.name}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      <ol className="lg:col-span-9">
        {stages.map((s, i) => (
          <li
            key={s.number}
            id={`stage-${s.number}`}
            data-stage={i}
            className={cn(
              "scroll-mt-28 border-t py-10 transition-colors duration-500 first:border-t-0 first:pt-0",
              active === i ? "border-mint/50" : "border-line",
            )}
          >
            <div className="grid gap-6 md:grid-cols-[1fr_1.2fr] md:gap-10">
              <div>
                <p className="font-mono text-sm text-mint">{s.number}</p>
                <h3 className="mt-2 text-h3 font-semibold">{s.name}</h3>
                <p className="mt-3 max-w-sm leading-relaxed text-fg-muted">{s.summary}</p>
              </div>
              <dl className="grid gap-4 self-end text-sm sm:grid-cols-2">
                <div className="border-l border-line-strong pl-4">
                  <dt className="label-mono text-fg-subtle">You</dt>
                  <dd className="mt-1.5 leading-relaxed text-fg-muted">{s.customer}</dd>
                </div>
                <div className="border-l border-mint/50 pl-4">
                  <dt className="label-mono text-mint">Domiutra</dt>
                  <dd className="mt-1.5 leading-relaxed text-fg-muted">{s.domiutra}</dd>
                </div>
              </dl>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
