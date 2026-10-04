"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { useReveal } from "@/components/animations/useReveal";
import { UserRound } from "lucide-react";
import type { StepDetail } from "@/lib/data/diagram-details";
import { cn } from "@/lib/utils/cn";

type Props = {
  steps: string[];
  details?: Record<string, StepDetail>;
  label: string;
};

/**
 * A process/architecture flow that draws itself in on scroll. When `details`
 * are supplied, each step is a toggle button that reveals an explanation.
 * Horizontal on wide screens (wrapping into rows), vertical on mobile.
 */
export function StepFlow({ steps, details, label }: Props) {
  const listRef = useRef<HTMLOListElement>(null);
  useReveal(listRef, { items: ":scope > li" });
  const interactive = Boolean(details);
  const [active, setActive] = useState(0);
  const panelId = useId();
  const activeStep = steps[active] ?? steps[0] ?? "";
  const activeDetail = details?.[activeStep];

  return (
    <div>
      <ol
        ref={listRef}
        aria-label={label}
        className="relative grid gap-3 sm:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr lg:grid-cols-none lg:gap-0"
      >
        {steps.map((step, i) => {
          const tone = details?.[step]?.tone ?? (i === steps.length - 1 ? "final" : "default");
          const selected = interactive && i === active;
          const content = (
            <>
              <span className="flex items-center justify-between">
                <span className={cn("font-mono text-[0.65rem]", tone === "legacy" ? "text-fg-subtle" : "text-mint")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {tone === "human" && <UserRound aria-hidden="true" className="size-3.5 text-sky" />}
              </span>
              <span className={cn("mt-3 block text-sm font-medium leading-snug", tone === "legacy" ? "text-fg-muted line-through decoration-fg-subtle/40" : "text-fg")}>
                {step}
              </span>
            </>
          );
          return (
            <li key={step} className="relative lg:pr-3">
              {/* connector to next step (desktop) */}
              {i < steps.length - 1 && (
                <span aria-hidden="true" className="absolute left-full top-1/2 hidden h-px w-3 -translate-x-3 bg-line-strong lg:block" />
              )}
              {interactive ? (
                <button
                  type="button"
                  aria-pressed={selected}
                  aria-controls={panelId}
                  onClick={() => setActive(i)}
                  className={cn(
                    "flex h-full min-h-24 w-full flex-col rounded-md border p-4 text-left transition-[border-color,background-color] duration-300",
                    stepStyle(tone),
                    selected ? "border-mint bg-mint/[0.07]" : "hover:border-line-strong",
                  )}
                >
                  {content}
                </button>
              ) : (
                <div className={cn("flex h-full min-h-24 flex-col rounded-md border p-4", stepStyle(tone))}>{content}</div>
              )}
            </li>
          );
        })}
      </ol>

      {interactive && activeDetail && (
        <div id={panelId} aria-live="polite" className="mt-4 min-h-24 rounded-md border border-line bg-ink-900 p-5 md:p-6">
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={activeStep}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="grid gap-2 md:grid-cols-[14rem_1fr] md:gap-8"
            >
              <p className="label-mono text-mint">
                Step {String(active + 1).padStart(2, "0")} · {activeStep}
              </p>
              <p className="leading-relaxed text-fg-muted">{activeDetail.detail}</p>
            </m.div>
          </AnimatePresence>
        </div>
      )}
      {interactive && <p className="mt-3 text-xs text-fg-subtle">Select a step to see what happens there.</p>}
    </div>
  );
}

function stepStyle(tone: StepDetail["tone"]) {
  switch (tone) {
    case "legacy":
      return "border-dashed border-line-strong bg-transparent";
    case "human":
      return "border-sky/40 bg-sky/[0.05]";
    case "final":
      return "border-mint/40 bg-ink-850";
    default:
      return "border-line bg-ink-900";
  }
}
