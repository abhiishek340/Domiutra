import type { DeliveryStage } from "./types";

/** Seven-stage delivery process used on /delivery-model. */
export const deliveryStages: DeliveryStage[] = [
  {
    number: "01",
    name: "Discover",
    summary: "Understand the business problem, the current system, and the constraints before anyone estimates anything.",
    activities: ["Stakeholder interviews", "System and codebase review", "Constraint and risk mapping"],
    outputs: ["Problem statement", "Current-state map", "Initial risk register"],
    customer: "Share context, give access, and make the right people available.",
    domiutra: "Ask the hard questions early and document what we find.",
  },
  {
    number: "02",
    name: "Define",
    summary: "Agree what success looks like, what's in scope, and how decisions will be made.",
    activities: ["Outcome and metric definition", "Scope and priorities", "Engagement model selection"],
    outputs: ["Success criteria", "Scope and milestones", "Working agreement"],
    customer: "Confirm priorities and name a decision-maker.",
    domiutra: "Propose a realistic plan, team shape, and commercial structure.",
  },
  {
    number: "03",
    name: "Design",
    summary: "Make the architecture and delivery decisions that are expensive to change later.",
    activities: ["Solution architecture", "Security and access design", "Delivery and environment plan"],
    outputs: ["Architecture decision records", "Security plan", "Delivery backlog"],
    customer: "Review and approve key architecture and security decisions.",
    domiutra: "Document decisions, trade-offs, and alternatives considered.",
  },
  {
    number: "04",
    name: "Build",
    summary: "Ship in small, reviewable increments with quality checks on every change.",
    activities: ["Iterative engineering", "Code review", "Continuous integration"],
    outputs: ["Working software every iteration", "Automated tests", "Status and risk reports"],
    customer: "Attend reviews, give feedback, and accept increments.",
    domiutra: "Deliver to plan, flag risks early, and keep the backlog honest.",
  },
  {
    number: "05",
    name: "Validate",
    summary: "Prove the system works the way the business needs it to, under realistic conditions.",
    activities: ["Regression and end-to-end testing", "Performance and security testing", "User acceptance support"],
    outputs: ["Test evidence", "Performance baseline", "Release readiness checklist"],
    customer: "Run acceptance testing with real users.",
    domiutra: "Provide evidence, not assurances.",
  },
  {
    number: "06",
    name: "Launch",
    summary: "Release with a plan for rollback, monitoring, and communication.",
    activities: ["Release planning", "Progressive rollout", "Hypercare"],
    outputs: ["Release runbook", "Dashboards and alerts", "Launch review"],
    customer: "Coordinate business readiness and communications.",
    domiutra: "Execute the release and watch production closely.",
  },
  {
    number: "07",
    name: "Operate",
    summary: "Keep the system healthy and improving, or hand it over cleanly.",
    activities: ["Monitoring and support", "Incident and problem management", "Continuous improvement"],
    outputs: ["Service reports", "Improvement roadmap", "Up-to-date documentation"],
    customer: "Set priorities and review service performance.",
    domiutra: "Own reliability against agreed service levels.",
  },
];

/** Four-stage homepage summary. */
export const workflowStages = [
  { number: "01", name: "Understand", items: ["Requirements", "Architecture", "Goals"], caption: "We start by learning the business, the system, and what success means." },
  { number: "02", name: "Build", items: ["Engineering", "QA", "Integration"], caption: "Small increments, reviewed code, and automated tests from the first sprint." },
  { number: "03", name: "Launch", items: ["Cloud", "CI/CD", "Observability"], caption: "Repeatable releases with monitoring in place before customers arrive." },
  { number: "04", name: "Operate", items: ["Support", "Optimization", "Continuous improvement"], caption: "The relationship continues after launch, with clear service levels." },
] as const;

/** Layers of the U.S.-managed delivery structure. */
export const deliveryLayers = [
  { id: "client", label: "Your team", detail: "Product owners, engineering leaders, and business stakeholders." },
  { id: "leadership", label: "Domiutra U.S. account leadership", detail: "One accountable relationship. Commercials, escalation, and outcomes." },
  { id: "architecture", label: "Solution architecture & delivery management", detail: "Technical direction, planning, risk, and reporting." },
  { id: "global", label: "Global engineering team", detail: "Built around your requirements, time zones, and security needs." },
  { id: "disciplines", label: "Engineering · QA · Cloud · AI · Support", detail: "Disciplines combined per engagement, not per org chart." },
] as const;

export const securityPractices = [
  { title: "Least privilege", description: "Access is granted per role and per environment, reviewed regularly, and removed promptly when no longer needed." },
  { title: "Multi-factor authentication", description: "MFA on every system that supports it, including source control, cloud consoles, and collaboration tools." },
  { title: "Secure development", description: "Dependency scanning, static analysis, and security review built into the pipeline, not added at the end." },
  { title: "Secrets management", description: "Credentials stay in managed vaults. Never in code, tickets, or chat." },
  { title: "Code review", description: "Every change is reviewed by another engineer before it merges, with stricter rules for sensitive areas." },
  { title: "Environment separation", description: "Development, staging, and production are separated, with production data kept out of lower environments by default." },
  { title: "Logging & audit", description: "Access and change activity is logged so you can always answer who did what, and when." },
  { title: "Incident response", description: "Defined severity levels, escalation paths, and customer notification steps, agreed before they're needed." },
  { title: "Controlled production access", description: "Production access is limited, time-bound where possible, and tied to a ticket or change record." },
] as const;
