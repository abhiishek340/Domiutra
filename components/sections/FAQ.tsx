"use client";

import { useId, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { Plus } from "lucide-react";
import type { FAQItem } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

/** Accessible accordion (button + region pattern) with height animation. */
export function FAQ({ items, tone = "dark" }: { items: FAQItem[]; tone?: "dark" | "light" }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();
  const dark = tone === "dark";

  return (
    <div className={cn("border-t", dark ? "border-line-strong" : "border-line-dark-strong")}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${baseId}-q-${i}`;
        const panelId = `${baseId}-a-${i}`;
        return (
          <div key={item.question} className={cn("border-b", dark ? "border-line" : "border-line-dark")}>
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left"
              >
                <span className="text-lg font-medium tracking-tight md:text-xl">{item.question}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-1 flex size-7 shrink-0 items-center justify-center rounded-full border transition-[transform,border-color,background-color] duration-300",
                    dark ? "border-line-strong group-hover:border-mint" : "border-line-dark-strong group-hover:border-mint-deep",
                    isOpen && "rotate-45",
                  )}
                >
                  <Plus className="size-3.5" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <m.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className={cn("max-w-3xl pb-7 leading-relaxed", dark ? "text-fg-muted" : "text-ink-text-muted")}>{item.answer}</p>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
