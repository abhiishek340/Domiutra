"use client";

import { useRef } from "react";
import { useReveal } from "./useReveal";

/** A horizontal line that draws itself left-to-right when scrolled into view. */
export function DrawLine({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useReveal(ref, { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" }, duration: 1.4 });
  return <span ref={ref} aria-hidden="true" className={`block origin-left ${className ?? ""}`} />;
}

/** Staggered "pop" for markers inside a container. */
export function PopMarkers({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLOListElement>(null);
  useReveal(ref, {
    items: "[data-pop]",
    from: { opacity: "0", transform: "scale(0.4)" },
    to: { opacity: "1", transform: "scale(1)" },
    duration: 0.5,
    staggerBy: 0.25,
    delay: 0.2,
  });
  return (
    <ol ref={ref} className={className}>
      {children}
    </ol>
  );
}
