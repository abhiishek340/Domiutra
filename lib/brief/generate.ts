import { briefJsonSchema, briefSchema, type Brief } from "./schema";
import { buildSystemInstruction, buildUserContent } from "./prompt";
import { geminiApiKey, geminiModel, isDemoMode } from "./config";

export type BriefResult =
  | { ok: true; brief: Brief; demo: boolean }
  | { ok: false; code: "not_configured" | "off_topic" | "upstream_error" | "timeout" };

const TIMEOUT_MS = 25_000;
const ATTEMPTS = 2;

type GenerateFn = (prompt: string, signal: AbortSignal) => Promise<string | undefined>;

/** Calls Gemini with structured JSON output. The SDK is loaded lazily, server-side only. */
const callGemini: GenerateFn = async (prompt, signal) => {
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey: geminiApiKey() });
  const response = await ai.models.generateContent({
    model: geminiModel(),
    contents: buildUserContent(prompt),
    config: {
      systemInstruction: buildSystemInstruction(),
      responseMimeType: "application/json",
      responseJsonSchema: briefJsonSchema,
      temperature: 0.4,
      maxOutputTokens: 2048,
      abortSignal: signal,
    },
  });
  return response.text;
};

/**
 * Generates and validates a brief. Output that fails validation is retried
 * once, then reported as an upstream error; it is never passed through.
 */
export async function generateBrief(prompt: string, generate: GenerateFn = callGemini): Promise<BriefResult> {
  if (!geminiApiKey()) {
    return isDemoMode() ? { ok: true, brief: demoBrief(prompt), demo: true } : { ok: false, code: "not_configured" };
  }

  const signal = AbortSignal.timeout(TIMEOUT_MS);
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    let text: string | undefined;
    try {
      text = await generate(prompt, signal);
    } catch (error) {
      if (signal.aborted) return { ok: false, code: "timeout" };
      console.error("[brief] Gemini request failed:", error instanceof Error ? error.message : error);
      return { ok: false, code: "upstream_error" };
    }

    const parsed = safeJson(text);
    const result = briefSchema.safeParse(parsed);
    if (result.success) {
      return result.data.relevant ? { ok: true, brief: result.data, demo: false } : { ok: false, code: "off_topic" };
    }
    console.warn(`[brief] Invalid model output (attempt ${attempt}):`, result.error.issues[0]?.message);
  }
  return { ok: false, code: "upstream_error" };
}

function safeJson(text: string | undefined): unknown {
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

/** A clearly labeled sample used only in local demo mode. */
export function demoBrief(prompt: string): Brief {
  const lower = prompt.toLowerCase();
  const ai = /\b(ai|llm|gpt|agent|machine learning|ml|automation)\b/.test(lower);
  const cloud = /\b(aws|azure|cloud|kubernetes|devops|ci\/cd|migrat)/.test(lower);
  return {
    relevant: true,
    title: ai ? "AI workflow pilot" : cloud ? "Cloud migration and modernization" : "Platform modernization",
    summary:
      "You have a business-critical system that is slow to change and expensive to run. The goal is to modernize it incrementally without disrupting day-to-day operations.",
    services: [
      { slug: ai ? "ai-data" : "application-modernization", reason: "Breaks the work into safe, incremental steps with measurable progress." },
      { slug: "cloud-devops", reason: "Repeatable infrastructure and pipelines make every later change cheaper." },
      { slug: "qa-automation", reason: "Automated regression tests protect existing behavior while the system changes." },
    ],
    engagement: { model: "project", reason: "A defined first outcome suits milestone-based delivery, with an option to continue as a dedicated team." },
    team: { workType: ai ? "ai-data" : "modernization", teamSize: 6, durationMonths: 9, usInvolvement: "standard", ongoingSupport: true },
    phases: [
      { name: "Assess", detail: "Map the system, dependencies, and risks, and agree on success metrics." },
      { name: "Stabilize", detail: "Add characterization tests and CI so changes stop being risky." },
      { name: "Modernize", detail: "Extract the highest-value area behind a stable API and migrate it." },
      { name: "Operate", detail: "Monitor, optimize costs, and plan the next increment." },
    ],
    risks: [
      "Undocumented business rules hidden in legacy code paths.",
      "Data migration and cutover windows affecting operations.",
    ],
    questions: [
      "Which part of the system changes most often today?",
      "What compliance or data-handling requirements apply?",
      "Who on your side owns product and architecture decisions?",
    ],
  };
}
