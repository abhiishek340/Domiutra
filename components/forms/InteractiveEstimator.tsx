"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, m } from "motion/react";
import { Info } from "lucide-react";
import {
  DURATION_MAX,
  DURATION_MIN,
  TEAM_MAX,
  TEAM_MIN,
  defaultEstimatorInput,
  deliveryModels,
  engineeringTypes,
  estimateDelivery,
  involvementLevels,
  type EstimatorInput,
  type Role,
} from "@/lib/estimator/model";
import { AnimatedNumber } from "@/components/animations/AnimatedNumber";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

function Segmented<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
}: {
  legend: string;
  name: string;
  value: T;
  options: Record<T, string>;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="label-mono text-fg-subtle">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {(Object.keys(options) as T[]).map((key) => {
          const id = `${name}-${key}`;
          const checked = value === key;
          return (
            <div key={key}>
              <input
                type="radio"
                id={id}
                name={name}
                value={key}
                checked={checked}
                onChange={() => onChange(key)}
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                className={cn(
                  "inline-flex cursor-pointer select-none items-center rounded-sm border px-3 py-2 text-sm transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-mint",
                  checked ? "border-mint bg-mint/10 text-fg" : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
                )}
              >
                {options[key]}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

function Range({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="label-mono text-fg-subtle">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-sm text-fg">
          {value} {suffix}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-4 h-1.5 w-full cursor-pointer appearance-none rounded-full accent-mint"
        style={{ background: `linear-gradient(to right, var(--color-mint) ${pct}%, rgb(255 255 255 / 0.12) ${pct}%)` }}
      />
      <div className="mt-2 flex justify-between font-mono text-[0.65rem] text-fg-subtle" aria-hidden="true">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

const locationStyle: Record<Role["location"], string> = {
  "U.S.": "bg-mint",
  Global: "bg-sky",
  Blended: "bg-fg-muted",
};

function RoleRow({ role }: { role: Role }) {
  return (
    <m.li
      layout="position"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      transition={{ duration: 0.25 }}
      className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 py-3 sm:grid-cols-[1fr_auto_6.5rem]"
    >
      <div>
        <p className="text-[0.95rem]">{role.title}</p>
        <p className="text-xs text-fg-subtle">{role.allocation}</p>
      </div>
      <div className="flex max-w-[10rem] flex-wrap justify-end gap-1" aria-hidden="true">
        {Array.from({ length: Math.min(role.count, 16) }).map((_, i) => (
          <m.span
            key={i}
            layout
            className={cn("size-2.5 rounded-[2px]", locationStyle[role.location], role.allocation === "Part-time" && "opacity-50")}
          />
        ))}
      </div>
      <p className="col-span-2 text-right font-mono text-xs text-fg-muted sm:col-span-1">
        <span className="text-fg">{role.count}</span> × {role.location}
      </p>
    </m.li>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-line pt-5">
      <h3 className="label-mono text-fg-subtle">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function InteractiveEstimator() {
  const [input, setInput] = useState<EstimatorInput>(defaultEstimatorInput);
  const result = useMemo(() => estimateDelivery(input), [input]);
  const set = <K extends keyof EstimatorInput>(key: K, value: EstimatorInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));
  const switchId = useId();

  return (
    <div className="grid overflow-hidden rounded-lg border border-line lg:grid-cols-12" data-testid="estimator">
      {/* Inputs */}
      <form
        className="space-y-8 border-b border-line bg-ink-900 p-6 md:p-8 lg:col-span-5 lg:border-b-0 lg:border-r"
        onSubmit={(e) => e.preventDefault()}
        aria-label="Delivery model inputs"
      >
        <Range label="Delivery team size" value={input.teamSize} min={TEAM_MIN} max={TEAM_MAX} suffix="people" onChange={(v) => set("teamSize", v)} />
        <Segmented legend="Type of work" name="engineeringType" value={input.engineeringType} options={engineeringTypes} onChange={(v) => set("engineeringType", v)} />
        <Segmented legend="U.S. involvement" name="usInvolvement" value={input.usInvolvement} options={involvementLevels} onChange={(v) => set("usInvolvement", v)} />
        <Segmented legend="Delivery model" name="deliveryModel" value={input.deliveryModel} options={deliveryModels} onChange={(v) => set("deliveryModel", v)} />
        <Range label="Expected duration" value={input.durationMonths} min={DURATION_MIN} max={DURATION_MAX} suffix="months" onChange={(v) => set("durationMonths", v)} />

        <div className="flex items-center justify-between gap-4">
          <label htmlFor={switchId} className="label-mono text-fg-subtle">
            Ongoing support needed?
          </label>
          <button
            id={switchId}
            type="button"
            role="switch"
            aria-checked={input.ongoingSupport || input.deliveryModel === "managed"}
            disabled={input.deliveryModel === "managed"}
            onClick={() => set("ongoingSupport", !input.ongoingSupport)}
            className={cn(
              "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors disabled:opacity-60",
              input.ongoingSupport || input.deliveryModel === "managed" ? "border-mint bg-mint/20" : "border-line-strong bg-white/5",
            )}
          >
            <m.span
              layout
              transition={{ type: "spring", stiffness: 600, damping: 35 }}
              className={cn(
                "size-5 rounded-full",
                input.ongoingSupport || input.deliveryModel === "managed" ? "ml-auto mr-1 bg-mint" : "ml-1 bg-fg-muted",
              )}
            />
            <span className="sr-only">{input.ongoingSupport ? "Yes" : "No"}</span>
          </button>
        </div>
        {input.deliveryModel === "managed" && (
          <p className="-mt-5 text-xs text-fg-subtle">Included in a managed service.</p>
        )}
      </form>

      {/* Output */}
      <div className="bg-ink-950 p-6 md:p-8 lg:col-span-7" aria-live="polite" aria-atomic="false">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label-mono text-fg-subtle">Illustrative team</p>
            <p className="mt-2 text-h3 font-semibold" data-testid="estimator-total">
              <AnimatedNumber value={result.totalPeople} /> people
            </p>
          </div>
          <ul className="flex gap-4 text-xs text-fg-muted" aria-label="Legend">
            {(["U.S.", "Global", "Blended"] as const).map((l) => (
              <li key={l} className="flex items-center gap-1.5">
                <span aria-hidden="true" className={cn("size-2.5 rounded-[2px]", locationStyle[l])} />
                {l}
              </li>
            ))}
          </ul>
        </div>

        <LayoutGroup>
          <div className="mt-6 grid gap-6">
            <Panel title="U.S. leadership">
              <ul className="divide-y divide-line">
                <AnimatePresence initial={false}>
                  {result.leadership.map((r) => (
                    <RoleRow key={r.id} role={r} />
                  ))}
                </AnimatePresence>
              </ul>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">{result.usLeadershipSummary}</p>
            </Panel>

            <Panel title="Delivery team">
              <ul className="divide-y divide-line" data-testid="estimator-roles">
                <AnimatePresence initial={false}>
                  {result.delivery.map((r) => (
                    <RoleRow key={r.id} role={r} />
                  ))}
                </AnimatePresence>
              </ul>
            </Panel>

            <div className="grid gap-6 md:grid-cols-2">
              <Panel title="Delivery structure">
                <ol className="space-y-3">
                  {result.phases.map((p, i) => (
                    <li key={p.name} className="grid grid-cols-[1.5rem_1fr] text-sm">
                      <span className="font-mono text-xs text-mint">{i + 1}</span>
                      <span>
                        <span className="font-medium text-fg">{p.name}.</span>{" "}
                        <span className="text-fg-muted">{p.detail}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </Panel>
              <Panel title="Rhythm & overlap">
                <ul className="space-y-2 text-sm text-fg-muted">
                  {result.cadence.map((c) => (
                    <li key={c} className="flex gap-2">
                      <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-mint" />
                      {c}
                    </li>
                  ))}
                  <li className="flex gap-2">
                    <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-sky" />
                    {result.overlap}
                  </li>
                </ul>
              </Panel>
            </div>
          </div>
        </LayoutGroup>

        <div className="mt-8 flex flex-col gap-4 rounded-md border border-line bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex gap-2 text-xs leading-relaxed text-fg-muted">
            <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-sky" />
            <span>
              <strong className="font-medium text-fg">Illustrative planning tool.</strong> Actual team design and pricing depend on scope, skills, security requirements, and delivery model.
            </span>
          </p>
          <ButtonLink href="/contact" size="md" arrow className="shrink-0">
            Discuss this shape
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
