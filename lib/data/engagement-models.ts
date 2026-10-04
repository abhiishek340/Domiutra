import type { EngagementModel } from "./types";

export const engagementModels: EngagementModel[] = [
  {
    slug: "project-delivery",
    name: "Project Delivery",
    bestFor: "Best for defined outcomes",
    summary:
      "We commit to a defined scope or set of milestones and own delivery against it: plan, team, quality, and timeline.",
    whenToUse: [
      "The outcome can be described clearly enough to plan against.",
      "You want one party accountable for delivering it.",
      "You'd rather manage milestones than manage people.",
    ],
    teamStructure: [
      "U.S.-based engagement lead",
      "Solution architect",
      "Delivery manager",
      "Engineering, QA, and DevOps sized to the scope",
    ],
    commercial:
      "Fixed price per milestone or capped time-and-materials. Scope changes go through a visible change process, so there are no surprises in either direction.",
    customerResponsibilities: [
      "A product owner with authority to make decisions",
      "Timely access to systems, data, and subject-matter experts",
      "Milestone reviews and acceptance",
    ],
    domiutraResponsibilities: [
      "Delivery plan, risks, and status reporting",
      "Architecture, engineering, testing, and release",
      "Handover documentation, or transition into managed services",
    ],
    strengths: [
      "Clear accountability and predictable budget",
      "You manage outcomes, not individuals",
      "Natural end point with clean handover",
    ],
    limitations: [
      "Requires reasonably stable scope; discovery may come first",
      "Change requests add process overhead",
      "Less suited to open-ended product evolution",
    ],
    primary: true,
  },
  {
    slug: "dedicated-team",
    name: "Dedicated Team",
    bestFor: "Best for ongoing product development",
    summary:
      "A stable, cross-functional team that works on your roadmap long term, with U.S.-based leadership responsible for its performance.",
    whenToUse: [
      "You have a continuing roadmap rather than a single project.",
      "You want the team to build deep context in your product and domain.",
      "Priorities change often and you need flexibility within a stable team.",
    ],
    teamStructure: [
      "U.S.-based engagement lead",
      "Delivery manager or team lead",
      "Engineers, QA, and DevOps in a ratio matched to the work",
      "Architecture support as needed",
    ],
    commercial:
      "Monthly capacity-based pricing for an agreed team shape, reviewed quarterly. Scale up or down with notice periods set in the agreement.",
    customerResponsibilities: [
      "Product direction and backlog prioritization",
      "Participation in planning and reviews",
      "Access to tooling, environments, and stakeholders",
    ],
    domiutraResponsibilities: [
      "Team composition, hiring, and retention",
      "Engineering quality, delivery cadence, and reporting",
      "Continuity planning, so knowledge isn't lost when people change",
    ],
    strengths: [
      "Flexibility as priorities change",
      "Context and velocity compound over time",
      "Predictable monthly cost",
    ],
    limitations: [
      "You stay responsible for product direction",
      "Value depends on a well-maintained backlog",
      "Needs a few weeks to reach full productivity",
    ],
    primary: true,
  },
  {
    slug: "managed-services",
    name: "Managed Services",
    bestFor: "Best for systems that need continuous ownership",
    summary:
      "We take operational responsibility for applications or infrastructure against agreed service levels, and report on it every month.",
    whenToUse: [
      "The system is in production and needs reliable ongoing care.",
      "Your team should focus on new work rather than support.",
      "You want service levels, not hours, as the basis of the relationship.",
    ],
    teamStructure: [
      "U.S.-based service owner",
      "Operations and support engineers",
      "Escalation to engineering and cloud specialists",
      "Coverage model designed around your required hours",
    ],
    commercial:
      "Monthly service fee based on scope, coverage, and service levels, with optional capacity for enhancements.",
    customerResponsibilities: [
      "Agree on priorities, service levels, and escalation contacts",
      "Approve changes that affect the business",
      "Participate in monthly service reviews",
    ],
    domiutraResponsibilities: [
      "Monitoring, incident response, and problem management",
      "Maintenance, patching, and release support",
      "Service reporting and improvement recommendations",
    ],
    strengths: [
      "Clear ownership of production",
      "Predictable cost tied to service levels",
      "Continuous improvement instead of firefighting",
    ],
    limitations: [
      "Requires a transition period before taking full ownership",
      "Large enhancements are scoped separately",
      "Coverage beyond agreed hours costs more",
    ],
    primary: true,
  },
  {
    slug: "staff-augmentation",
    name: "Staff Augmentation",
    bestFor: "Best when you need specific expertise quickly",
    summary:
      "Individual specialists join your team and work under your direction. Useful for targeted gaps; not our primary model.",
    whenToUse: [
      "You have strong internal engineering management already.",
      "You need a specific skill your team lacks, for a defined period.",
      "The work is best directed day-to-day by your own leads.",
    ],
    teamStructure: [
      "Individual engineers or specialists",
      "Embedded in your team, rituals, and tooling",
      "Domiutra account oversight for performance and continuity",
    ],
    commercial:
      "Time-and-materials, billed monthly per person, with agreed notice periods.",
    customerResponsibilities: [
      "Day-to-day direction, priorities, and code review",
      "Delivery outcomes and planning",
      "Onboarding into your systems and practices",
    ],
    domiutraResponsibilities: [
      "Matching skills to your requirements",
      "Performance feedback loop and replacement if needed",
      "Contractual, security, and administrative overhead",
    ],
    strengths: [
      "Fast access to specific skills",
      "Full control stays with your team",
      "Simple to scale for a short period",
    ],
    limitations: [
      "Delivery accountability stays with you",
      "Management overhead lands on your leads",
      "Less continuity than a dedicated team",
    ],
    primary: false,
  },
];
