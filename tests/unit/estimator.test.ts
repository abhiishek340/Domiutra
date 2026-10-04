import { describe, expect, it } from "vitest";
import {
  apportion,
  defaultEstimatorInput,
  estimateDelivery,
  TEAM_MAX,
  TEAM_MIN,
  type EstimatorInput,
} from "@/lib/estimator/model";

const deliveryCount = (input: EstimatorInput) =>
  estimateDelivery(input)
    .delivery.filter((r) => r.id !== "ops")
    .reduce((n, r) => n + r.count, 0);

describe("apportion", () => {
  it("always sums to the total", () => {
    for (let total = 0; total <= 50; total++) {
      const out = apportion(total, [0.72, 0.16, 0.12]);
      expect(out.reduce((a, b) => a + b, 0)).toBe(total);
    }
  });

  it("gives larger weights at least as much as smaller ones", () => {
    const [a, b, c] = apportion(10, [0.6, 0.3, 0.1]);
    expect(a).toBeGreaterThanOrEqual(b!);
    expect(b).toBeGreaterThanOrEqual(c!);
  });
});

describe("estimateDelivery", () => {
  it("allocates exactly the requested delivery team size", () => {
    for (const engineeringType of ["product", "modernization", "cloud", "ai-data", "support"] as const) {
      for (const teamSize of [2, 3, 6, 11, 25, 40]) {
        expect(deliveryCount({ ...defaultEstimatorInput, engineeringType, teamSize, ongoingSupport: false })).toBe(teamSize);
      }
    }
  });

  it("clamps out-of-range inputs", () => {
    expect(deliveryCount({ ...defaultEstimatorInput, teamSize: 999, ongoingSupport: false })).toBe(TEAM_MAX);
    expect(deliveryCount({ ...defaultEstimatorInput, teamSize: -5, ongoingSupport: false })).toBe(TEAM_MIN);
    expect(deliveryCount({ ...defaultEstimatorInput, teamSize: Number.NaN, ongoingSupport: false })).toBe(TEAM_MIN);
  });

  it("always includes a U.S.-based engagement lead or service owner", () => {
    const project = estimateDelivery({ ...defaultEstimatorInput, deliveryModel: "project" });
    expect(project.leadership[0]).toMatchObject({ title: "Engagement lead", location: "U.S." });
    const managed = estimateDelivery({ ...defaultEstimatorInput, deliveryModel: "managed" });
    expect(managed.leadership[0]).toMatchObject({ title: "Service owner", location: "U.S." });
  });

  it("makes the engagement lead full-time when U.S. involvement is high", () => {
    const r = estimateDelivery({ ...defaultEstimatorInput, teamSize: 4, usInvolvement: "high" });
    expect(r.leadership[0]?.allocation).toBe("Full-time");
  });

  it("uses an operations-centered team for managed services", () => {
    const r = estimateDelivery({ ...defaultEstimatorInput, deliveryModel: "managed", engineeringType: "product" });
    expect(r.delivery.some((role) => role.id === "support")).toBe(true);
    expect(r.phases.map((p) => p.name)).toContain("Transition");
  });

  it("adds production support to build engagements when requested", () => {
    const withSupport = estimateDelivery({ ...defaultEstimatorInput, deliveryModel: "project", ongoingSupport: true });
    const without = estimateDelivery({ ...defaultEstimatorInput, deliveryModel: "project", ongoingSupport: false });
    expect(withSupport.delivery.some((r) => r.id === "ops")).toBe(true);
    expect(without.delivery.some((r) => r.id === "ops")).toBe(false);
    expect(withSupport.phases.at(-1)?.name).toBe("Ongoing support");
  });

  it("adds tech leads on larger teams only", () => {
    expect(estimateDelivery({ ...defaultEstimatorInput, teamSize: 4 }).delivery.some((r) => r.id === "tech-lead")).toBe(false);
    expect(estimateDelivery({ ...defaultEstimatorInput, teamSize: 16 }).delivery.find((r) => r.id === "tech-lead")?.count).toBe(2);
  });

  it("never produces pricing information", () => {
    const text = JSON.stringify(estimateDelivery(defaultEstimatorInput));
    expect(text).not.toMatch(/\$|price|cost|rate/i);
  });
});
