import { services } from "./services";

export type NavLink = { label: string; href: string; description?: string };

export const primaryNav: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "How we work", href: "/delivery-model" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
];

const serviceLink = (slug: string): NavLink => {
  const s = services.find((x) => x.slug === slug);
  if (!s) throw new Error(`Unknown service in navigation: ${slug}`);
  return { label: s.title, href: `/services/${s.slug}`, description: s.summary };
};

/** Services mega-menu, grouped by the Build / Modernize / Operate narrative. */
export const servicesMenu: { heading: string; caption: string; links: NavLink[] }[] = [
  {
    heading: "Build",
    caption: "New products, platforms, and capabilities",
    links: [serviceLink("software-engineering"), serviceLink("ai-data"), serviceLink("qa-automation")],
  },
  {
    heading: "Modernize",
    caption: "Move existing systems forward",
    links: [serviceLink("application-modernization"), serviceLink("cloud-devops")],
  },
  {
    heading: "Operate",
    caption: "Keep critical systems healthy",
    links: [serviceLink("managed-services")],
  },
  {
    heading: "Explore",
    caption: "More from Domiutra",
    links: [
      { label: "All services", href: "/services" },
      { label: "Engagement models", href: "/engagement-models" },
      { label: "Representative work", href: "/work" },
      { label: "Security", href: "/security" },
    ],
  },
];

export const footerNav = {
  Services: services.map((s) => ({ label: s.title, href: `/services/${s.slug}` })),
  Company: [
    { label: "About", href: "/about" },
    { label: "How we work", href: "/delivery-model" },
    { label: "Engagement models", href: "/engagement-models" },
    { label: "Work", href: "/work" },
    { label: "Insights", href: "/insights" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
} satisfies Record<string, NavLink[]>;

export const legalNav: NavLink[] = [
  { label: "Security", href: "/security" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
];
