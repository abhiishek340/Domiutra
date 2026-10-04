import { services } from "../../lib/data/services";
import { industries } from "../../lib/data/industries";
import { caseStudies } from "../../lib/data/case-studies";

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

export const allRoutes = [...staticRoutes, ...serviceRoutes, ...industryRoutes, ...workRoutes];
