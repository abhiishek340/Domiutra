import { describe, expect, it } from "vitest";
import { services } from "@/lib/data/services";
import { industries } from "@/lib/data/industries";
import { caseStudies } from "@/lib/data/case-studies";
import { engagementModels } from "@/lib/data/engagement-models";

/**
 * Many lists render values as React keys. Duplicates only warn in dev, so
 * production-build E2E tests can't catch them; these checks can.
 */
const dupes = (values: string[]) => values.filter((v, i) => values.indexOf(v) !== i);

describe("content data integrity", () => {
  it("has unique slugs", () => {
    expect(dupes(services.map((s) => s.slug))).toEqual([]);
    expect(dupes(industries.map((i) => i.slug))).toEqual([]);
    expect(dupes(caseStudies.map((c) => c.slug))).toEqual([]);
    expect(dupes(engagementModels.map((m) => m.slug))).toEqual([]);
  });

  it.each(services.map((s) => [s.slug, s] as const))("%s has no duplicate keyed values", (_slug, s) => {
    expect(dupes(s.signals)).toEqual([]);
    expect(dupes(s.tags)).toEqual([]);
    expect(dupes(s.capabilities.map((c) => c.title))).toEqual([]);
    expect(dupes(s.diagram.steps)).toEqual([]);
    expect(dupes(s.faqs.map((f) => f.question))).toEqual([]);
    expect(dupes(s.technologies.map((g) => g.group))).toEqual([]);
    for (const g of s.technologies) expect(dupes(g.items)).toEqual([]);
  });

  it.each(industries.map((i) => [i.slug, i] as const))("%s has no duplicate keyed values", (_slug, i) => {
    expect(dupes(i.pressures.map((p) => p.title))).toEqual([]);
    expect(dupes(i.howWeHelp.map((h) => h.title))).toEqual([]);
    expect(dupes(i.considerations)).toEqual([]);
  });

  it("case studies have unique architecture steps and outcomes", () => {
    for (const c of caseStudies) {
      expect(dupes(c.architecture)).toEqual([]);
      expect(dupes(c.outcomes)).toEqual([]);
    }
  });
});
