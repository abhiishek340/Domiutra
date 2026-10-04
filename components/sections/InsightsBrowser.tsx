"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { FileText } from "lucide-react";
import type { Article } from "@/lib/data/types";
import { articleCategories } from "@/lib/data/types";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { cn } from "@/lib/utils/cn";

const ALL = "All";

/** Category filter for the insights index. Filtering is client-side. */
export function InsightsBrowser({ articles }: { articles: Article[] }) {
  const [category, setCategory] = useState<string>(ALL);
  const filtered = useMemo(
    () => (category === ALL ? articles : articles.filter((a) => a.category === category)),
    [articles, category],
  );
  const counts = useMemo(() => {
    const c: Record<string, number> = { [ALL]: articles.length };
    articles.forEach((a) => (c[a.category] = (c[a.category] ?? 0) + 1));
    return c;
  }, [articles]);

  return (
    <div>
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        {[ALL, ...articleCategories].map((cat) => {
          const active = category === cat;
          return (
            <button
              key={cat}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-sm border px-3 py-1.5 text-sm transition-colors",
                active ? "border-ink-text bg-ink-text text-paper" : "border-line-dark-strong text-ink-text-muted hover:text-ink-text",
              )}
            >
              {cat}
              <span className={cn("ml-2 font-mono text-xs", active ? "text-paper/70" : "text-ink-text-muted")}>{counts[cat] ?? 0}</span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "article" : "articles"} shown
      </p>

      {filtered.length === 0 ? (
        <div className="mt-12 flex flex-col items-start gap-4 rounded-md border border-dashed border-line-dark-strong p-10">
          <FileText aria-hidden="true" className="size-6 text-mint-deep" />
          <p className="text-h3 font-semibold">Nothing in {category} yet.</p>
          <p className="max-w-md text-ink-text-muted">We publish when we have something useful to say. Check the other categories, or come back soon.</p>
          <button type="button" onClick={() => setCategory(ALL)} className="text-sm font-medium underline underline-offset-4">
            Show all articles
          </button>
        </div>
      ) : (
        <m.ul layout className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((a) => (
              <m.li
                key={a.slug}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                transition={{ duration: 0.3 }}
                className="flex"
              >
                <ArticleCard article={a} className="w-full" />
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>
      )}
    </div>
  );
}
