/**
 * Delivery model estimator. Pure functions, no pricing.
 * Turns a few planning inputs into an illustrative team composition and
 * delivery structure. Shared by the UI and unit tests.
 */

export const engineeringTypes = {
  product: "Product engineering",
  modernization: "Modernization",
  cloud: "Cloud & DevOps",
  "ai-data": "AI & Data",
  support: "Support & operations",
} as const;
export type EngineeringType = keyof typeof engineeringTypes;

export const involvementLevels = {
  light: "Light",
  standard: "Standard",
  high: "High",
} as const;
export type Involvement = keyof typeof involvementLevels;

export const deliveryModels = {
  project: "Project delivery",
  dedicated: "Dedicated team",
  managed: "Managed service",
} as const;
export type DeliveryModelId = keyof typeof deliveryModels;

export type EstimatorInput = {
  teamSize: number; // delivery team, excluding U.S. leadership
  engineeringType: EngineeringType;
  usInvolvement: Involvement;
  deliveryModel: DeliveryModelId;
  durationMonths: number;
  ongoingSupport: boolean;
};

export type Location = "U.S." | "Global" | "Blended";
export type RoleGroup = "leadership" | "engineering" | "quality" | "platform" | "operations";

export type Role = {
  id: string;
  title: string;
  count: number;
  /** "Full-time" or "Part-time" allocation. */
  allocation: "Full-time" | "Part-time";
  location: Location;
  group: RoleGroup;
};

export type EstimatorResult = {
  leadership: Role[];
  delivery: Role[];
  totalPeople: number;
  usLeadershipSummary: string;
  overlap: string;
  phases: { name: string; detail: string }[];
  cadence: string[];
};

export const TEAM_MIN = 2;
export const TEAM_MAX = 40;
export const DURATION_MIN = 3;
export const DURATION_MAX = 36;

type Mix = { id: string; title: string; group: RoleGroup; weight: number; min?: number }[];

const mixes: Record<EngineeringType, Mix> = {
  product: [
    { id: "eng", title: "Software engineers", group: "engineering", weight: 0.72, min: 1 },
    { id: "qa", title: "QA / test automation", group: "quality", weight: 0.16 },
    { id: "devops", title: "DevOps engineer", group: "platform", weight: 0.12 },
  ],
  modernization: [
    { id: "eng", title: "Software engineers", group: "engineering", weight: 0.62, min: 1 },
    { id: "qa", title: "QA / test automation", group: "quality", weight: 0.2 },
    { id: "devops", title: "Cloud / DevOps engineers", group: "platform", weight: 0.18 },
  ],
  cloud: [
    { id: "devops", title: "Cloud / DevOps engineers", group: "platform", weight: 0.62, min: 1 },
    { id: "eng", title: "Software engineers", group: "engineering", weight: 0.24 },
    { id: "qa", title: "QA / test automation", group: "quality", weight: 0.14 },
  ],
  "ai-data": [
    { id: "data", title: "Data / ML engineers", group: "engineering", weight: 0.46, min: 1 },
    { id: "eng", title: "Software engineers", group: "engineering", weight: 0.3 },
    { id: "qa", title: "QA / evaluation", group: "quality", weight: 0.12 },
    { id: "devops", title: "Cloud / MLOps engineer", group: "platform", weight: 0.12 },
  ],
  support: [
    { id: "support", title: "Support engineers", group: "operations", weight: 0.55, min: 1 },
    { id: "sre", title: "SRE / cloud operations", group: "platform", weight: 0.3 },
    { id: "eng", title: "Maintenance engineers", group: "engineering", weight: 0.15 },
  ],
};

/** Largest-remainder apportionment so counts always sum to `total`. */
export function apportion(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (w / sum) * total);
  const floors = raw.map(Math.floor);
  let remaining = total - floors.reduce((a, b) => a + b, 0);
  const order = raw
    .map((r, i) => ({ i, rem: r - Math.floor(r) }))
    .sort((a, b) => b.rem - a.rem || a.i - b.i);
  for (const { i } of order) {
    if (remaining <= 0) break;
    floors[i] = (floors[i] ?? 0) + 1;
    remaining--;
  }
  return floors;
}

export function clampInput(input: EstimatorInput): EstimatorInput {
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Math.round(Number.isFinite(v) ? v : lo)));
  return {
    ...input,
    teamSize: clamp(input.teamSize, TEAM_MIN, TEAM_MAX),
    durationMonths: clamp(input.durationMonths, DURATION_MIN, DURATION_MAX),
  };
}

export function estimateDelivery(rawInput: EstimatorInput): EstimatorResult {
  const input = clampInput(rawInput);
  const { teamSize, engineeringType, usInvolvement, deliveryModel, durationMonths, ongoingSupport } = input;

  // Managed services always carry an operations core, whatever the work type.
  const effectiveType: EngineeringType = deliveryModel === "managed" && engineeringType !== "cloud" ? "support" : engineeringType;
  const mix = mixes[effectiveType];

  // Tech leads come out of the delivery headcount on larger teams.
  const techLeads = teamSize >= 6 ? Math.max(1, Math.round(teamSize / 8)) : 0;
  const pool = teamSize - techLeads;
  const counts = apportion(pool, mix.map((m) => m.weight));

  // Guarantee required minimums by borrowing from the largest bucket.
  mix.forEach((m, i) => {
    if (m.min && (counts[i] ?? 0) < m.min) {
      const largest = counts.indexOf(Math.max(...counts));
      if (largest !== i && (counts[largest] ?? 0) > 1) {
        counts[largest] = (counts[largest] ?? 0) - 1;
        counts[i] = (counts[i] ?? 0) + 1;
      }
    }
  });

  const delivery: Role[] = [];
  if (techLeads > 0) {
    delivery.push({
      id: "tech-lead",
      title: techLeads > 1 ? "Tech leads" : "Tech lead",
      count: techLeads,
      allocation: "Full-time",
      location: "Blended",
      group: "engineering",
    });
  }
  mix.forEach((m, i) => {
    const count = counts[i] ?? 0;
    if (count > 0) {
      delivery.push({ id: m.id, title: m.title, count, allocation: "Full-time", location: "Global", group: m.group });
    }
  });

  // Ongoing support on a build engagement adds a part-time operations seat.
  if (ongoingSupport && deliveryModel !== "managed") {
    delivery.push({
      id: "ops",
      title: "Production support",
      count: 1,
      allocation: "Part-time",
      location: "Global",
      group: "operations",
    });
  }

  const large = teamSize >= 12;
  const leadership: Role[] = [
    {
      id: "engagement-lead",
      title: deliveryModel === "managed" ? "Service owner" : "Engagement lead",
      count: 1,
      allocation: usInvolvement === "high" || large ? "Full-time" : "Part-time",
      location: "U.S.",
      group: "leadership",
    },
  ];

  const needsArchitect =
    deliveryModel === "project" || engineeringType === "modernization" || engineeringType === "cloud" || engineeringType === "ai-data";
  if (needsArchitect) {
    leadership.push({
      id: "architect",
      title: "Solution architect",
      count: 1,
      allocation: teamSize >= 15 ? "Full-time" : "Part-time",
      location: usInvolvement === "light" ? "Blended" : "U.S.",
      group: "leadership",
    });
  }

  if (deliveryModel === "project" || teamSize >= 6) {
    leadership.push({
      id: "delivery-manager",
      title: "Delivery manager",
      count: teamSize >= 20 ? 2 : 1,
      allocation: teamSize >= 8 ? "Full-time" : "Part-time",
      location: usInvolvement === "high" ? "U.S." : "Blended",
      group: "leadership",
    });
  }

  const usLeadershipSummary = {
    light: "A U.S.-based engagement lead owns the relationship, steering, and escalation. Day-to-day coordination runs through the delivery team.",
    standard: "U.S.-based leadership owns the relationship and key technical decisions, joins planning and reviews, and is your first point of escalation.",
    high: "U.S.-based leadership is embedded in your rhythm: daily overlap, joint planning, architecture ownership, and direct stakeholder management.",
  }[usInvolvement];

  const overlap = {
    light: "A defined daily overlap window for stand-ups and questions.",
    standard: "Several hours of daily overlap, aligned to your core hours.",
    high: "Extended overlap with your core hours, plus U.S.-hours coverage for leadership.",
  }[usInvolvement];

  const phases: { name: string; detail: string }[] = [];
  if (deliveryModel === "managed") {
    phases.push(
      { name: "Transition", detail: "Knowledge transfer, documentation, and monitoring baseline." },
      { name: "Shadow & reverse-shadow", detail: "Run alongside your team, then take primary responsibility." },
      { name: "Run", detail: "Operate against agreed service levels with monthly reviews." },
      { name: "Improve", detail: "Problem management and a quarterly improvement roadmap." },
    );
  } else {
    phases.push({
      name: "Discovery",
      detail: durationMonths <= 6 ? "A short, focused discovery to confirm scope and risks." : "Discovery and architecture to set direction for the longer engagement.",
    });
    if (deliveryModel === "project") {
      const milestones = Math.max(2, Math.min(6, Math.round(durationMonths / 2)));
      phases.push({ name: "Milestone delivery", detail: `About ${milestones} milestones, each with a demo and acceptance.` });
      phases.push({ name: "Launch", detail: "Release, hypercare, and handover documentation." });
    } else {
      phases.push({ name: "Ramp-up", detail: "Onboarding into your tools and practices, first increments shipped." });
      phases.push({ name: "Steady delivery", detail: "Continuous delivery on your roadmap, with quarterly team-shape reviews." });
    }
    if (ongoingSupport) {
      phases.push({ name: "Ongoing support", detail: "Production support continues after launch under agreed service levels." });
    }
  }

  const cadence =
    deliveryModel === "managed"
      ? ["Daily ticket and incident review", "Weekly operations sync", "Monthly service report", "Quarterly improvement review"]
      : [
          "Daily stand-up in the overlap window",
          deliveryModel === "project" ? "Milestone demos and acceptance" : "Sprint reviews and planning",
          "Weekly status and risk report",
          "Monthly steering with U.S. leadership",
        ];

  const totalPeople = [...leadership, ...delivery].reduce((sum, r) => sum + r.count, 0);

  return { leadership, delivery, totalPeople, usLeadershipSummary, overlap, phases, cadence };
}

export const defaultEstimatorInput: EstimatorInput = {
  teamSize: 6,
  engineeringType: "product",
  usInvolvement: "standard",
  deliveryModel: "dedicated",
  durationMonths: 12,
  ongoingSupport: true,
};
