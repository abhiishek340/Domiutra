/**
 * Operating lifecycle as a closed loop. Pure SVG + CSS (server component):
 * a single marker orbits slowly to suggest continuity; it stops under
 * reduced motion. Coverage is deliberately not labeled "24/7": it's designed
 * per customer.
 */
export function LifecycleLoop({ steps }: { steps: string[] }) {
  const cx = 200;
  const cy = 200;
  const r = 150;
  const points = steps.map((label, i) => {
    const angle = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
    return { label, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  return (
    <figure>
      <svg viewBox="0 0 400 400" className="mx-auto h-auto w-full max-w-[440px]" fill="none" aria-hidden="true">
        <circle cx={cx} cy={cy} r={r} stroke="rgb(255 255 255 / 0.12)" />
        <circle cx={cx} cy={cy} r={r} stroke="#7af0c3" strokeOpacity="0.5" strokeDasharray="2 10" />
        <circle cx={cx} cy={cy} r={r - 46} stroke="rgb(255 255 255 / 0.06)" />
        {/* Orbiting marker */}
        <g data-loop="" className="origin-center animate-[spin_24s_linear_infinite]" style={{ transformOrigin: "200px 200px" }}>
          <circle cx={cx} cy={cy - r} r="5" fill="#7af0c3" />
          <circle cx={cx} cy={cy - r} r="11" stroke="#7af0c3" strokeOpacity="0.35" />
        </g>
        {points.map((p, i) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r="30" fill="#0c1016" stroke="rgb(255 255 255 / 0.2)" />
            <text x={p.x} y={p.y - 3} textAnchor="middle" className="fill-mint font-mono text-[8px]">
              {String(i + 1).padStart(2, "0")}
            </text>
            <text x={p.x} y={p.y + 10} textAnchor="middle" className="fill-fg text-[10px] font-medium">
              {p.label}
            </text>
          </g>
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" className="fill-fg-subtle font-mono text-[9px] tracking-[0.14em]">
          OPERATING
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" className="fill-fg-subtle font-mono text-[9px] tracking-[0.14em]">
          LIFECYCLE
        </text>
      </svg>
      <figcaption className="sr-only">Operating lifecycle: {steps.join(", then ")}, and back to the start.</figcaption>
      <ol className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3" aria-label="Lifecycle steps">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-2 text-sm text-fg-muted">
            <span className="font-mono text-xs text-mint">{String(i + 1).padStart(2, "0")}</span>
            {s}
          </li>
        ))}
      </ol>
    </figure>
  );
}
