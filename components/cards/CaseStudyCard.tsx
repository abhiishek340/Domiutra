import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "@/lib/data/types";
import { getService } from "@/lib/data/services";
import { cn } from "@/lib/utils/cn";

/** Visible label that distinguishes illustrative work from client work. */
export function CaseStudyKindBadge({ kind, className }: { kind: CaseStudy["kind"]; className?: string }) {
  return (
    <span
      className={cn(
        "label-mono inline-flex items-center gap-1.5 rounded-xs border px-2 py-1",
        kind === "representative" ? "border-sky/40 text-sky" : "border-mint/40 text-mint",
        className,
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", kind === "representative" ? "bg-sky" : "bg-mint")} />
      {kind === "representative" ? "Representative engagement" : "Client case study"}
    </span>
  );
}

export function CaseStudyCard({ study, className }: { study: CaseStudy; className?: string }) {
  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-md border border-line bg-ink-900 p-6 transition-[transform,border-color] duration-300 hover:-translate-y-[3px] hover:border-line-strong has-[a:focus-visible]:border-mint/60 md:p-8",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CaseStudyKindBadge kind={study.kind} />
        <span className="label-mono text-fg-subtle">{study.industry}</span>
      </div>

      <h3 className="mt-8 text-h3 font-semibold">
        <Link href={`/work/${study.slug}`} className="outline-none after:absolute after:inset-0 after:content-['']">
          {study.title}
        </Link>
      </h3>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-fg-muted">{study.summary}</p>

      {/* Compact architecture trace */}
      <ol className="mt-8 flex flex-wrap items-center gap-x-1.5 gap-y-2" aria-label="Architecture outline">
        {study.architecture.map((step, i) => (
          <li key={step} className="flex items-center gap-1.5">
            <span className="rounded-xs bg-white/[0.05] px-2 py-1 font-mono text-[0.65rem] text-fg-muted">{step}</span>
            {i < study.architecture.length - 1 && (
              <span aria-hidden="true" className="text-fg-subtle">
                →
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-auto pt-8">
      <div className="flex items-end justify-between gap-4 border-t border-line pt-5">
        <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-fg-subtle" aria-label="Services">
          {study.services.map((slug) => (
            <li key={slug}>{getService(slug)?.shortTitle ?? slug}</li>
          ))}
        </ul>
        <ArrowUpRight aria-hidden="true" className="size-5 shrink-0 text-fg-subtle transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-mint" />
      </div>
      </div>
    </article>
  );
}
