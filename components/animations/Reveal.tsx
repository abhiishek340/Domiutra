"use client";

import { useRef, type ReactNode, type ElementType, type RefObject } from "react";
import { useReveal } from "./useReveal";

type Tag = "div" | "li" | "section" | "article" | "span" | "ul" | "ol" | "dl";

/** Fades content up once when it scrolls into view. Visible without JS. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: Tag;
}) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, { y, delay });
  const Cmp = as as ElementType;
  return (
    <Cmp ref={ref as RefObject<HTMLElement>} data-reveal="" className={className}>
      {children}
    </Cmp>
  );
}

/** Parent that staggers its `RevealItem` children into view. */
export function RevealGroup({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol" | "dl";
}) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, { items: "[data-reveal-item]" });
  const Cmp = as as ElementType;
  return (
    <Cmp ref={ref as RefObject<HTMLElement>} className={className}>
      {children}
    </Cmp>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const Cmp = as as ElementType;
  return (
    <Cmp data-reveal="" data-reveal-item="" className={className}>
      {children}
    </Cmp>
  );
}
