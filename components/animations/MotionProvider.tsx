"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig } from "motion/react";

// Feature bundle is loaded after hydration so it stays out of the critical path.
const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

/**
 * App-wide Motion configuration.
 * - `reducedMotion="user"` disables transform/layout animation when the OS
 *   asks for reduced motion (opacity transitions remain).
 * - `LazyMotion strict` forces the lightweight `m.*` components everywhere.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
