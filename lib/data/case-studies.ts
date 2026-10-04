import type { CaseStudy } from "./types";

/**
 * Case studies.
 *
 * `kind: "representative"` entries describe the *shape* of typical
 * engagements. They are not customer projects and are always labeled as such
 * in the UI. Their `outcomes` describe what success is measured by, never
 * results. Replace or supplement them with `kind: "client"` entries once real,
 * approved case studies exist; see README → "How to add a case study".
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "modernizing-a-policy-administration-platform",
    kind: "representative",
    title: "Modernizing a policy administration platform without a big-bang rewrite",
    industry: "Financial Services",
    services: ["application-modernization", "cloud-devops", "qa-automation"],
    summary:
      "How we'd approach a regional insurer's aging monolith that slows every product change.",
    challenge:
      "A long-lived Java monolith handles quoting, policy changes, and billing. Releases happen quarterly because regression testing is manual, and new digital channels can't get the APIs they need.",
    approach:
      "Start with an assessment and characterization tests around the highest-risk flows. Put an API layer in front of the monolith, then extract the quoting domain first because it changes most often and blocks digital work.",
    solution:
      "Extracted services run on managed containers behind an API gateway, with event-based synchronization back to the core during transition. CI/CD with automated regression replaces the manual release cycle.",
    architecture: ["Legacy monolith", "Characterization tests", "API gateway", "Quoting service", "Event sync", "Managed containers"],
    outcomes: [
      "Release frequency for the extracted domain",
      "Change lead time for quoting changes",
      "Manual regression effort per release",
      "Production incidents tied to releases",
    ],
    technologies: ["Java", "Spring Boot", "PostgreSQL", "Kafka", "AWS", "Terraform", "Playwright"],
    featured: true,
  },
  {
    slug: "dedicated-team-for-a-b2b-saas-roadmap",
    kind: "representative",
    title: "A dedicated product team for a B2B SaaS roadmap",
    industry: "Technology",
    services: ["software-engineering", "qa-automation", "cloud-devops"],
    summary:
      "How a growing software company could add a full product team without slowing its own engineers down.",
    challenge:
      "A SaaS company has committed enterprise features to customers, but hiring is slow and the existing team is consumed by the core platform.",
    approach:
      "Stand up a cross-functional team under a U.S.-based engagement lead, adopt the customer's rituals and review standards, and take ownership of a clearly bounded product area.",
    solution:
      "The team owns the enterprise features area end-to-end, including SSO, audit logging, and admin tooling, with automated tests and release pipelines that match the customer's platform.",
    architecture: ["Customer backlog", "Dedicated squad", "Shared CI/CD", "Feature flags", "Production"],
    outcomes: [
      "Roadmap commitments delivered on schedule",
      "Time from merge to production",
      "Defect escape rate for owned features",
      "Internal team time returned to core platform work",
    ],
    technologies: ["TypeScript", "React", "Node.js", "PostgreSQL", "GitHub Actions", "Playwright"],
    featured: true,
  },
  {
    slug: "ai-assisted-document-intake-for-operations",
    kind: "representative",
    title: "AI-assisted document intake with human review",
    industry: "Logistics",
    services: ["ai-data", "software-engineering"],
    summary:
      "How an operations team buried in shipping documents could use AI for extraction while people keep control.",
    challenge:
      "Operations staff re-key data from bills of lading, invoices, and customs forms into multiple systems, which creates delays and errors.",
    approach:
      "Pick one document type with high volume and clear rules. Build an evaluation set from historical documents, then design a workflow where AI extracts and people review low-confidence fields.",
    solution:
      "A pipeline classifies documents, extracts structured fields, validates them against business rules, and routes exceptions to a review queue before writing to the operational system.",
    architecture: ["Document inbox", "Classification", "Extraction", "Rule validation", "Human review", "TMS / ERP"],
    outcomes: [
      "Handling time per document",
      "Field-level accuracy against the evaluation set",
      "Share of documents requiring human review",
      "Downstream corrections and rework",
    ],
    technologies: ["Python", "LLM APIs", "PostgreSQL", "Azure", "Queue-based workers"],
    featured: true,
  },
  {
    slug: "taking-over-production-support",
    kind: "representative",
    title: "Taking over production support for business-critical applications",
    industry: "Manufacturing",
    services: ["managed-services", "cloud-devops"],
    summary:
      "How a lean IT team could hand over day-to-day support of operational applications with clear service levels.",
    challenge:
      "A small internal IT team supports a portfolio of custom applications built by former vendors, with no monitoring and limited documentation.",
    approach:
      "Run a structured transition: document each application, add monitoring, shadow the internal team, then take primary responsibility application by application.",
    solution:
      "A managed service with agreed coverage, severity definitions, an escalation matrix, and monthly service reviews that feed an improvement backlog.",
    architecture: ["Application portfolio", "Monitoring baseline", "Ticketing & on-call", "Runbooks", "Monthly review"],
    outcomes: [
      "Response and resolution against agreed targets",
      "Incidents detected by monitoring before users",
      "Recurring issues eliminated through problem management",
      "Internal IT hours freed for new initiatives",
    ],
    technologies: ["Azure", ".NET", "SQL Server", "Grafana", "Jira Service Management"],
    featured: false,
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
