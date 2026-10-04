"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";

/**
 * Sets --x/--y on every [data-spotlight] child so cards can render a
 * cursor-following highlight in CSS. One listener, no re-renders.
 */
export function SpotlightGroup({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    ref.current?.querySelectorAll<HTMLElement>("[data-spotlight]").forEach((el) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--x", `${e.clientX - r.left}px`);
      el.style.setProperty("--y", `${e.clientY - r.top}px`);
    });
  };
  return (
    <div ref={ref} onPointerMove={onMove} className={`group/spot ${className ?? ""}`}>
      {children}
    </div>
  );
}
