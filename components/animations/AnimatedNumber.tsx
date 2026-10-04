"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";

/**
 * Tweens between numeric values. Use only for real, computed values
 * (e.g. estimator outputs), never for decorative "stats".
 */
export function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = String(value);
      prev.current = value;
      return;
    }
    const controls = animate(prev.current, value, {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = String(Math.round(v));
      },
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, reduce]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
