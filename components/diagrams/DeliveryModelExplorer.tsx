"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, m } from "motion/react";
import { cn } from "@/lib/utils/cn";

type Level = 1 | 2 | 3 | 4;
const levelLabel: Record<Level, string> = { 1: "Light", 2: "Moderate", 3: "Significant", 4: "Full" };

type Model = {
  id: string;
  name: string;
  summary: string;
  duration: { label: string; shape: "bounded" | "ongoing" | "service" };
  team: { role: string; where: "U.S." | "Global" | "Blended" }[];
  customer: { level: Level; note: string };
  domiutra: { level: Level; note: string };
};

const models: Model[] = [
  {
    id: "project",
    name: "Project",
    summary: "A defined outcome, delivered against milestones. We own the plan and the result.",
    duration: { label: "Bounded by milestones, with a clean handover or a move to managed services.", shape: "bounded" },
    team: [
      { role: "Engagement lead", where: "U.S." },
      { role: "Solution architect", where: "Blended" },
      { role: "Delivery manager", where: "Blended" },
      { role: "Engineers", where: "Global" },
      { role: "QA engineer", where: "Global" },
      { role: "DevOps", where: "Global" },
    ],
    customer: { level: 2, note: "Product owner for decisions, reviews, and acceptance." },
    domiutra: { level: 4, note: "Plan, architecture, delivery, quality, and handover." },
  },
  {
    id: "team",
    name: "Dedicated Team",
    summary: "A stable, cross-functional team on your roadmap, with continuity and context that compound.",
    duration: { label: "Ongoing, with team shape reviewed every quarter.", shape: "ongoing" },
    team: [
      { role: "Engagement lead", where: "U.S." },
      { role: "Team lead", where: "Blended" },
      { role: "Engineers", where: "Global" },
      { role: "QA engineer", where: "Global" },
      { role: "DevOps (shared)", where: "Global" },
    ],
    customer: { level: 3, note: "Product direction and backlog priorities." },
    domiutra: { level: 3, note: "Team performance, engineering quality, and continuity." },
  },
  {
    id: "managed",
    name: "Managed Service",
    summary: "Ongoing operational ownership of a system, measured by agreed service levels.",
    duration: { label: "Ongoing under a service agreement, with monthly service reviews.", shape: "service" },
    team: [
      { role: "Service owner", where: "U.S." },
      { role: "Support engineers", where: "Global" },
      { role: "Cloud / SRE", where: "Global" },
      { role: "Escalation engineering", where: "Blended" },
    ],
    customer: { level: 1, note: "Priorities, approvals, and service reviews." },
    domiutra: { level: 4, note: "Monitoring, incidents, maintenance, and reporting." },
  },
];

function Meter({ level, label }: { level: Level; label: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-fg-muted">{label}</span>
        <span className="font-mono text-xs text-fg">{levelLabel[level]}</span>
      </div>
      <div className="mt-2 grid grid-cols-4 gap-1" role="img" aria-label={`${label}: ${levelLabel[level]}, ${level} of 4`}>
        {[1, 2, 3, 4].map((n) => (
          <m.span
            key={n}
            className="h-1.5 rounded-full"
            initial={false}
            animate={{ backgroundColor: n <= level ? "#7af0c3" : "rgba(255,255,255,0.1)" }}
            transition={{ duration: 0.3, delay: n * 0.04 }}
          />
        ))}
      </div>
    </div>
  );
}

function Timeline({ shape }: { shape: Model["duration"]["shape"] }) {
  const ticks = shape === "bounded" ? [0, 33, 66, 100] : shape === "ongoing" ? [0, 25, 50, 75] : [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5];
  return (
    <div className="relative h-10" aria-hidden="true">
      <div className={cn("absolute left-0 top-1/2 h-px bg-line-strong", shape === "bounded" ? "right-24" : "right-0")} />
      <m.div
        key={shape}
        className={cn("absolute left-0 top-1/2 h-0.5 -translate-y-1/2 origin-left", shape === "bounded" ? "bg-mint" : "bg-gradient-to-r from-mint via-mint to-transparent")}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: shape === "bounded" ? "70%" : "100%" }}
      />
      {ticks.map((t) => (
        <m.span
          key={`${shape}-${t}`}
          className={cn("absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-mint bg-ink-950", shape === "bounded" && t === 100 && "hidden")}
          style={{ left: `${shape === "bounded" ? t * 0.7 : t}%` }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 + t / 300 }}
        />
      ))}
      {shape === "bounded" && (
        <span className="label-mono absolute right-0 top-1/2 -translate-y-1/2 text-fg-subtle">Handover</span>
      )}
    </div>
  );
}

/** Accessible tabbed explorer comparing the three primary engagement shapes. */
export function DeliveryModelExplorer() {
  const [index, setIndex] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const model = models[index] ?? models[0]!;

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, number> = {
      ArrowRight: (index + 1) % models.length,
      ArrowLeft: (index - 1 + models.length) % models.length,
      Home: 0,
      End: models.length - 1,
    };
    const next = map[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setIndex(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="rounded-lg border border-line bg-ink-900">
      <div
        role="tablist"
        aria-label="Engagement model"
        onKeyDown={onKeyDown}
        className="flex overflow-x-auto border-b border-line p-1.5"
      >
        {models.map((mdl, i) => {
          const selected = i === index;
          return (
            <button
              key={mdl.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`${baseId}-tab-${mdl.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setIndex(i)}
              className={cn(
                "relative flex-1 whitespace-nowrap rounded-sm px-4 py-3 text-sm font-medium transition-colors",
                selected ? "text-ink-950" : "text-fg-muted hover:text-fg",
              )}
            >
              {selected && (
                <m.span
                  layoutId={`${baseId}-pill`}
                  className="absolute inset-0 rounded-sm bg-mint"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              <span className="relative">{mdl.name}</span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${model.id}`}
        tabIndex={0}
        className="p-6 md:p-10"
      >
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={model.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid gap-10 lg:grid-cols-12"
          >
            <div className="lg:col-span-5">
              <p className="text-xl font-semibold leading-snug tracking-tight md:text-2xl">{model.summary}</p>
              <div className="mt-8">
                <p className="label-mono text-fg-subtle">Engagement duration</p>
                <div className="mt-3">
                  <Timeline shape={model.duration.shape} />
                </div>
                <p className="mt-2 text-sm text-fg-muted">{model.duration.label}</p>
              </div>
              <div className="mt-8 space-y-5">
                <div>
                  <Meter level={model.customer.level} label="Your team's involvement" />
                  <p className="mt-2 text-xs text-fg-subtle">{model.customer.note}</p>
                </div>
                <div>
                  <Meter level={model.domiutra.level} label="Domiutra responsibility" />
                  <p className="mt-2 text-xs text-fg-subtle">{model.domiutra.note}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <p className="label-mono text-fg-subtle">Typical team composition</p>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {model.team.map((t, i) => (
                  <m.li
                    key={t.role}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                    className="flex items-center justify-between gap-4 py-3.5"
                  >
                    <span className="flex items-center gap-3 text-[0.95rem]">
                      <span className="font-mono text-xs text-fg-subtle">0{i + 1}</span>
                      {t.role}
                    </span>
                    <span
                      className={cn(
                        "label-mono rounded-xs border px-2 py-1",
                        t.where === "U.S." && "border-mint/40 text-mint",
                        t.where === "Global" && "border-sky/40 text-sky",
                        t.where === "Blended" && "border-line-strong text-fg-muted",
                      )}
                    >
                      {t.where}
                    </span>
                  </m.li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-fg-subtle">
                Illustrative. Actual team shape depends on scope, skills, time-zone needs, and security requirements.
              </p>
            </div>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
