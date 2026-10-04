import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/lib/data/types";
import { formatDate } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";

export function ArticleCard({
  article,
  tone = "light",
  featured = false,
  className,
}: {
  article: Article;
  tone?: "light" | "dark";
  featured?: boolean;
  className?: string;
}) {
  const light = tone === "light";
  return (
    <article
      className={cn(
        "group relative flex flex-col border-t pt-6 transition-colors",
        light ? "border-line-dark-strong" : "border-line-strong",
        className,
      )}
    >
      <div className={cn("flex items-center gap-3 text-xs", light ? "text-ink-text-muted" : "text-fg-subtle")}>
        <span className={cn("label-mono", light ? "text-mint-deep" : "text-mint")}>{article.category}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
      </div>
      <h3
        className={cn(
          "mt-4 font-semibold tracking-tight transition-colors",
          featured ? "text-h3 md:text-[2rem] md:leading-[1.1]" : "text-xl leading-snug",
        )}
      >
        <Link
          href={`/insights/${article.slug}`}
          className={cn(
            "outline-none after:absolute after:inset-0 after:content-[''] decoration-1 underline-offset-4 group-hover:underline",
            light ? "decoration-mint-deep" : "decoration-mint",
          )}
        >
          {article.title}
        </Link>
      </h3>
      <p className={cn("mt-3 leading-relaxed", light ? "text-ink-text-muted" : "text-fg-muted", featured ? "text-[1.0625rem]" : "text-[0.95rem]")}>
        {article.excerpt}
      </p>
      <p className={cn("mt-auto flex items-center gap-1.5 pt-6 text-sm", light ? "text-ink-text" : "text-fg")}>
        {article.readingTime}
        <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </p>
    </article>
  );
}
