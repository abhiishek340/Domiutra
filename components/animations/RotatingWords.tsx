"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";

type Props = { words: readonly string[]; interval?: number; className?: string };

/**
 * Cycles through words with a short vertical crossfade. Pauses when the tab is
 * hidden; shows a static list for reduced-motion users. The live region is
 * polite and only announces the current word, not every frame.
 */
export function RotatingWords({ words, interval = 2400, className }: Props) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    let id: number | undefined;
    const start = () => {
      id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    };
    const stop = () => window.clearInterval(id);
    const onVisibility = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce, words.length, interval]);

  if (reduce) {
    return <span className={className}>{words.join(", ").replace(/, ([^,]*)$/, ", and $1")}.</span>;
  }

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <span className={`relative inline-grid align-bottom ${className ?? ""}`}>
      {/* Reserve width of the longest word to avoid layout shift */}
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {longest}.
      </span>
      <span className="sr-only">{words.join(", ")}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={words[index]}
          aria-hidden="true"
          className="col-start-1 row-start-1"
          initial={{ y: "70%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-70%", opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          {words[index]}.
        </m.span>
      </AnimatePresence>
    </span>
  );
}
