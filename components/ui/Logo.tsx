import { cn } from "@/lib/utils/cn";

/**
 * The Domiutra mark: a "D" split into a stem and an open bowl, joined by a
 * central node. Stem = accountable U.S. leadership; bowl = the delivery
 * system around it; node = the point where both meet the customer's outcome.
 * The gap between stem and bowl is the hand-off the company manages.
 */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="none"
    >
      <rect x="4" y="4" width="4.5" height="24" rx="1" fill="currentColor" />
      <path
        d="M12.5 6.25H16a9.75 9.75 0 0 1 0 19.5h-3.5"
        stroke="currentColor"
        strokeWidth="4.5"
      />
      <circle cx="16" cy="16" r="2.6" fill="var(--color-mint)" />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-7" />
      {!compact && (
        <span className="text-[0.95rem] font-semibold tracking-[0.2em]" aria-hidden="true">
          DOMIUTRA
        </span>
      )}
      <span className="sr-only">Domiutra</span>
    </span>
  );
}
