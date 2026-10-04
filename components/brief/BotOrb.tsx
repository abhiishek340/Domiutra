import { cn } from "@/lib/utils/cn";

/**
 * The assistant's avatar: a glowing orb with a rotating aurora core.
 * "thinking" speeds the rotation and adds a pulsing halo. CSS-only;
 * motion stops under prefers-reduced-motion.
 */
export function BotOrb({ size = 36, thinking = false, className }: { size?: number; thinking?: boolean; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("bot-orb relative inline-flex shrink-0 items-center justify-center", thinking && "is-thinking", className)}
      style={{ width: size, height: size }}
    >
      <span data-loop="" className="bot-orb-halo absolute inset-0 rounded-full" />
      <span className="absolute inset-0 overflow-hidden rounded-full bg-ink-900 ring-1 ring-mint/40">
        <span data-loop="" className="bot-orb-core absolute -inset-1/2" />
      </span>
      <span className="absolute inset-[30%] rounded-full bg-white/85 blur-[3px]" />
    </span>
  );
}
