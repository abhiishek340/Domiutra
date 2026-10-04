import type { DiagramKey } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

/**
 * Small line diagrams that give each service card its own technical
 * character. They respond to the parent card's hover (`group`) with CSS only.
 */
// Static class list so Tailwind can see every class at build time.
const layerLift = ["", "group-hover:-translate-y-0.5", "group-hover:-translate-y-1", "group-hover:-translate-y-2"];

export function ServiceGlyph({ kind, className }: { kind: DiagramKey; className?: string }) {
  const stroke = "stroke-white/20 transition-[stroke] duration-500 group-hover:stroke-mint/70";
  const fillAccent = "fill-white/15 transition-[fill] duration-500 group-hover:fill-mint";
  const shift = "transition-transform duration-500 ease-out";

  return (
    <svg viewBox="0 0 240 120" fill="none" aria-hidden="true" className={className ?? "h-auto w-full"}>
      {kind === "engineering" && (
        // Branching commit graph merging back to main.
        <g strokeWidth="1.2">
          <path d="M10 80 H230" className={stroke} />
          <path d="M60 80 C80 80 80 40 100 40 H160 C180 40 180 80 200 80" className={stroke} />
          {[30, 60, 130, 200].map((x) => (
            <circle key={x} cx={x} cy="80" r="4" className={fillAccent} />
          ))}
          {[100, 130, 160].map((x) => (
            <circle key={x} cx={x} cy="40" r="4" className={cn(fillAccent, shift, "group-hover:-translate-y-1")} />
          ))}
        </g>
      )}
      {kind === "modernization" && (
        // Monolith decomposing into modules.
        <g strokeWidth="1.2">
          <rect x="14" y="24" width="64" height="72" rx="3" className={stroke} />
          <path d="M14 48 H78 M14 72 H78" className={stroke} strokeDasharray="3 4" />
          <path d="M84 60 H124" className={stroke} />
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={140}
              y={20 + i * 30}
              width="40"
              height="22"
              rx="3"
              className={cn(stroke, shift, i === 0 && "group-hover:translate-x-2", i === 2 && "group-hover:-translate-x-1")}
            />
          ))}
          {[0, 1].map((i) => (
            <rect key={i} x={194} y={34 + i * 30} width="32" height="22" rx="3" className={cn(stroke, shift, "group-hover:translate-x-1")} />
          ))}
          <circle cx="124" cy="60" r="3.5" className={fillAccent} />
        </g>
      )}
      {kind === "cloud" && (
        // Stacked infrastructure layers.
        <g strokeWidth="1.2">
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M40 ${86 - i * 18} L120 ${102 - i * 18} L200 ${86 - i * 18} L120 ${70 - i * 18} Z`}
              className={cn(stroke, shift, layerLift[i])}
            />
          ))}
          <circle cx="120" cy="16" r="3.5" className={fillAccent} />
          <path d="M120 20 V34" className={stroke} strokeDasharray="2 3" />
        </g>
      )}
      {kind === "ai" && (
        // Small graph with a highlighted path.
        <g strokeWidth="1.2">
          <path d="M20 60 L70 30 L130 50 L180 24 L222 60 M70 30 L90 92 L130 50 L170 94 L222 60 M20 60 L90 92" className={stroke} />
          {[
            [20, 60],
            [70, 30],
            [130, 50],
            [180, 24],
            [222, 60],
            [90, 92],
            [170, 94],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="4" className={fillAccent} />
          ))}
          <circle cx="130" cy="50" r="10" className={cn(stroke)} strokeDasharray="2 3" />
        </g>
      )}
      {kind === "operations" && (
        // Heartbeat line inside an operating loop.
        <g strokeWidth="1.2">
          <rect x="10" y="20" width="220" height="80" rx="40" className={stroke} strokeDasharray="3 5" />
          <path d="M30 60 H86 L96 36 L110 84 L122 48 L130 60 H210" className={stroke} strokeWidth="1.6" />
          <circle cx="210" cy="60" r="4" className={fillAccent} />
        </g>
      )}
      {kind === "quality" && (
        // Test matrix with passing checks.
        <g strokeWidth="1.2">
          {Array.from({ length: 4 }).map((_, r) =>
            Array.from({ length: 8 }).map((__, c) => (
              <rect
                key={`${r}-${c}`}
                x={14 + c * 28}
                y={14 + r * 24}
                width="18"
                height="14"
                rx="2"
                className={(r + c) % 3 === 0 ? fillAccent : stroke}
              />
            )),
          )}
        </g>
      )}
    </svg>
  );
}
