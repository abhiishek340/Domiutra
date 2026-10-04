import type { DiagramKey } from "./types";

export type StepTone = "legacy" | "default" | "human" | "final";
export type StepDetail = { detail: string; tone?: StepTone };

/**
 * Optional explanations for each step in a service's process diagram.
 * When present, the diagram becomes interactive (select a step to read it).
 */
export const diagramDetails: Partial<Record<DiagramKey, Record<string, StepDetail>>> = {
  modernization: {
    "Legacy system": { tone: "legacy", detail: "The system as it runs today: business-critical, hard to change, and often under-documented." },
    Assessment: { detail: "Code, dependency, data, and operations review. We map risk, value, and coupling before recommending anything." },
    "Target architecture": { detail: "A pragmatic end state and the intermediate states to get there, with decisions recorded as ADRs." },
    "Domain & API decomposition": { detail: "Carve out bounded domains behind stable APIs so new work stops depending on the monolith." },
    "Cloud migration": { detail: "Move workloads with the right strategy per component: rehost, replatform, or refactor." },
    "Automated testing": { detail: "Characterization tests lock in legacy behavior; automated suites protect every later change." },
    Production: { detail: "Progressive cutover behind flags, with rollback plans and parallel running where risk demands it." },
    "Continuous optimization": { tone: "final", detail: "Track cost, change lead time, and incidents. Retire legacy components as replacements prove out." },
  },
  cloud: {
    Code: { detail: "Application and infrastructure changes start in version control, reviewed like any other code." },
    "CI/CD": { detail: "Build, test, scan, and package automatically. Only artifacts that pass every gate move forward." },
    "Infrastructure as code": { detail: "Environments defined in Terraform or native tooling, with policy checks before apply." },
    Cloud: { detail: "Landing zones, networking, identity, and account structure designed for separation and least privilege." },
    Kubernetes: { detail: "Orchestration where it earns its complexity; managed services where it doesn't." },
    Observability: { detail: "Metrics, logs, traces, and SLOs that show what users experience and why." },
    Production: { tone: "final", detail: "Progressive delivery with automated rollback, and cost visibility per team and product." },
  },
  ai: {
    Data: { detail: "Approved sources only, with access controls carried through. Data quality is checked before any model sees it." },
    "Model / Agent": { detail: "The right model for the task, with structured outputs, retrieval where needed, and an evaluation set." },
    Workflow: { detail: "AI handles a bounded step in a larger process, with deterministic rules around it." },
    "Human review": { tone: "human", detail: "People approve outputs where accuracy, safety, or accountability matter. Low-confidence cases are routed to them." },
    "Business system": { detail: "Results are written to the systems of record through the same APIs and permissions as any other integration." },
    Outcome: { tone: "final", detail: "Measured against metrics agreed before the build: time per task, error rates, escalations, cost per task." },
  },
};
