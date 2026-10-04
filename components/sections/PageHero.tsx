import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SplitTextReveal } from "@/components/animations/SplitTextReveal";
import type { Crumb } from "@/lib/seo/jsonld";
import { cn } from "@/lib/utils/cn";

type Props = {
  eyebrow?: ReactNode;
  title: string;
  intro?: ReactNode;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
  /** Optional visual on the right (desktop) / below (mobile). */
  visual?: ReactNode;
  className?: string;
};

/**
 * Interior page hero. Typography animates with CSS so it paints immediately.
 * With a `visual`, it becomes a split layout; without, an editorial block.
 */
export function PageHero({ eyebrow, title, intro, breadcrumbs, actions, visual, className }: Props) {
  return (
    <section className={cn("relative overflow-hidden border-b border-line pt-32 pb-16 md:pt-40 md:pb-24", className)}>
      <div aria-hidden="true" className="bg-grid mask-fade-b pointer-events-none absolute inset-0 opacity-30" />
      <div className="container-site relative">
        {breadcrumbs && (
          <div className="animate-fade mb-10">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        <div className={cn("grid gap-12", Boolean(visual) && "lg:grid-cols-12 lg:items-center")}>
          <div className={visual ? "lg:col-span-7" : "max-w-5xl"}>
            {eyebrow && <div className="animate-fade label-mono mb-6 text-fg-muted">{eyebrow}</div>}
            <h1 className="text-h1 font-semibold">
              <SplitTextReveal text={title} stagger={0.02} />
            </h1>
            {intro && (
              <div className="animate-rise mt-8 max-w-2xl text-lead text-fg-muted" style={{ animationDelay: "0.12s" }}>
                {intro}
              </div>
            )}
            {actions && (
              <div className="animate-rise mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6" style={{ animationDelay: "0.18s" }}>
                {actions}
              </div>
            )}
          </div>
          {visual && (
            <div className="animate-fade lg:col-span-5" style={{ animationDelay: "0.15s" }}>
              {visual}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
