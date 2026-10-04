import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/data/types";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

/**
 * Compact service card. Inside a SpotlightGroup, a cursor-following glow
 * lights the card surface and border (driven by --x/--y CSS variables).
 */
export function ServiceCard({ service, className }: { service: Service; className?: string }) {
  return (
    <article
      data-spotlight=""
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-md border border-line bg-ink-900 p-6 transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-mint/30 has-[a:focus-visible]:border-mint/60 md:p-7",
        "before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 before:bg-[radial-gradient(360px_circle_at_var(--x,50%)_var(--y,50%),rgb(122_240_195/0.14),transparent_60%)] group-hover/spot:before:opacity-100",
        className,
      )}
    >
      <div className="relative flex items-center justify-between">
        <span className="flex size-11 items-center justify-center rounded-sm border border-line text-fg-muted transition-all duration-300 group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:border-mint/50 group-hover:text-mint">
          <Icon name={service.icon} className="size-5" />
        </span>
        <span className="font-mono text-xs text-fg-subtle">{service.number}</span>
      </div>
      <h3 className="relative mt-10 text-xl font-semibold tracking-tight">
        <Link href={`/services/${service.slug}`} className="outline-none after:absolute after:inset-0 after:content-['']">
          {service.title}
        </Link>
      </h3>
      <p className="relative mt-2 text-[0.95rem] leading-relaxed text-fg-muted">{service.summary}</p>
      <div className="relative mt-auto pt-6">
        <ArrowUpRight
          aria-hidden="true"
          className="size-5 text-fg-subtle transition-[transform,color] duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-mint"
        />
      </div>
    </article>
  );
}
