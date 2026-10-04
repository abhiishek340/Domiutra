import { services } from "../../lib/data/services";
import { industries } from "../../lib/data/industries";
import { caseStudies } from "../../lib/data/case-studies";
import { readdirSync } from "node:fs";
import { join } from "node:path";

export const staticRoutes = [
  "/",
  "/services",
  "/industries",
  "/engagement-models",
  "/delivery-model",
  "/security",
  "/work",
  "/insights",
  "/about",
  "/careers",
  "/contact",
  "/privacy",
  "/terms",
  "/accessibility",
];

export const serviceRoutes = services.map((s) => `/services/${s.slug}`);
export const industryRoutes = industries.filter((i) => i.hasPage).map((i) => `/industries/${i.slug}`);
export const workRoutes = caseStudies.map((c) => `/work/${c.slug}`);

export const articleRoutes = readdirSync(join(__dirname, "../../content/insights"))
  .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
  .map((f) => `/insights/${f.replace(/\.mdx$/, "")}`);

export const allRoutes = [...staticRoutes, ...serviceRoutes, ...industryRoutes, ...workRoutes, ...articleRoutes];
