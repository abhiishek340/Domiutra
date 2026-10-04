import { cn } from "@/lib/utils/cn";

/**
 * Abstract, line-based motifs per industry. No stock imagery: each one hints
 * at the domain (ledgers, pulses, assembly, networks, routes, documents).
 */
export function IndustryArt({ slug, className }: { slug: string; className?: string }) {
  const s = "stroke-current transition-all duration-700";
  return (
    <svg viewBox="0 0 320 160" fill="none" aria-hidden="true" className={className ?? "h-auto w-full"}>
      {slug === "financial-services" && (
        <g strokeWidth="1">
          {Array.from({ length: 12 }).map((_, i) => {
            const h = 20 + ((i * 37) % 90) + i * 3;
            return <rect key={i} x={14 + i * 25} y={150 - h} width="12" height={h} rx="1" className={cn(s, "group-hover:opacity-100", i % 3 === 0 ? "opacity-90" : "opacity-40")} />;
          })}
          <path d="M14 110 L64 96 L114 102 L164 70 L214 76 L264 44 L306 30" className={cn(s, "opacity-80")} strokeDasharray="4 4" />
        </g>
      )}
      {slug === "healthcare" && (
        <g strokeWidth="1">
          {Array.from({ length: 6 }).map((_, i) => (
            <path key={i} d={`M0 ${30 + i * 20} H320`} className={cn(s, "opacity-15")} />
          ))}
          <path d="M0 90 H90 L104 56 L120 128 L136 40 L150 104 L162 90 H320" className={cn(s, "opacity-90")} strokeWidth="1.6" />
          <circle cx="162" cy="90" r="5" className="fill-current" />
        </g>
      )}
      {slug === "manufacturing" && (
        <g strokeWidth="1">
          <path d="M10 120 H310" className={cn(s, "opacity-40")} />
          {Array.from({ length: 7 }).map((_, i) => (
            <rect key={i} x={20 + i * 42} y={84} width="28" height="28" rx="2" className={cn(s, i === 3 ? "opacity-100" : "opacity-40", "group-hover:translate-x-1")} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <circle key={i} cx={20 + i * 40} cy="132" r="6" className={cn(s, "opacity-50")} />
          ))}
          <path d="M160 30 V80" className={cn(s, "opacity-70")} strokeDasharray="3 3" />
          <rect x="146" y="18" width="28" height="14" rx="2" className={cn(s, "opacity-80")} />
        </g>
      )}
      {slug === "technology" && (
        <g strokeWidth="1">
          {[60, 44, 28, 12].map((r, i) => (
            <rect key={r} x={160 - r * 2} y={80 - r} width={r * 4} height={r * 2} rx="4" className={cn(s, i === 3 ? "opacity-100" : "opacity-30")} />
          ))}
          {[
            [30, 30],
            [290, 30],
            [30, 130],
            [290, 130],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <path d={`M${x} ${y} L160 80`} className={cn(s, "opacity-25")} />
              <circle cx={x} cy={y} r="4" className="fill-current opacity-70" />
            </g>
          ))}
        </g>
      )}
      {slug === "logistics" && (
        <g strokeWidth="1">
          <path d="M20 130 C80 130 70 40 140 40 S220 120 300 30" className={cn(s, "opacity-80")} strokeWidth="1.4" />
          <path d="M20 60 C90 60 120 140 200 120 S260 70 300 90" className={cn(s, "opacity-30")} strokeDasharray="4 4" />
          {[
            [20, 130],
            [140, 40],
            [222, 86],
            [300, 30],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="5" className="fill-current" />
          ))}
        </g>
      )}
      {slug === "professional-services" && (
        <g strokeWidth="1">
          {[0, 1, 2].map((i) => (
            <rect key={i} x={110 + i * 14} y={20 + i * 10} width="110" height="120" rx="3" className={cn(s, i === 2 ? "opacity-100" : "opacity-30")} />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <path key={i} d={`M152 ${68 + i * 12} H${222 - (i % 3) * 18}`} className={cn(s, "opacity-60")} />
          ))}
          <path d="M20 80 H100" className={cn(s, "opacity-40")} strokeDasharray="3 4" />
          <circle cx="20" cy="80" r="4" className="fill-current" />
        </g>
      )}
    </svg>
  );
}
