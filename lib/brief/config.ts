/**
 * Brief assistant configuration (server-side only).
 *   GEMINI_API_KEY   enables the feature (never exposed to the browser)
 *   GEMINI_MODEL     optional override; defaults to a fast Flash-Lite model
 *   GEMINI_FALLBACK_MODEL  used when the primary model is overloaded
 *   BRIEF_DEMO_MODE  "true" serves a labeled sample brief without calling
 *                    Gemini, for local previews. Ignored in production.
 */
// Flash-Lite is fast, low-cost, and produced strong briefs in live testing;
// the larger Flash model is the fallback when Flash-Lite is unavailable.
export const DEFAULT_MODEL = "gemini-3.5-flash-lite";
export const DEFAULT_FALLBACK_MODEL = "gemini-3.8-flash";

export function geminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY?.trim() || undefined;
}

export function geminiModel(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}

/** Models to try in order: primary, then a lighter fallback for capacity spikes. */
export function geminiModels(): string[] {
  const fallback = process.env.GEMINI_FALLBACK_MODEL?.trim() || DEFAULT_FALLBACK_MODEL;
  return [...new Set([geminiModel(), fallback])];
}

export function isDemoMode(): boolean {
  return process.env.BRIEF_DEMO_MODE === "true" && process.env.NODE_ENV !== "production" && !geminiApiKey();
}

/** The assistant is shown only when it can actually answer. */
export function isBriefEnabled(): boolean {
  return Boolean(geminiApiKey()) || isDemoMode();
}
