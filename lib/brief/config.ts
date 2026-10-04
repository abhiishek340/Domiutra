/**
 * Brief assistant configuration (server-side only).
 *   GEMINI_API_KEY   enables the feature (never exposed to the browser)
 *   GEMINI_MODEL     optional override; defaults to a fast Flash model
 *   BRIEF_DEMO_MODE  "true" serves a labeled sample brief without calling
 *                    Gemini, for local previews. Ignored in production.
 */
export const DEFAULT_MODEL = "gemini-3.8-flash";

export function geminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY?.trim() || undefined;
}

export function geminiModel(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}

export function isDemoMode(): boolean {
  return process.env.BRIEF_DEMO_MODE === "true" && process.env.NODE_ENV !== "production" && !geminiApiKey();
}

/** The assistant is shown only when it can actually answer. */
export function isBriefEnabled(): boolean {
  return Boolean(geminiApiKey()) || isDemoMode();
}
