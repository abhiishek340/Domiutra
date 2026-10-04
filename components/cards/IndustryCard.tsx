import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Industry } from "@/lib/data/types";
import { Icon } from "@/components/ui/Icon";
import { IndustryArt } from "@/components/diagrams/IndustryArt";
import { cn } from "@/lib/utils/cn";

export function IndustryCard({
  industry,
  size = "md",
  className,
}: {
  industry: Industry;
  size?: "lg" | "md";
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-md border border-line-dark bg-white transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-[3px] hover:border-line-dark-strong hover:shadow-[0_24px_48px_-28px_rgb(16_20_23/0.35)] has-[a:focus-visible]:border-mint-deep",
        className,
      )}
    >
      <div
        className={cn(
          "relative flex items-center justify-center border-b border-line-dark bg-paper-2 px-6 text-ink-text/70 transition-colors duration-500 group-hover:text-mint-deep",
          size === "lg" ? "min-h-56 flex-1 py-10 md:min-h-72" : "py-7",
        )}
      >
        <IndustryArt slug={industry.slug} className={cn("w-auto max-w-full", size === "lg" ? "h-40 md:h-52" : "h-24")} />
      </div>
      <div className={cn("flex flex-col p-6 md:p-7", size === "md" && "flex-1")}>
        <div className="flex items-center gap-3">
          <Icon name={industry.icon} className="size-5 text-mint-deep" />
          <h3 className={cn("font-semibold tracking-tight", size === "lg" ? "text-h3" : "text-lg")}>
            <Link href={`/industries/${industry.slug}`} className="outline-none after:absolute after:inset-0 after:content-['']">
              {industry.name}
            </Link>
          </h3>
        </div>
        <p className={cn("mt-3 leading-relaxed text-ink-text-muted", size === "lg" ? "max-w-md text-[1.0625rem]" : "text-[0.95rem]")}>
          {industry.statement}
        </p>
        <span className="mt-auto flex items-center gap-1.5 pt-6 text-sm font-medium text-ink-text">
          Explore
          <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
