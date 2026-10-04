import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/data/types";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

/** Compact service card: icon, number, title, one line, arrow. */
export function ServiceCard({ service, className }: { service: Service; className?: string }) {
  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-md border border-line bg-ink-900 p-6 transition-[transform,border-color,background-color] duration-300 ease-out hover:-translate-y-[3px] hover:border-line-strong hover:bg-ink-850 has-[a:focus-visible]:border-mint/60 md:p-7",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="flex size-10 items-center justify-center rounded-sm border border-line text-fg-muted transition-[color,border-color] duration-300 group-hover:border-mint/40 group-hover:text-mint">
          <Icon name={service.icon} className="size-5" />
        </span>
        <span className="font-mono text-xs text-fg-subtle">{service.number}</span>
      </div>
      <h3 className="mt-8 text-xl font-semibold tracking-tight">
        <Link href={`/services/${service.slug}`} className="outline-none after:absolute after:inset-0 after:content-['']">
          {service.title}
        </Link>
      </h3>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-fg-muted">{service.summary}</p>
      <div className="mt-auto pt-6">
        <ArrowUpRight
          aria-hidden="true"
          className="size-5 text-fg-subtle transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-mint"
        />
      </div>
    </article>
  );
}
