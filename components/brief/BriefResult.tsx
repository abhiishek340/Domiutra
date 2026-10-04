"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { m, type Variants } from "motion/react";
import { ArrowUpRight, CircleHelp, TriangleAlert } from "lucide-react";
import type { Brief } from "@/lib/brief/schema";
import { ENGAGEMENT_LABELS } from "@/lib/brief/format";
import { getService } from "@/lib/data/services";
import { engagementModels } from "@/lib/data/engagement-models";
import { estimateDelivery, type Role } from "@/lib/estimator/model";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

const EASE = [0.22, 1, 0.36, 1] as const;
const list: Variants = { show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: EASE } },
};

const MODEL_SLUG: Record<Brief["engagement"]["model"], string> = {
  project: "project-delivery",
  dedicated: "dedicated-team",
  managed: "managed-services",
};

const dotColor: Record<Role["location"], string> = { "U.S.": "bg-mint", Global: "bg-sky", Blended: "bg-fg-muted" };

function Block({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <m.section variants={item} className={cn("rounded-md border border-line bg-ink-950/60 p-5", className)}>
      <h3 className="label-mono text-fg-subtle">{label}</h3>
      <div className="mt-3">{children}</div>
    </m.section>
  );
}

/** The generated brief, revealed section by section. */
export function BriefResult({ brief }: { brief: Brief }) {
  const team = estimateDelivery({
    teamSize: brief.team.teamSize,
    engineeringType: brief.team.workType,
    usInvolvement: brief.team.usInvolvement,
    deliveryModel: brief.engagement.model,
    durationMonths: brief.team.durationMonths,
    ongoingSupport: brief.team.ongoingSupport,
  });
  const roles = [...team.leadership, ...team.delivery];
  const model = engagementModels.find((m) => m.slug === MODEL_SLUG[brief.engagement.model]);

  return (
    <m.div initial="hidden" animate="show" variants={list} className="grid gap-3 text-fg" data-testid="brief-result">
      <m.header variants={item} className="pb-1">
        <p className="label-mono text-mint">Project brief</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{brief.title}</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-fg-muted">{brief.summary}</p>
      </m.header>

      <Block label="Recommended services">
        <ul className="grid gap-2 md:grid-cols-3">
          {brief.services.map((s) => {
            const svc = getService(s.slug);
            if (!svc) return null;
            return (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex h-full flex-col rounded-sm border border-line bg-ink-900 p-4 transition-colors hover:border-mint/40"
                >
                  <span className="flex items-center justify-between">
                    <Icon name={svc.icon} className="size-5 text-mint" />
                    <ArrowUpRight aria-hidden="true" className="size-4 text-fg-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-mint" />
                  </span>
                  <span className="mt-3 font-semibold">{svc.title}</span>
                  <span className="mt-1 text-sm leading-relaxed text-fg-muted">{s.reason}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Block>

      <div className="grid gap-3 md:grid-cols-2">
        <Block label="Engagement model">
          <p className="text-lg font-semibold">{ENGAGEMENT_LABELS[brief.engagement.model]}</p>
          <p className="mt-1 text-sm leading-relaxed text-fg-muted">{brief.engagement.reason}</p>
          {model && (
            <dl className="mt-4 grid gap-4 border-t border-line pt-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="label-mono text-fg-subtle">You own</dt>
                <dd className="mt-2 space-y-1.5 text-fg-muted">
                  {model.customerResponsibilities.slice(0, 2).map((r) => (
                    <p key={r}>{r}</p>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="label-mono text-mint">We own</dt>
                <dd className="mt-2 space-y-1.5 text-fg-muted">
                  {model.domiutraResponsibilities.slice(0, 2).map((r) => (
                    <p key={r}>{r}</p>
                  ))}
                </dd>
              </div>
            </dl>
          )}
          <Link href="/engagement-models" className="mt-4 inline-flex items-center gap-1 text-sm text-fg underline decoration-line-strong underline-offset-4 hover:decoration-mint">
            Compare engagement models
          </Link>
        </Block>
        <Block label="Team shape">
          <p className="text-lg font-semibold">
            ~{team.totalPeople} people · ~{brief.team.durationMonths} months
          </p>
          <ul className="mt-3 space-y-1.5" aria-label="Roles">
            {roles.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-fg-muted">
                  {r.count} × {r.title}
                </span>
                <span className="flex gap-0.5" aria-hidden="true">
                  {Array.from({ length: Math.min(r.count, 10) }).map((_, i) => (
                    <span key={i} className={cn("size-2 rounded-[2px]", dotColor[r.location], r.allocation === "Part-time" && "opacity-50")} />
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </Block>
      </div>

      <Block label="Plan">
        <ol className="grid gap-3 md:grid-cols-4">
          {brief.phases.map((p, i) => (
            <li key={p.name} className="relative">
              <span className="font-mono text-xs text-mint">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-1 font-semibold">{p.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-fg-muted">{p.detail}</p>
            </li>
          ))}
        </ol>
      </Block>

      <div className="grid gap-3 md:grid-cols-2">
        <Block label="Risks to watch">
          <ul className="space-y-2">
            {brief.risks.map((r) => (
              <li key={r} className="flex gap-2 text-sm leading-relaxed text-fg-muted">
                <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-300" />
                {r}
              </li>
            ))}
          </ul>
        </Block>
        <Block label="Questions we'd ask you">
          <ul className="space-y-2">
            {brief.questions.map((q) => (
              <li key={q} className="flex gap-2 text-sm leading-relaxed text-fg-muted">
                <CircleHelp aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-sky" />
                {q}
              </li>
            ))}
          </ul>
        </Block>
      </div>
    </m.div>
  );
}
