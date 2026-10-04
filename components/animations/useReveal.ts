"use client";

import { useEffect, type RefObject } from "react";
import { animate, stagger } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Options = {
  /** Selector for children to stagger. Omit to animate the root itself. */
  items?: string;
  y?: number;
  delay?: number;
};

/**
 * Progressive-enhancement scroll reveal.
 *
 * Server HTML is always fully visible. After hydration, only content that
 * starts below the fold is hidden, then animated in when it enters view.
 * If JavaScript fails to load or run, nothing is ever hidden.
 */
export function useReveal(ref: RefObject<HTMLElement | null>, { items, y = 16, delay = 0 }: Options = {}) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already on screen at load: leave it alone rather than flash it.
    if (root.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    const targets = items ? Array.from(root.querySelectorAll<HTMLElement>(items)) : [root];
    if (targets.length === 0) return;

    targets.forEach((t) => {
      t.style.opacity = "0";
      t.style.transform = `translateY(${y}px)`;
    });

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        animate(
          targets,
          { opacity: 1, transform: "translateY(0px)" },
          { duration: 0.6, ease: EASE, delay: stagger(0.07, { startDelay: delay }) },
        );
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(root);

    return () => {
      io.disconnect();
      targets.forEach((t) => {
        t.style.opacity = "";
        t.style.transform = "";
      });
    };
  }, [ref, items, y, delay]);
}
