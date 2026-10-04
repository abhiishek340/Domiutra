"use client";

import { useRef } from "react";
import { useReveal } from "@/components/animations/useReveal";
import { deliveryLayers } from "@/lib/data/delivery";
import { cn } from "@/lib/utils/cn";

const disciplines = ["Engineering", "QA", "Cloud", "AI", "Support"];

/**
 * The U.S.-managed global delivery structure as a vertical system diagram.
 * Layers reveal in sequence on scroll; a signal travels down each connector
 * to show accountability flowing from the customer to delivery.
 */
export function DeliveryLayers({ className }: { className?: string }) {
  const ref = useRef<HTMLOListElement>(null);
  useReveal(ref, { items: ":scope > li" });

  return (
    <ol
      ref={ref}
      className={cn("relative", className)}
      aria-label="Delivery structure, from your team to delivery disciplines"
    >
      {deliveryLayers.map((layer, i) => {
        const isClient = layer.id === "client";
        const isLeadership = layer.id === "leadership";
        const isDisciplines = layer.id === "disciplines";
        return (
          <li key={layer.id} className="relative">
            {i > 0 && (
              <div aria-hidden="true" className="relative mx-auto h-10 w-px overflow-hidden bg-line">
                <span className="absolute inset-0 bg-mint/60" />
                <span data-loop="" className="absolute left-1/2 top-0 size-1 -translate-x-1/2 rounded-full bg-mint animate-[layer-drop_2.4s_ease-in_infinite]" style={{ animationDelay: `${i * 0.3}s` }} />
              </div>
            )}
            <div
              className={cn(
                "relative mx-auto rounded-md border px-5 py-4 text-center md:px-8 md:py-5",
                isClient && "max-w-md border-line-strong bg-white/[0.03]",
                isLeadership && "max-w-xl border-mint/50 bg-mint/[0.06]",
                layer.id === "architecture" && "max-w-2xl border-line-strong bg-ink-850",
                layer.id === "global" && "max-w-3xl border-sky/40 bg-sky/[0.05]",
                isDisciplines && "max-w-3xl border-line bg-ink-900",
              )}
            >
              <p className={cn("label-mono", isLeadership ? "text-mint" : layer.id === "global" ? "text-sky" : "text-fg-subtle")}>
                Layer 0{i + 1}
              </p>
              {isDisciplines ? (
                <>
                  <p className="sr-only">{layer.label}</p>
                  <ul className="mt-3 flex flex-wrap justify-center gap-2" aria-label="Disciplines">
                    {disciplines.map((d) => (
                      <li key={d} className="rounded-sm border border-line-strong px-3 py-1.5 text-sm font-medium text-fg">
                        {d}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="mt-2 text-lg font-semibold tracking-tight md:text-xl">{layer.label}</p>
              )}
              <p className="mx-auto mt-2 max-w-md text-sm text-fg-muted">{layer.detail}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
