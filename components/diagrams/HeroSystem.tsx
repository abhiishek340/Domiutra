"use client";

import { useEffect, useRef, useState } from "react";
import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils/cn";

type NodeDef = { id: string; x: number; y: number; label: string; sub: string };

// Coordinates are in SVG user units (viewBox 0 0 560 560).
const CENTER = { x: 280, y: 250 };

const nodes: NodeDef[] = [
  { id: "web", x: 280, y: 70, label: "Web & mobile", sub: "experience" },
  { id: "gateway", x: 110, y: 150, label: "API gateway", sub: "edge · auth" },
  { id: "identity", x: 450, y: 150, label: "Identity", sub: "sso · rbac" },
  { id: "ai", x: 105, y: 330, label: "AI services", sub: "models · agents" },
  { id: "services", x: 455, y: 330, label: "Domain services", sub: "orders · billing" },
  { id: "events", x: 180, y: 440, label: "Event stream", sub: "async" },
  { id: "data", x: 380, y: 440, label: "Data platform", sub: "postgres · lake" },
];

// Orthogonal connectors from the orchestration node to each system.
const connectors: Record<string, string> = {
  web: "M280 226 V90",
  gateway: "M220 238 H110 V170",
  identity: "M340 238 H450 V170",
  ai: "M220 262 H105 V310",
  services: "M340 262 H455 V310",
  events: "M262 274 V385 H180 V420",
  data: "M298 274 V385 H380 V420",
};

const peerLinks = ["M110 130 V70 H224", "M450 130 V70 H336", "M236 440 H324", "M161 330 H170", "M390 330 H399"];

const pipeline = ["commit", "build", "test", "deploy", "observe"];

/**
 * Hero visualization: a living architecture diagram with Domiutra as the
 * orchestration node. Decorative, so it's hidden from assistive tech and the
 * section's text carries the meaning.
 */
export function HeroSystem({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);

  // Pointer parallax (fine pointers only).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 60, damping: 20, mass: 0.6 });
  const backX = useTransform(sx, (v) => v * -6);
  const backY = useTransform(sy, (v) => v * -6);
  const midX = useTransform(sx, (v) => v * 4);
  const midY = useTransform(sy, (v) => v * 4);
  const frontX = useTransform(sx, (v) => v * 10);
  const frontY = useTransform(sy, (v) => v * 10);

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    const el = wrapRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      px.set(((e.clientX - r.left) / r.width - 0.5) * 2);
      py.set(((e.clientY - r.top) / r.height - 0.5) * 2);
    };
    const onLeave = () => {
      px.set(0);
      py.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, px, py]);

  // Pause SMIL + CSS loops when off-screen to save battery and main-thread time.
  useEffect(() => {
    const el = wrapRef.current;
    const svg = svgRef.current;
    if (!el || !svg) return;
    const io = new IntersectionObserver(([entry]) => {
      const isVisible = Boolean(entry?.isIntersecting);
      setVisible(isVisible);
      if (isVisible) svg.unpauseAnimations?.();
      else svg.pauseAnimations?.();
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={cn("relative select-none", !visible && "is-paused", className)}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 560 560"
        className="h-auto w-full overflow-visible"
        fill="none"
        role="presentation"
      >
        <defs>
          <radialGradient id="hs-glow" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#7af0c3" stopOpacity="0.16" />
            <stop offset="60%" stopColor="#8db4ff" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#080b10" stopOpacity="0" />
          </radialGradient>
          <pattern id="hs-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="rgb(255 255 255 / 0.12)" />
          </pattern>
          <linearGradient id="hs-node" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#151b24" />
            <stop offset="100%" stopColor="#0c1016" />
          </linearGradient>
          {Object.entries(connectors).map(([id, d]) => (
            <path key={id} id={`hs-path-${id}`} d={d} />
          ))}
        </defs>

        {/* Back layer: field + grid + cloud boundary */}
        <m.g style={{ x: backX, y: backY }}>
          <rect x="-40" y="-40" width="640" height="640" fill="url(#hs-grid)" opacity="0.6" />
          <circle cx={CENTER.x} cy={CENTER.y} r="280" fill="url(#hs-glow)" />
          <rect
            x="36"
            y="292"
            width="488"
            height="190"
            rx="10"
            stroke="rgb(141 180 255 / 0.28)"
            strokeDasharray="3 5"
          />
          <text x="512" y="472" textAnchor="end" className="fill-sky/70 font-mono text-[9px] tracking-[0.14em]">
            CLOUD RUNTIME
          </text>
        </m.g>

        {/* Mid layer: connectors and moving signals */}
        <m.g style={{ x: midX, y: midY }}>
          {peerLinks.map((d) => (
            <path
              key={d}
              d={d}
              stroke="rgb(255 255 255 / 0.14)"
              strokeDasharray="2 6"
              data-loop=""
              className="animate-dash"
            />
          ))}
          {Object.entries(connectors).map(([id, d]) => (
            <path
              key={id}
              d={d}
              stroke={active === id ? "#7af0c3" : "rgb(255 255 255 / 0.22)"}
              strokeWidth={active === id ? 1.5 : 1}
              className="transition-[stroke] duration-300"
            />
          ))}
          {!reduce &&
            Object.keys(connectors).map((id, i) => (
              <g key={id} className="hs-signal">
                <circle r="2.6" fill="#7af0c3" visibility="hidden">
                  <set attributeName="visibility" to="visible" begin={`${i * 0.45}s`} />
                  <animateMotion
                    dur={`${3.2 + (i % 3) * 0.7}s`}
                    begin={`${i * 0.45}s`}
                    repeatCount="indefinite"
                    keyPoints={i % 2 ? "1;0" : "0;1"}
                    keyTimes="0;1"
                    calcMode="linear"
                  >
                    <mpath href={`#hs-path-${id}`} />
                  </animateMotion>
                </circle>
                {i % 2 === 0 && (
                  <circle r="1.8" fill="#8db4ff" visibility="hidden">
                    <set attributeName="visibility" to="visible" begin={`${1.2 + i * 0.6}s`} />
                    <animateMotion
                      dur={`${4.6 + (i % 2)}s`}
                      begin={`${1.2 + i * 0.6}s`}
                      repeatCount="indefinite"
                      keyPoints="1;0"
                      keyTimes="0;1"
                      calcMode="linear"
                    >
                      <mpath href={`#hs-path-${id}`} />
                    </animateMotion>
                  </circle>
                )}
              </g>
            ))}
        </m.g>

        {/* Front layer: nodes */}
        <m.g style={{ x: frontX, y: frontY }}>
          {nodes.map((n) => {
            const on = active === n.id;
            return (
              <g
                key={n.id}
                transform={`translate(${n.x - 56} ${n.y - 20})`}
                onPointerEnter={() => setActive(n.id)}
                onPointerLeave={() => setActive(null)}
                className="cursor-default"
              >
                <rect
                  width="112"
                  height="40"
                  rx="6"
                  fill="url(#hs-node)"
                  stroke={on ? "#7af0c3" : "rgb(255 255 255 / 0.16)"}
                  className="transition-[stroke] duration-300"
                />
                <circle cx="12" cy="13" r="2.2" fill={on ? "#7af0c3" : "rgb(122 240 195 / 0.55)"} />
                <text x="20" y="16.5" className="fill-fg text-[10.5px] font-medium">
                  {n.label}
                </text>
                <text x="12" y="30" className="fill-fg-subtle font-mono text-[8px] tracking-[0.06em]">
                  {n.sub}
                </text>
              </g>
            );
          })}

          {/* Orchestration node */}
          <g transform={`translate(${CENTER.x - 60} ${CENTER.y - 24})`}>
            <rect
              x="-8"
              y="-8"
              width="136"
              height="64"
              rx="12"
              stroke="rgb(122 240 195 / 0.35)"
              data-loop=""
              className="animate-pulse-soft"
            />
            <rect width="120" height="48" rx="8" fill="#0c1016" stroke="#7af0c3" strokeOpacity="0.9" />
            <g transform="translate(12 12) scale(0.75)">
              <rect x="4" y="4" width="4.5" height="24" rx="1" fill="#f4f7f6" />
              <path d="M12.5 6.25H16a9.75 9.75 0 0 1 0 19.5h-3.5" stroke="#f4f7f6" strokeWidth="4.5" />
              <circle cx="16" cy="16" r="2.6" fill="#7af0c3" />
            </g>
            <text x="44" y="22" className="fill-fg text-[10px] font-semibold tracking-[0.16em]">
              DOMIUTRA
            </text>
            <text x="44" y="35" className="fill-mint font-mono text-[8px] tracking-[0.08em]">
              orchestration
            </text>
          </g>
        </m.g>

        {/* Delivery pipeline strip */}
        <g transform="translate(0 512)">
          <path d="M40 14 H520" stroke="rgb(255 255 255 / 0.12)" />
          {pipeline.map((stage, i) => {
            const x = 40 + i * 99;
            return (
              <g key={stage} transform={`translate(${x} 0)`}>
                <rect width="84" height="28" rx="14" fill="#0c1016" stroke="rgb(255 255 255 / 0.14)" />
                <rect
                  width="84"
                  height="28"
                  rx="14"
                  fill="rgb(122 240 195 / 0.1)"
                  stroke="#7af0c3"
                  data-loop=""
                  className="hs-stage"
                  style={{ animationDelay: `${i * 1.1}s` }}
                />
                <text x="42" y="17.5" textAnchor="middle" className="fill-fg-muted font-mono text-[9px] tracking-[0.1em]">
                  {stage}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
