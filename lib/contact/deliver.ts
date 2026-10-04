import { Resend } from "resend";
import { interestOptions, teamSizeOptions, timelineOptions, type ContactInput } from "@/lib/validation/contact";
import { forwardToCrm } from "./crm";

export type DeliveryResult =
  | { ok: true }
  | { ok: false; code: "not_configured" | "delivery_failed" };

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.CONTACT_EMAIL?.trim());
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Strip CR/LF so user input can never inject email headers via the subject. */
function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").slice(0, 160);
}

function rows(input: ContactInput): [string, string][] {
  return [
    ["Name", `${input.firstName} ${input.lastName}`],
    ["Email", input.email],
    ["Company", input.company],
    ["Role", input.role || "—"],
    ["Looking for", interestOptions[input.interest]],
    ["Team size", input.teamSize ? teamSizeOptions[input.teamSize] : "—"],
    ["Timeline", input.timeline ? timelineOptions[input.timeline] : "—"],
  ];
}

export function renderEmail(input: ContactInput): { subject: string; text: string; html: string } {
  const subject = oneLine(`New inquiry: ${interestOptions[input.interest]} · ${input.company}`);
  const text = `${rows(input).map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nMessage:\n${input.message}`;
  const html = `
    <div style="font-family:system-ui,sans-serif;font-size:14px;color:#101417">
      <table cellpadding="6" style="border-collapse:collapse">
        ${rows(input)
          .map(([k, v]) => `<tr><td style="color:#4a5258">${escapeHtml(k)}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`)
          .join("")}
      </table>
      <p style="color:#4a5258;margin-top:16px">Message</p>
      <p style="white-space:pre-wrap">${escapeHtml(input.message)}</p>
    </div>`;
  return { subject, text, html };
}

/**
 * Deliver a contact submission. Email (Resend) is the system of record; CRM
 * forwarding is best-effort and never blocks a successful email.
 * Returns `not_configured` when email isn't set up, so the UI can tell the
 * visitor the truth instead of pretending the message was sent.
 */
export async function deliverContact(input: ContactInput): Promise<DeliveryResult> {
  if (!isEmailConfigured()) return { ok: false, code: "not_configured" };

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { subject, text, html } = renderEmail(input);
  const to = (process.env.CONTACT_EMAIL ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || "Domiutra Website <onboarding@resend.dev>";

  try {
    const { error } = await resend.emails.send({ from, to, replyTo: input.email, subject, text, html });
    if (error) {
      console.error("[contact] Resend error:", error.name, error.message);
      return { ok: false, code: "delivery_failed" };
    }
  } catch (err) {
    console.error("[contact] Email delivery threw:", err);
    return { ok: false, code: "delivery_failed" };
  }

  await forwardToCrm(input);
  return { ok: true };
}
