/**
 * Business configuration. Everything that is a real-world fact about the
 * company (contact details, social accounts, scheduling links) comes from the
 * environment so nothing is invented in source. Unset values are hidden in UI.
 */

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

function optional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export const site = {
  name: "Domiutra",
  wordmark: "DOMIUTRA",
  tagline: "Build. Modernize. Operate.",
  positioning: "U.S.-managed. Globally delivered. Built for outcomes.",
  description:
    "Domiutra helps U.S. companies build, modernize, and operate technology through U.S.-managed engineering and global delivery: software engineering, application modernization, cloud and DevOps, AI and data, managed services, and QA automation.",
  url: resolveSiteUrl(),
  /** Public contact email shown on the site. Optional. */
  publicEmail: optional(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  /** Booking link (Calendly, HubSpot Meetings, Cal.com…). Optional. */
  schedulingUrl: optional(process.env.NEXT_PUBLIC_SCHEDULING_URL),
  social: {
    linkedin: optional(process.env.NEXT_PUBLIC_LINKEDIN_URL),
    github: optional(process.env.NEXT_PUBLIC_GITHUB_URL),
    x: optional(process.env.NEXT_PUBLIC_X_URL),
  },
} as const;

export function absoluteUrl(path = "/"): string {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
