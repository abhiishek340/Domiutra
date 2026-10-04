"use client";

import { useEffect, useRef } from "react";
import { m, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/** A soft glow that follows the pointer inside its parent section. */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });
  const y = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;
    const center = () => {
      x.jump(parent.clientWidth * 0.7);
      y.jump(parent.clientHeight * 0.4);
    };
    center();
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = parent.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
    };
    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", center);
    return () => {
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", center);
    };
  }, [reduce, x, y]);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <m.div
        style={{ x, y }}
        className="absolute -left-[300px] -top-[300px] size-[600px] rounded-full bg-[radial-gradient(closest-side,rgb(122_240_195/0.16),rgb(141_180_255/0.06)_60%,transparent)] blur-2xl"
      />
    </div>
  );
}
