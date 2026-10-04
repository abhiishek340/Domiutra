import type { Service } from "./types";

export const services: Service[] = [
  {
    slug: "software-engineering",
    number: "01",
    title: "Software Engineering",
    shortTitle: "Engineering",
    pillar: "Build",
    icon: "code",
    summary:
      "Product and platform engineering, from first architecture decision to production-ready releases.",
    tags: ["Web", "APIs", "Platforms", "Teams"],
    headline: "Engineering capacity that ships, not just headcount that bills.",
    intro:
      "We design, build, and extend the software your business runs on: customer-facing applications, internal platforms, APIs, and the integrations between them. You get a team that owns delivery, with U.S.-based leadership accountable for scope, quality, and communication.",
    signals: [
      "Your roadmap is larger than your team, and hiring is too slow to close the gap.",
      "A new product or platform needs a team that can own it end-to-end.",
      "Internal engineers are tied up maintaining what exists instead of building what's next.",
      "You need specialized skills for a defined period without permanent hires.",
    ],
    capabilities: [
      {
        title: "Web applications",
        description:
          "Customer portals, internal tools, and SaaS products built with modern frameworks and a clear component architecture.",
      },
      {
        title: "Backend systems & APIs",
        description:
          "Services, REST and GraphQL APIs, event-driven integrations, and the data models underneath them.",
      },
      {
        title: "Enterprise applications",
        description:
          "Workflow-heavy systems that connect to ERP, CRM, identity, and finance platforms without becoming fragile.",
      },
      {
        title: "Microservices & modular architecture",
        description:
          "Service boundaries drawn around your domain, not around a trend. Sometimes that means a well-structured monolith.",
      },
      {
        title: "Frontend engineering",
        description:
          "Accessible, fast interfaces with design-system discipline, typed contracts, and performance budgets.",
      },
      {
        title: "Mobile, where it fits",
        description:
          "Cross-platform or native mobile clients when your users need them, sharing APIs and release discipline with the rest of the stack.",
      },
    ],
    diagram: {
      key: "engineering",
      title: "From backlog to release",
      steps: ["Backlog", "Design", "Build", "Review", "Test", "Release"],
    },
    deliverables: [
      {
        phase: "First 2 weeks",
        items: [
          "Codebase and architecture review",
          "Working agreement: rituals, tools, decision rights",
          "Delivery plan with first milestones",
        ],
      },
      {
        phase: "First 90 days",
        items: [
          "Production releases on an agreed cadence",
          "CI pipeline with automated test gates",
          "Architecture decision records and runbooks",
        ],
      },
      {
        phase: "Ongoing",
        items: [
          "Sprint reviews with demoable increments",
          "Status, risk, and capacity reporting",
          "Quarterly roadmap and team-shape review",
        ],
      },
    ],
    technologies: [
      { group: "Languages", items: ["TypeScript", "Java", "Python", "Go", "C#", "Kotlin"] },
      { group: "Frameworks", items: ["React", "Next.js", "Angular", "Spring Boot", "Node.js", ".NET"] },
      { group: "Data", items: ["PostgreSQL", "MySQL", "Redis", "Kafka", "MongoDB"] },
      { group: "Delivery", items: ["GitHub Actions", "GitLab CI", "Docker", "Terraform"] },
    ],
    faqs: [
      {
        question: "Do you provide individual developers or full teams?",
        answer:
          "Our default is a team with a delivery lead and clear ownership of outcomes. If you need a specific skill added to your own team, we can do that too, but we'll be clear about which model you're buying.",
      },
      {
        question: "Who owns the code and IP?",
        answer:
          "You do. IP assignment, confidentiality, and repository ownership are set in the services agreement before work begins. We work in your repositories and your tooling wherever possible.",
      },
      {
        question: "How do you handle time-zone differences?",
        answer:
          "We design each team around a required overlap window with your team, and put U.S.-based leadership on the relationship so decisions don't wait overnight.",
      },
      {
        question: "How quickly can a team start?",
        answer:
          "It depends on the skills and security requirements involved. We'll give you a realistic start date during scoping instead of a sales-cycle promise.",
      },
    ],
    cta: { title: "Have a roadmap bigger than your team?", label: "Discuss your roadmap" },
    seo: {
      title: "Software Engineering Services & Dedicated Development Teams",
      description:
        "U.S.-managed software engineering: web applications, APIs, enterprise systems, and dedicated development teams with accountable delivery.",
    },
  },
  {
    slug: "application-modernization",
    number: "02",
    title: "Application Modernization",
    shortTitle: "Modernization",
    pillar: "Modernize",
    icon: "refresh",
    summary:
      "Move legacy systems forward incrementally, without betting the business on a rewrite.",
    tags: ["Legacy", "APIs", "Cloud", "Tests"],
    headline: "Modernize the system without stopping the business.",
    intro:
      "Most legacy systems still do something important. We assess what you have, decide what to keep, and modernize in increments: carving out domains, wrapping them in stable APIs, adding test coverage, and moving them to infrastructure that's easier to change.",
    signals: [
      "Small changes take weeks because nobody is confident about side effects.",
      "The system runs on platforms or versions that are expensive or hard to support.",
      "Key knowledge sits with a few people, and that risk keeps growing.",
      "You need cloud, API, or data capabilities the current architecture can't support.",
    ],
    capabilities: [
      {
        title: "Legacy assessment",
        description:
          "Code, architecture, dependency, and operational review that ends with a prioritized plan and a business case, not a slide deck.",
      },
      {
        title: "Monolith to modular",
        description:
          "Identify domain boundaries, untangle dependencies, and extract modules or services where it pays off.",
      },
      {
        title: "API modernization",
        description:
          "Stable, versioned APIs in front of legacy logic, so new products can move without waiting on the core.",
      },
      {
        title: "Cloud migration",
        description:
          "Rehost, replatform, or refactor, chosen per workload based on cost, risk, and the value of the change.",
      },
      {
        title: "Performance & technical debt",
        description:
          "Profiling, query and caching work, and targeted refactoring where it reduces incidents or cycle time.",
      },
      {
        title: "Testing modernization",
        description:
          "Characterization tests around legacy behavior, then automated suites that make every later change safer.",
      },
    ],
    diagram: {
      key: "modernization",
      title: "An incremental modernization path",
      steps: [
        "Legacy system",
        "Assessment",
        "Target architecture",
        "Domain & API decomposition",
        "Cloud migration",
        "Automated testing",
        "Production",
        "Continuous optimization",
      ],
    },
    deliverables: [
      {
        phase: "Assessment",
        items: [
          "System and dependency map",
          "Risk register and modernization options",
          "Sequenced roadmap with a business case",
        ],
      },
      {
        phase: "First increments",
        items: [
          "Characterization test harness",
          "First domain extracted behind an API",
          "CI/CD and environment parity",
        ],
      },
      {
        phase: "Steady state",
        items: [
          "Strangler-pattern migration by domain",
          "Decommissioning plan for legacy components",
          "Run-cost and change-lead-time tracking",
        ],
      },
    ],
    technologies: [
      { group: "Common sources", items: ["Java EE", ".NET Framework", "PHP", "Oracle", "On-prem VMs"] },
      { group: "Common targets", items: ["Java", "Spring Boot", "Node.js", "Python", "React", "Angular"] },
      { group: "Data", items: ["PostgreSQL", "Kafka", "Change data capture"] },
      { group: "Platform", items: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform"] },
    ],
    faqs: [
      {
        question: "Do we have to rewrite everything?",
        answer:
          "Rarely. Most modernization works best incrementally: stabilize, add tests, extract the highest-value domains, and retire legacy parts as their replacements prove themselves.",
      },
      {
        question: "How do you avoid disrupting operations?",
        answer:
          "We run old and new paths side by side, release behind feature flags, and keep rollback plans for every cutover. Business-critical flows get the most conservative treatment.",
      },
      {
        question: "Can you work with poorly documented systems?",
        answer:
          "Yes. Discovery includes reading the code, tracing production behavior, and interviewing the people who know it. We document as we go, so the knowledge stops living in one person's head.",
      },
      {
        question: "How do we know modernization is worth it?",
        answer:
          "The assessment ends with a business case that compares the cost of staying put (incidents, change lead time, licensing, support risk) against the cost and risk of each option.",
      },
    ],
    cta: { title: "Not sure where to start with a legacy system?", label: "Request a modernization assessment" },
    seo: {
      title: "Application Modernization & Legacy System Migration",
      description:
        "Incremental application modernization: legacy assessment, monolith decomposition, API modernization, cloud migration, and automated testing.",
    },
  },
  {
    slug: "cloud-devops",
    number: "03",
    title: "Cloud & DevOps",
    shortTitle: "Cloud & DevOps",
    pillar: "Modernize",
    icon: "cloud",
    summary:
      "Cloud architecture, infrastructure as code, and delivery pipelines your team can trust.",
    tags: ["AWS", "Azure", "IaC", "K8s"],
    headline: "Infrastructure that's repeatable, observable, and affordable to run.",
    intro:
      "We design and operate cloud platforms on AWS and Azure with everything defined as code: environments, pipelines, policies, and monitoring. The goal is a platform your engineers can ship to safely every day, at a cost you can explain.",
    signals: [
      "Deployments are manual, slow, or depend on one person.",
      "Cloud spend keeps growing and nobody can say exactly why.",
      "Environments drift, so what works in staging breaks in production.",
      "You're planning a migration and want it done once, properly.",
    ],
    capabilities: [
      {
        title: "Cloud migration",
        description:
          "Workload-by-workload migration plans with landing zones, networking, identity, and cutover runbooks.",
      },
      {
        title: "Platform engineering",
        description:
          "Internal platforms and golden paths that let product teams provision and deploy without filing tickets.",
      },
      {
        title: "Infrastructure as code",
        description:
          "Terraform or native tooling, reviewed and versioned like application code, with policy checks in the pipeline.",
      },
      {
        title: "CI/CD",
        description:
          "Pipelines with build, test, security, and deployment stages, plus progressive delivery where it reduces risk.",
      },
      {
        title: "Kubernetes",
        description:
          "Cluster design, workload migration, autoscaling, and upgrades, used where container orchestration earns its complexity.",
      },
      {
        title: "Observability",
        description:
          "Metrics, logs, traces, and service-level objectives that tell you what's broken and why.",
      },
      {
        title: "FinOps",
        description:
          "Cost allocation, tagging, rightsizing, and commitment planning, so spend maps to teams and products.",
      },
      {
        title: "Cloud security",
        description:
          "Identity and least-privilege access, secrets management, network boundaries, and continuous configuration checks.",
      },
    ],
    diagram: {
      key: "cloud",
      title: "Code to production",
      steps: ["Code", "CI/CD", "Infrastructure as code", "Cloud", "Kubernetes", "Observability", "Production"],
    },
    deliverables: [
      {
        phase: "Foundation",
        items: [
          "Cloud and pipeline assessment",
          "Landing zone and account structure",
          "Infrastructure-as-code baseline",
        ],
      },
      {
        phase: "Delivery",
        items: [
          "CI/CD with automated quality and security gates",
          "Environment parity across dev, staging, production",
          "Dashboards, alerts, and SLOs for key services",
        ],
      },
      {
        phase: "Operations",
        items: [
          "Monthly cost and reliability review",
          "Patch and upgrade cadence",
          "Runbooks and incident playbooks",
        ],
      },
    ],
    technologies: [
      { group: "Cloud", items: ["AWS", "Azure", "Google Cloud"] },
      { group: "IaC & config", items: ["Terraform", "OpenTofu", "Pulumi", "Ansible", "Helm"] },
      { group: "Delivery", items: ["GitHub Actions", "GitLab CI", "Azure DevOps", "Argo CD"] },
      { group: "Observability", items: ["OpenTelemetry", "Prometheus", "Grafana", "Datadog", "CloudWatch"] },
    ],
    faqs: [
      {
        question: "Which cloud providers do you work with?",
        answer:
          "Most of our work is on AWS and Azure, with Google Cloud where a customer is already invested. We recommend based on your existing contracts, skills, and workloads, not on preference.",
      },
      {
        question: "Do we need Kubernetes?",
        answer:
          "Not always. For many workloads, managed container services or serverless platforms are simpler and cheaper. We'll recommend Kubernetes when the operational trade-off is justified.",
      },
      {
        question: "Can you reduce our cloud costs?",
        answer:
          "We start by making spend visible and attributable, then address rightsizing, idle resources, storage tiers, and commitments. We'll quantify opportunities after looking at your actual usage, not before.",
      },
      {
        question: "Will our team be able to run it afterwards?",
        answer:
          "That's the point of infrastructure as code and documented runbooks. We can hand over fully, or continue operating the platform under a managed services agreement.",
      },
    ],
    cta: { title: "Want deployments that feel boring, in a good way?", label: "Review your cloud setup with us" },
    seo: {
      title: "Cloud & DevOps Services: Migration, IaC, CI/CD, Kubernetes",
      description:
        "Cloud and DevOps services on AWS and Azure: migration, platform engineering, infrastructure as code, CI/CD, Kubernetes, observability, and FinOps.",
    },
  },
  {
    slug: "ai-data",
    number: "04",
    title: "AI & Data",
    shortTitle: "AI & Data",
    pillar: "Build",
    icon: "brain",
    summary:
      "Data foundations and AI capabilities designed around measurable business workflows.",
    tags: ["LLMs", "Agents", "Pipelines", "Analytics"],
    headline: "AI that fits into how the business already works.",
    intro:
      "We treat AI as an engineering discipline: start with a workflow worth improving, get the data right, build with evaluation and human review in the loop, and integrate with the systems people already use. Some problems need a model. Many need better data and automation first.",
    signals: [
      "Leadership wants an AI plan, and you need one grounded in real use cases.",
      "Teams spend hours on document-heavy or repetitive work that follows clear rules.",
      "Data is spread across systems, and reporting depends on spreadsheets.",
      "A proof of concept worked in a demo but isn't ready for production.",
    ],
    capabilities: [
      {
        title: "AI strategy",
        description:
          "Use-case discovery and prioritization by value, feasibility, data readiness, and risk, ending with a delivery plan.",
      },
      {
        title: "AI application development",
        description:
          "Production applications with retrieval, structured outputs, evaluation suites, and proper error handling.",
      },
      {
        title: "LLM integration",
        description:
          "Connect language models to your systems, documents, and permissions model with guardrails and audit trails.",
      },
      {
        title: "AI agents",
        description:
          "Tool-using agents for bounded, observable workflows, with human approval at the steps that matter.",
      },
      {
        title: "Data engineering",
        description:
          "Pipelines, warehouses, and lakehouses with tested transformations, lineage, and data contracts.",
      },
      {
        title: "Analytics",
        description:
          "Semantic layers, dashboards, and metrics definitions that finance and operations agree on.",
      },
      {
        title: "Automation",
        description:
          "Workflow automation across systems, with AI used only for the steps that need judgment on unstructured input.",
      },
      {
        title: "AI governance",
        description:
          "Model and vendor selection, data handling, evaluation, monitoring, and usage policies matched to your risk profile.",
      },
    ],
    diagram: {
      key: "ai",
      title: "A governed AI workflow",
      steps: ["Data", "Model / Agent", "Workflow", "Human review", "Business system", "Outcome"],
    },
    deliverables: [
      {
        phase: "Discovery",
        items: [
          "Use-case inventory and scoring",
          "Data readiness assessment",
          "Risk and governance considerations",
        ],
      },
      {
        phase: "Pilot",
        items: [
          "Working pilot on real (approved) data",
          "Evaluation set and quality baseline",
          "Cost-per-task and latency profile",
        ],
      },
      {
        phase: "Production",
        items: [
          "Integration with business systems",
          "Monitoring, feedback loops, and drift checks",
          "Runbooks and ownership model",
        ],
      },
    ],
    technologies: [
      { group: "Models", items: ["Hosted LLM APIs", "Open-weight models", "Embedding models"] },
      { group: "AI engineering", items: ["Python", "TypeScript", "Vector databases", "Evaluation harnesses"] },
      { group: "Data", items: ["dbt", "Airflow", "Spark", "Snowflake", "Databricks", "BigQuery"] },
      { group: "Analytics", items: ["Power BI", "Looker", "Tableau", "Metabase"] },
    ],
    faqs: [
      {
        question: "Where should we start with AI?",
        answer:
          "With a specific workflow, a measurable cost or delay, and data you're allowed to use. We help you find two or three of those and test them quickly before committing to a platform.",
      },
      {
        question: "How do you handle data privacy with AI tools?",
        answer:
          "Data handling is decided per use case: which data can leave your environment, which providers are approved, retention settings, and access controls. Sensitive workloads can use private deployments.",
      },
      {
        question: "How do you measure whether AI is working?",
        answer:
          "Every AI feature ships with an evaluation set, quality thresholds, and business metrics such as time per task, error rates, or escalation rates, defined before the build starts.",
      },
      {
        question: "Do you use AI in your own engineering?",
        answer:
          "Yes, where it helps: code assistance, test generation, documentation, migration tooling, and operational triage. Every AI-assisted change is still reviewed by an engineer and covered by the same quality gates, and we follow your policies on AI tool use.",
      },
    ],
    cta: { title: "Have a workflow AI could actually improve?", label: "Explore an AI use case" },
    seo: {
      title: "AI Engineering & Data Services: LLMs, Agents, Data Platforms",
      description:
        "AI and data engineering services: AI strategy, LLM integration, AI agents, data engineering, analytics, automation, and AI governance.",
    },
  },
  {
    slug: "managed-services",
    number: "05",
    title: "Managed Technology Services",
    shortTitle: "Managed Services",
    pillar: "Operate",
    icon: "activity",
    summary:
      "Ongoing ownership of applications and cloud operations, with agreed service levels.",
    tags: ["Support", "SRE", "Incidents", "SLAs"],
    headline: "Someone accountable for the system after launch.",
    intro:
      "We take ongoing operational responsibility for applications and infrastructure: monitoring, incident response, maintenance, releases, and continuous improvement. Coverage hours, response targets, and escalation paths are agreed up front and reported on every month.",
    signals: [
      "Your engineers lose days to support tickets and production issues.",
      "Critical applications have no clear owner after the original team moved on.",
      "Incidents are found by customers before monitoring catches them.",
      "You need predictable support costs and clear service levels.",
    ],
    capabilities: [
      {
        title: "Application support",
        description:
          "Tiered support for business applications, from user issues to code-level fixes, with a shared ticket history.",
      },
      {
        title: "Production support",
        description:
          "Monitoring-driven detection, triage, and resolution for the systems your customers depend on.",
      },
      {
        title: "Incident response",
        description:
          "Defined severity levels, escalation paths, communications, and blameless post-incident reviews.",
      },
      {
        title: "Cloud operations",
        description:
          "Patching, backups, capacity, cost hygiene, and configuration management across environments.",
      },
      {
        title: "DevOps operations",
        description:
          "Pipeline upkeep, dependency updates, and platform improvements that keep delivery fast.",
      },
      {
        title: "Monitoring",
        description:
          "Alerting tuned to symptoms users feel, with dashboards that the business can read too.",
      },
      {
        title: "Release management",
        description:
          "Planned, communicated, reversible releases with change records where your controls require them.",
      },
      {
        title: "Service levels",
        description:
          "Response and resolution targets, coverage windows, and reporting designed around your required coverage.",
      },
    ],
    diagram: {
      key: "operations",
      title: "The operating loop",
      steps: ["Observe", "Detect", "Triage", "Resolve", "Learn", "Optimize"],
    },
    deliverables: [
      {
        phase: "Transition",
        items: [
          "Knowledge transfer and system documentation",
          "Monitoring and alert baseline",
          "Agreed service levels and escalation matrix",
        ],
      },
      {
        phase: "Run",
        items: [
          "Ticket and incident handling to agreed targets",
          "Scheduled maintenance and patching",
          "Release support",
        ],
      },
      {
        phase: "Improve",
        items: [
          "Monthly service report",
          "Problem management for recurring issues",
          "Quarterly improvement roadmap",
        ],
      },
    ],
    technologies: [
      { group: "ITSM", items: ["ServiceNow", "Jira Service Management", "Zendesk"] },
      { group: "Monitoring", items: ["Datadog", "Grafana", "New Relic", "CloudWatch", "Azure Monitor"] },
      { group: "On-call", items: ["PagerDuty", "Opsgenie", "incident.io"] },
      { group: "Platforms", items: ["AWS", "Azure", "Kubernetes", "Linux", "Windows Server"] },
    ],
    faqs: [
      {
        question: "Do you offer 24/7 support?",
        answer:
          "Support models are designed around your required coverage. Some systems need business-hours support with on-call escalation; others need continuous coverage. We scope and price each honestly.",
      },
      {
        question: "Can you support systems you didn't build?",
        answer:
          "Yes. Most managed engagements start with a transition phase where we document the system, set up monitoring, and shadow your team before taking primary responsibility.",
      },
      {
        question: "How are service levels reported?",
        answer:
          "Monthly reports cover volumes, response and resolution times against targets, incidents, root causes, and the improvements we recommend or have made.",
      },
      {
        question: "What if we want to bring support back in-house later?",
        answer:
          "Everything we produce, from runbooks to dashboards, belongs to you. Exit and transition-back terms are part of the agreement from day one.",
      },
    ],
    cta: { title: "Need someone to own production?", label: "Design a support model" },
    seo: {
      title: "Managed Technology Services: Application & Cloud Operations",
      description:
        "Managed technology services: application support, production support, incident response, cloud and DevOps operations, monitoring, and SLA-based support.",
    },
  },
  {
    slug: "qa-automation",
    number: "06",
    title: "QA & Test Automation",
    shortTitle: "QA & Automation",
    pillar: "Build",
    icon: "flask",
    summary:
      "Quality engineering that makes every release safer and every change cheaper.",
    tags: ["Playwright", "API", "Perf", "CI"],
    headline: "Release with evidence, not hope.",
    intro:
      "We build test strategies and automation that run inside your delivery pipeline: end-to-end, API, regression, and performance testing. The aim is fast feedback for engineers and clear release confidence for the business.",
    signals: [
      "Releases need days of manual regression testing.",
      "The same bugs keep coming back after they're fixed.",
      "Test suites are flaky, so people have stopped trusting them.",
      "You've never load-tested the system you're about to scale.",
    ],
    capabilities: [
      {
        title: "Test strategy",
        description:
          "A risk-based test pyramid that puts the right checks at the right layer, instead of automating everything end-to-end.",
      },
      {
        title: "End-to-end automation",
        description:
          "Playwright suites for critical user journeys, built for stability and readable failures.",
      },
      {
        title: "API testing",
        description:
          "Contract and integration tests that catch breaking changes before they reach consumers.",
      },
      {
        title: "Regression testing",
        description:
          "Automated regression packs that turn multi-day manual cycles into pipeline stages.",
      },
      {
        title: "Performance testing",
        description:
          "Load, stress, and soak tests against realistic scenarios, with results tied to capacity decisions.",
      },
      {
        title: "CI test integration",
        description:
          "Parallelized, quarantined-flake-aware test stages with reporting your engineers actually read.",
      },
    ],
    diagram: {
      key: "quality",
      title: "Quality gates in the pipeline",
      steps: ["Commit", "Unit", "API & contract", "End-to-end", "Performance", "Release"],
    },
    deliverables: [
      {
        phase: "Assess",
        items: ["Quality and test-coverage review", "Risk-based test strategy", "Tooling recommendation"],
      },
      {
        phase: "Automate",
        items: ["Critical-path E2E and API suites", "CI integration with reporting", "Test data approach"],
      },
      {
        phase: "Sustain",
        items: ["Flake tracking and suite health", "Performance baselines", "Coverage of new features as they ship"],
      },
    ],
    technologies: [
      { group: "E2E & UI", items: ["Playwright", "Cypress", "Selenium"] },
      { group: "API", items: ["Postman", "REST Assured", "Pact", "k6"] },
      { group: "Performance", items: ["k6", "JMeter", "Gatling", "Locust"] },
      { group: "Unit", items: ["Jest", "Vitest", "JUnit", "pytest"] },
    ],
    faqs: [
      {
        question: "Should we automate all of our tests?",
        answer:
          "No. Automate what's repeatable and high-risk, keep exploratory testing for what needs human judgment, and push most checks down to fast unit and API layers.",
      },
      {
        question: "Can you fix our flaky test suite?",
        answer:
          "Usually. We find the root causes (timing, shared state, test data, environment) and fix or quarantine tests so the suite becomes a signal again.",
      },
      {
        question: "Do you work alongside our developers?",
        answer:
          "Yes. Quality engineering works best embedded in the delivery team, with developers owning tests for their code and QA engineers owning strategy, tooling, and the hard cases.",
      },
    ],
    cta: { title: "Want releases you don't have to babysit?", label: "Talk about test automation" },
    seo: {
      title: "QA & Test Automation Services: Playwright, API & Performance Testing",
      description:
        "Quality engineering and test automation: Playwright end-to-end testing, API testing, regression automation, performance testing, and CI integration.",
    },
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function servicesByPillar(pillar: Service["pillar"]): Service[] {
  return services.filter((s) => s.pillar === pillar);
}
