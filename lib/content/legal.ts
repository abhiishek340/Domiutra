import type { ComponentType } from "react";
import { z } from "zod";

const legalMetaSchema = z.object({
  title: z.string(),
  description: z.string(),
  lastUpdated: z.string(),
});

export type LegalSlug = "privacy" | "terms" | "accessibility";
export type LegalMeta = z.infer<typeof legalMetaSchema>;

export async function getLegalDoc(
  slug: LegalSlug,
): Promise<{ meta: LegalMeta; Content: ComponentType<Record<string, unknown>> }> {
  const mod = (await import(`@/content/legal/${slug}.mdx`)) as {
    default: ComponentType<Record<string, unknown>>;
    meta?: unknown;
  };
  return { meta: legalMetaSchema.parse(mod.meta), Content: mod.default };
}
