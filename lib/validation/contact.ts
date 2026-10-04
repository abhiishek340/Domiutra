import { z } from "zod";

/** Shared by the client form (instant feedback) and the API route (authoritative). */

export const interestOptions = {
  "software-engineering": "Software Engineering",
  "application-modernization": "Application Modernization",
  "cloud-devops": "Cloud & DevOps",
  "ai-data": "AI & Data",
  "managed-services": "Managed Services",
  "qa-automation": "QA & Automation",
  other: "Other",
} as const;

export const teamSizeOptions = {
  "not-sure": "Not sure yet",
  "1-3": "1–3 people",
  "4-8": "4–8 people",
  "9-20": "9–20 people",
  "20+": "More than 20",
} as const;

export const timelineOptions = {
  exploring: "Just exploring",
  "0-1": "Within a month",
  "1-3": "1–3 months",
  "3-6": "3–6 months",
  "6+": "6+ months",
} as const;

type Keys<T> = [keyof T & string, ...(keyof T & string)[]];
const keys = <T extends object>(o: T) => Object.keys(o) as Keys<T>;

const name = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `Enter your ${label}.`)
    .max(80, `${label[0]?.toUpperCase()}${label.slice(1)} must be 80 characters or fewer.`);

export const contactSchema = z.object({
  firstName: name("first name"),
  lastName: name("last name"),
  email: z
    .string()
    .trim()
    .min(1, "Enter your work email.")
    .max(254, "Email is too long.")
    .pipe(z.email("Enter a valid email address, like name@company.com.")),
  company: z.string().trim().min(1, "Enter your company name.").max(120, "Company must be 120 characters or fewer."),
  role: z.string().trim().max(120, "Role must be 120 characters or fewer.").optional().or(z.literal("")),
  interest: z.enum(keys(interestOptions), { error: "Choose what you’re looking for." }),
  teamSize: z.enum(keys(teamSizeOptions)).optional().or(z.literal("")),
  timeline: z.enum(keys(timelineOptions)).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a bit more: at least 20 characters.")
    .max(4000, "Message must be 4,000 characters or fewer."),
  /** Honeypot: hidden from people, often filled by bots. Must be empty. */
  website: z.string().max(0).optional().or(z.literal("")),
  /** Epoch ms when the form was rendered, for a minimum fill-time check. */
  startedAt: z.number().int().nonnegative().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Submissions faster than this are almost certainly automated. */
export const MIN_FILL_MS = 2500;
