import type { Brief } from "./schema";
import { getService } from "@/lib/data/services";

export const ENGAGEMENT_LABELS: Record<Brief["engagement"]["model"], string> = {
  project: "Project delivery",
  dedicated: "Dedicated team",
  managed: "Managed service",
};

/** Session-storage key used to hand a brief to the contact form. */
export const BRIEF_HANDOFF_KEY = "domiutra:brief";

/** Plain-text version of a brief for copying and for the contact form. */
export function briefToText(brief: Brief, prompt: string): string {
  const services = brief.services.map((s) => `- ${getService(s.slug)?.title ?? s.slug}: ${s.reason}`).join("\n");
  const phases = brief.phases.map((p, i) => `${i + 1}. ${p.name}: ${p.detail}`).join("\n");
  return [
    `Project brief: ${brief.title}`,
    "",
    `What I described: ${prompt}`,
    "",
    `Summary: ${brief.summary}`,
    "",
    "Suggested services:",
    services,
    "",
    `Engagement: ${ENGAGEMENT_LABELS[brief.engagement.model]} (${brief.engagement.reason})`,
    `Team shape: about ${brief.team.teamSize} people for ~${brief.team.durationMonths} months`,
    "",
    "Plan:",
    phases,
    "",
    "Risks:",
    ...brief.risks.map((r) => `- ${r}`),
    "",
    "Open questions:",
    ...brief.questions.map((q) => `- ${q}`),
    "",
    "(AI-generated draft from the Domiutra brief assistant)",
  ].join("\n");
}
