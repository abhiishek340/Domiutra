import type { Leader } from "./types";

/**
 * Leadership team. Intentionally empty until real, approved bios and photos
 * are supplied. The About page renders the leadership section only when this
 * list has entries. Photos go in /public/team/ (square, at least 800px).
 *
 * Example:
 * { name: "Full Name", role: "Chief Executive Officer", bio: "Two or three factual sentences.",
 *   image: "/team/full-name.jpg", linkedin: "https://www.linkedin.com/in/…" }
 */
export const leaders: Leader[] = [];
