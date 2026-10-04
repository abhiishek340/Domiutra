import type { Industry } from "./types";

export const industries: Industry[] = [
  {
    slug: "financial-services",
    name: "Financial Services",
    icon: "landmark",
    statement:
      "Modernize core platforms and digital channels while keeping auditors, regulators, and customers confident.",
    headline: "Change financial systems without weakening control.",
    intro:
      "Lenders, insurers, wealth managers, and fintechs carry long-lived platforms, strict change control, and rising customer expectations. We help them modernize and extend those systems with the evidence trail their risk and compliance teams expect.",
    pressures: [
      {
        title: "Legacy cores, digital expectations",
        description:
          "Customers expect real-time, self-service experiences that older core systems weren't built to support.",
      },
      {
        title: "Change under scrutiny",
        description:
          "Every release needs traceability, segregation of duties, and an audit trail without slowing delivery to a crawl.",
      },
      {
        title: "Data and model risk",
        description:
          "Analytics and AI are expected to be explainable, governed, and appropriate for the data involved.",
      },
    ],
    howWeHelp: [
      {
        title: "API layers around core systems",
        description:
          "Stable, secured APIs that let digital channels move faster than the core.",
        services: ["application-modernization", "software-engineering"],
      },
      {
        title: "Controlled delivery pipelines",
        description:
          "CI/CD with approvals, change records, and evidence capture built in rather than bolted on.",
        services: ["cloud-devops", "qa-automation"],
      },
      {
        title: "Governed data and AI",
        description:
          "Data pipelines and AI workflows with lineage, access control, human review, and monitoring.",
        services: ["ai-data"],
      },
    ],
    considerations: [
      "Data classification and residency requirements",
      "Segregation of duties in delivery and production access",
      "Vendor risk and third-party oversight expectations",
      "Model risk management for analytics and AI",
    ],
    hasPage: true,
    seo: {
      title: "Technology Services for Financial Services",
      description:
        "Software engineering, modernization, cloud, and data services for banks, lenders, insurers, and fintechs, with delivery built for audit and control.",
    },
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    icon: "heart",
    statement:
      "Connect clinical and operational systems, reduce administrative load, and protect sensitive data.",
    headline: "Technology that lightens the load on care teams.",
    intro:
      "Providers, payers, and health-tech companies run on fragmented systems and heavy administrative work. We build integrations, applications, and automation that reduce friction, with privacy and security requirements designed in from the first conversation.",
    pressures: [
      {
        title: "Fragmented systems",
        description:
          "Clinical, scheduling, billing, and patient-facing systems rarely share data cleanly.",
      },
      {
        title: "Administrative burden",
        description:
          "Staff spend significant time on documentation, intake, and claims work that follows predictable rules.",
      },
      {
        title: "Sensitive data",
        description:
          "Protected health information demands strict access control, logging, and vendor diligence.",
      },
    ],
    howWeHelp: [
      {
        title: "Interoperability and integration",
        description:
          "Integrations using HL7 and FHIR-based APIs where systems support them, with monitoring and error handling.",
        services: ["software-engineering", "application-modernization"],
      },
      {
        title: "Workflow automation",
        description:
          "Automation and AI-assisted document handling with human review for anything that affects care or coverage.",
        services: ["ai-data"],
      },
      {
        title: "Reliable operations",
        description:
          "Managed support for patient-facing and operational applications with defined service levels.",
        services: ["managed-services", "cloud-devops"],
      },
    ],
    considerations: [
      "HIPAA obligations and business associate agreements, where applicable",
      "Minimum-necessary access to protected health information",
      "Audit logging and access reviews",
      "Clinical safety review for any AI-assisted workflow",
    ],
    hasPage: true,
    seo: {
      title: "Technology Services for Healthcare Organizations",
      description:
        "Healthcare software engineering, integration, automation, and managed services, designed around privacy, security, and care-team workflows.",
    },
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    icon: "factory",
    statement:
      "Modernize operational systems, integrate data, and connect technology across the business.",
    headline: "Connect the plant floor to the rest of the business.",
    intro:
      "Manufacturers often run on decades-old operational software, disconnected plant data, and ERP customizations nobody wants to touch. We help connect, modernize, and extend those systems so operations, supply chain, and finance work from the same information.",
    pressures: [
      {
        title: "Aging operational software",
        description:
          "Custom MES, quality, and scheduling applications that are critical but difficult to change.",
      },
      {
        title: "Disconnected data",
        description:
          "Machine, quality, inventory, and ERP data live in separate places, so decisions lag reality.",
      },
      {
        title: "Thin internal IT",
        description:
          "Small IT teams are stretched across infrastructure, support, and every new initiative.",
      },
    ],
    howWeHelp: [
      {
        title: "Operational system modernization",
        description:
          "Incremental modernization of plant and back-office applications with minimal disruption to production.",
        services: ["application-modernization"],
      },
      {
        title: "Data integration and analytics",
        description:
          "Pipelines that bring operational and ERP data together for reporting, planning, and quality analysis.",
        services: ["ai-data"],
      },
      {
        title: "Extended IT capacity",
        description:
          "Engineering and managed support that lets a lean internal team focus on priorities.",
        services: ["software-engineering", "managed-services"],
      },
    ],
    considerations: [
      "Production uptime and maintenance windows",
      "Separation between operational technology and IT networks",
      "ERP integration and customization strategy",
      "Export-control or customer-specific data requirements",
    ],
    hasPage: true,
    seo: {
      title: "Technology Services for Manufacturers",
      description:
        "Manufacturing technology services: operational system modernization, ERP and plant data integration, analytics, and managed IT support.",
    },
  },
  {
    slug: "technology",
    name: "Technology & SaaS",
    icon: "cpu",
    statement:
      "Add senior engineering capacity to ship roadmap faster without diluting your team's standards.",
    headline: "More roadmap, same engineering standards.",
    intro:
      "Software companies need to ship faster than hiring allows, while keeping architecture, quality, and security at the level customers expect. We add accountable engineering capacity that works inside your practices, not around them.",
    pressures: [
      {
        title: "Roadmap pressure",
        description:
          "Commitments to customers and investors outpace what the current team can deliver.",
      },
      {
        title: "Platform scale",
        description:
          "Growth exposes performance, reliability, and multi-tenancy limits in the original architecture.",
      },
      {
        title: "Customer security reviews",
        description:
          "Enterprise customers ask detailed questions about how code is built, tested, and accessed.",
      },
    ],
    howWeHelp: [
      {
        title: "Dedicated product teams",
        description:
          "Cross-functional teams that own features or platform areas inside your rituals and tooling.",
        services: ["software-engineering"],
      },
      {
        title: "Platform and reliability",
        description:
          "Infrastructure, observability, and performance work so growth doesn't turn into incidents.",
        services: ["cloud-devops", "managed-services"],
      },
      {
        title: "AI features",
        description:
          "AI-powered product capabilities with evaluation, cost control, and safe rollout.",
        services: ["ai-data", "qa-automation"],
      },
    ],
    considerations: [
      "Fit with your engineering culture, rituals, and review standards",
      "Access model for source code and production",
      "Support for your customers' security questionnaires",
      "Clear ownership boundaries between teams",
    ],
    hasPage: true,
    seo: {
      title: "Engineering Services for Technology & SaaS Companies",
      description:
        "Dedicated engineering teams, platform engineering, and AI feature development for software and SaaS companies.",
    },
  },
  {
    slug: "logistics",
    name: "Logistics & Supply Chain",
    icon: "truck",
    statement:
      "Integrate partners, improve visibility, and keep time-critical systems running.",
    headline: "Visibility and reliability for systems that move things.",
    intro:
      "Logistics runs on integrations: carriers, warehouses, customers, customs, and internal systems exchanging data around the clock. We build and operate the integrations, applications, and data pipelines that keep shipments and information moving together.",
    pressures: [
      {
        title: "Integration sprawl",
        description:
          "EDI, APIs, files, and portals from dozens of partners, each with its own failure modes.",
      },
      {
        title: "Visibility gaps",
        description:
          "Customers expect real-time status, but data arrives late, incomplete, or inconsistent.",
      },
      {
        title: "Always-on operations",
        description:
          "Outages in warehouse or transport systems stop physical work, not just screens.",
      },
    ],
    howWeHelp: [
      {
        title: "Integration platforms",
        description:
          "Monitored, retry-safe partner integrations with clear error queues and alerting.",
        services: ["software-engineering", "cloud-devops"],
      },
      {
        title: "Visibility and data",
        description:
          "Event pipelines and analytics that turn partner signals into usable status and exceptions.",
        services: ["ai-data"],
      },
      {
        title: "Operational support",
        description:
          "Managed support aligned to operating hours, peak seasons, and partner cut-off times.",
        services: ["managed-services"],
      },
    ],
    considerations: [
      "Peak-season capacity planning and change freezes",
      "Partner onboarding and integration standards",
      "Support coverage aligned to operating hours",
      "Exception handling and escalation paths",
    ],
    hasPage: true,
    seo: {
      title: "Technology Services for Logistics & Supply Chain",
      description:
        "Logistics technology services: partner integrations, supply-chain visibility, data pipelines, and managed support for time-critical systems.",
    },
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    icon: "briefcase",
    statement:
      "Automate knowledge work and connect client-facing systems without disrupting billable teams.",
    headline: "Give expert teams back their time.",
    intro:
      "Firms built on expertise lose hours to manual processes, disconnected practice systems, and reporting. We help automate the repetitive work, connect client-facing and back-office systems, and introduce AI carefully where judgment and confidentiality matter.",
    pressures: [
      {
        title: "Manual knowledge work",
        description:
          "Document assembly, intake, and reporting consume time that should go to client work.",
      },
      {
        title: "System fragmentation",
        description:
          "CRM, practice management, billing, and document systems that don't talk to each other.",
      },
      {
        title: "Confidentiality",
        description:
          "Client data and privileged information need strict handling, especially with AI tools.",
      },
    ],
    howWeHelp: [
      {
        title: "Workflow automation",
        description:
          "Automated intake, document workflows, and reporting with review steps where accuracy matters.",
        services: ["ai-data"],
      },
      {
        title: "Connected systems",
        description:
          "Integrations and internal tools that remove duplicate entry across practice systems.",
        services: ["software-engineering"],
      },
      {
        title: "Managed applications",
        description:
          "Ongoing support for the internal platforms that client teams depend on.",
        services: ["managed-services"],
      },
    ],
    considerations: [
      "Client confidentiality and matter-level access control",
      "Approved AI tools and data-handling policies",
      "Records retention obligations",
      "Change adoption for fee-earning staff",
    ],
    hasPage: true,
    seo: {
      title: "Technology Services for Professional Services Firms",
      description:
        "Workflow automation, system integration, and managed applications for professional services firms, with confidentiality designed in.",
    },
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}
