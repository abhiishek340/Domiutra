import type { ContactInput } from "@/lib/validation/contact";
import { interestOptions } from "@/lib/validation/contact";

/**
 * Optional CRM forwarding. Each adapter is enabled by its own env vars and
 * runs best-effort after the email is sent. Add Salesforce, Pipedrive, etc.
 * by implementing `CrmAdapter` and adding it to `adapters`.
 */
export type CrmAdapter = {
  name: string;
  enabled: () => boolean;
  send: (input: ContactInput) => Promise<void>;
};

const hubspot: CrmAdapter = {
  name: "hubspot",
  enabled: () => Boolean(process.env.HUBSPOT_ACCESS_TOKEN?.trim()),
  async send(input) {
    const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          email: input.email,
          firstname: input.firstName,
          lastname: input.lastName,
          company: input.company,
          jobtitle: input.role || undefined,
          message: `[${interestOptions[input.interest]}] ${input.message}`.slice(0, 5000),
        },
      }),
    });
    // 409 = contact already exists; acceptable for a lead form.
    if (!res.ok && res.status !== 409) throw new Error(`HubSpot responded ${res.status}`);
  },
};

const adapters: CrmAdapter[] = [hubspot];

export async function forwardToCrm(input: ContactInput): Promise<void> {
  await Promise.all(
    adapters
      .filter((a) => a.enabled())
      .map(async (a) => {
        try {
          await a.send(input);
        } catch (err) {
          console.error(`[contact] CRM adapter "${a.name}" failed:`, err);
        }
      }),
  );
}
