"use client";

import { useEffect, type RefObject } from "react";
import { animate, stagger } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Styles = Record<string, string>;

type Options = {
  /** Selector for children to stagger. Omit to animate the root itself. */
  items?: string;
  y?: number;
  delay?: number;
  /** Custom start/end styles. Defaults to a fade-up. */
  from?: Styles;
  to?: Styles;
  duration?: number;
  staggerBy?: number;
};

/**
 * Progressive-enhancement scroll reveal.
 *
 * Server HTML is always fully visible. After hydration, only content that
 * starts below the fold is set to its `from` state, then animated to `to`
 * when it enters view. If JavaScript fails to load or run, nothing is ever hidden.
 */
export function useReveal(
  ref: RefObject<HTMLElement | null>,
  { items, y = 16, delay = 0, from, to, duration = 0.6, staggerBy = 0.07 }: Options = {},
) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already on screen at load: leave it alone rather than flash it.
    if (root.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    const targets = items ? Array.from(root.querySelectorAll<HTMLElement>(items)) : [root];
    if (targets.length === 0) return;

    const start: Styles = from ?? { opacity: "0", transform: `translateY(${y}px)` };
    const end: Styles = to ?? { opacity: "1", transform: "translateY(0px)" };
    targets.forEach((t) => Object.assign(t.style, start));

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        // Explicit [from, to] keyframes so transforms interpolate instead of snapping.
        const keyframes: Record<string, (string | number)[]> = {};
        for (const [key, value] of Object.entries(end)) {
          const from = start[key] ?? "";
          keyframes[key] = key === "opacity" ? [Number(from || 0), Number(value)] : [from, value];
        }
        animate(targets, keyframes, { duration, ease: EASE, delay: stagger(staggerBy, { startDelay: delay }) });
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(root);

    return () => {
      io.disconnect();
      targets.forEach((t) => {
        for (const key of Object.keys(start)) t.style.setProperty(key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`), "");
      });
    };
    // from/to are static per call site; serialize so inline objects don't retrigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, items, y, delay, duration, staggerBy, JSON.stringify(from), JSON.stringify(to)]);
}
