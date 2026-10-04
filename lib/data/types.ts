/**
 * Content types shared across the site. Data lives in `lib/data/*` as typed
 * objects (services, industries, case studies…) and long-form writing lives in
 * `content/*` as MDX. Adding an entry to a data file creates its page,
 * navigation link, and sitemap entry automatically.
 */

export type IconName =
  | "code"
  | "refresh"
  | "cloud"
  | "brain"
  | "activity"
  | "flask"
  | "landmark"
  | "heart"
  | "factory"
  | "cpu"
  | "truck"
  | "briefcase"
  | "shield"
  | "workflow"
  | "users"
  | "layers"
  | "gauge";

export type Pillar = "Build" | "Modernize" | "Operate";

export type FAQItem = { question: string; answer: string };

export type DiagramKey =
  | "engineering"
  | "modernization"
  | "cloud"
  | "ai"
  | "operations"
  | "quality";

export type Service = {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  pillar: Pillar;
  icon: IconName;
  /** One-line card summary. */
  summary: string;
  /** Small technical label shown on cards, e.g. "APIs · Platforms · Teams". */
  tags: string[];
  headline: string;
  intro: string;
  /** Situations where a buyer typically needs this service. */
  signals: string[];
  capabilities: { title: string; description: string }[];
  diagram: { key: DiagramKey; title: string; steps: string[] };
  /** What the customer receives, grouped by phase. */
  deliverables: { phase: string; items: string[] }[];
  /** Framed as examples of what we work with, not certifications. */
  technologies: { group: string; items: string[] }[];
  faqs: FAQItem[];
  cta: { title: string; label: string };
  seo: { title: string; description: string };
};

export type Industry = {
  slug: string;
  name: string;
  icon: IconName;
  /** Business-oriented problem statement for cards. */
  statement: string;
  headline: string;
  intro: string;
  pressures: { title: string; description: string }[];
  howWeHelp: { title: string; description: string; services: string[] }[];
  considerations: string[];
  /** Whether a dedicated page exists (false = card only). */
  hasPage: boolean;
  seo: { title: string; description: string };
};

export type CaseStudyKind =
  /** A real, publishable customer engagement. */
  | "client"
  /** An anonymized or illustrative engagement shape. Always labeled. */
  | "representative";

export type CaseStudy = {
  slug: string;
  kind: CaseStudyKind;
  title: string;
  industry: string;
  services: string[];
  summary: string;
  challenge: string;
  approach: string;
  solution: string;
  /** Architecture stages, rendered as a diagram. */
  architecture: string[];
  /**
   * For "client" studies: measured results.
   * For "representative" studies: what success is measured by (no numbers).
   */
  outcomes: string[];
  technologies: string[];
  featured: boolean;
  client?: { name: string; logo?: string; quote?: { text: string; author: string; role: string } };
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  publishedAt: string;
  readingTime: string;
  author?: string;
  featuredImage?: string;
};

export const articleCategories = [
  "AI",
  "Engineering",
  "Cloud",
  "Outsourcing",
  "Modernization",
  "Leadership",
] as const;
export type ArticleCategory = (typeof articleCategories)[number];

export type EngagementModel = {
  slug: string;
  name: string;
  bestFor: string;
  summary: string;
  whenToUse: string[];
  teamStructure: string[];
  commercial: string;
  customerResponsibilities: string[];
  domiutraResponsibilities: string[];
  strengths: string[];
  limitations: string[];
  primary: boolean;
};

export type DeliveryStage = {
  number: string;
  name: string;
  summary: string;
  activities: string[];
  outputs: string[];
  customer: string;
  domiutra: string;
};

export type Job = {
  id: string;
  title: string;
  team: string;
  location: string;
  type: string;
  url: string;
};

export type Leader = {
  name: string;
  role: string;
  bio: string;
  image?: string;
  linkedin?: string;
};
