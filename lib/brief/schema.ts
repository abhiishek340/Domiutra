import { z } from "zod";
import { services } from "@/lib/data/services";
import { engineeringTypes, involvementLevels } from "@/lib/estimator/model";

/**
 * The project-brief contract. Gemini must return exactly this shape; the
 * server validates it with Zod before anything reaches the browser.
 */

export const SERVICE_SLUGS = services.map((s) => s.slug) as [string, ...string[]];
export const ENGAGEMENT_MODELS = ["project", "dedicated", "managed"] as const;
const WORK_TYPES = Object.keys(engineeringTypes) as [keyof typeof engineeringTypes, ...(keyof typeof engineeringTypes)[]];
const INVOLVEMENT = Object.keys(involvementLevels) as [keyof typeof involvementLevels, ...(keyof typeof involvementLevels)[]];

export const PROMPT_MIN = 20;
export const PROMPT_MAX = 800;

export const briefRequestSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(PROMPT_MIN, `Add a little more detail: at least ${PROMPT_MIN} characters.`)
    .max(PROMPT_MAX, `Keep it under ${PROMPT_MAX} characters.`),
});

const line = (max: number) => z.string().trim().min(1).max(max);

export const briefSchema = z.object({
  relevant: z.boolean(),
  title: line(80),
  summary: line(400),
  services: z
    .array(z.object({ slug: z.enum(SERVICE_SLUGS), reason: line(240) }))
    .min(1)
    .max(3)
    .refine((list) => new Set(list.map((s) => s.slug)).size === list.length, "Duplicate service"),
  engagement: z.object({ model: z.enum(ENGAGEMENT_MODELS), reason: line(240) }),
  team: z.object({
    workType: z.enum(WORK_TYPES),
    teamSize: z.number().int().min(2).max(20),
    durationMonths: z.number().int().min(3).max(24),
    usInvolvement: z.enum(INVOLVEMENT),
    ongoingSupport: z.boolean(),
  }),
  phases: z.array(z.object({ name: line(40), detail: line(200) })).min(3).max(4),
  risks: z.array(line(200)).min(2).max(4),
  questions: z.array(line(200)).min(3).max(4),
});

export type Brief = z.infer<typeof briefSchema>;
export type BriefRequest = z.infer<typeof briefRequestSchema>;

/**
 * JSON Schema sent to Gemini as `responseJsonSchema`. Written by hand so it
 * only uses keywords Gemini supports (type, enum, items, min/maxItems,
 * minimum/maximum, properties, required, description, propertyOrdering).
 */
const str = (description: string) => ({ type: "string", description });

export const briefJsonSchema = {
  type: "object",
  properties: {
    relevant: {
      type: "boolean",
      description: "true only if the input describes a technology or business-systems problem Domiutra could help with.",
    },
    title: str("A 3–7 word name for the initiative, e.g. 'Billing platform modernization'."),
    summary: str("Two sentences restating the situation and goal in plain language. No marketing language."),
    services: {
      type: "array",
      minItems: 1,
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          slug: { type: "string", enum: SERVICE_SLUGS },
          reason: str("One sentence: why this service fits this situation."),
        },
        required: ["slug", "reason"],
        propertyOrdering: ["slug", "reason"],
      },
    },
    engagement: {
      type: "object",
      properties: {
        model: { type: "string", enum: [...ENGAGEMENT_MODELS] },
        reason: str("One sentence: why this engagement model fits."),
      },
      required: ["model", "reason"],
      propertyOrdering: ["model", "reason"],
    },
    team: {
      type: "object",
      properties: {
        workType: { type: "string", enum: WORK_TYPES },
        teamSize: { type: "integer", minimum: 2, maximum: 20, description: "Delivery team size, excluding U.S. leadership." },
        durationMonths: { type: "integer", minimum: 3, maximum: 24 },
        usInvolvement: { type: "string", enum: INVOLVEMENT },
        ongoingSupport: { type: "boolean" },
      },
      required: ["workType", "teamSize", "durationMonths", "usInvolvement", "ongoingSupport"],
      propertyOrdering: ["workType", "teamSize", "durationMonths", "usInvolvement", "ongoingSupport"],
    },
    phases: {
      type: "array",
      minItems: 3,
      maxItems: 4,
      items: {
        type: "object",
        properties: { name: str("2–4 words."), detail: str("One sentence.") },
        required: ["name", "detail"],
        propertyOrdering: ["name", "detail"],
      },
    },
    risks: { type: "array", minItems: 2, maxItems: 4, items: str("A specific risk, one sentence.") },
    questions: { type: "array", minItems: 3, maxItems: 4, items: str("A question Domiutra would ask to scope this properly.") },
  },
  required: ["relevant", "title", "summary", "services", "engagement", "team", "phases", "risks", "questions"],
  propertyOrdering: ["relevant", "title", "summary", "services", "engagement", "team", "phases", "risks", "questions"],
} as const;
