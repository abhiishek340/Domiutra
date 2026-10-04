"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, useWatch, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, m } from "motion/react";
import { ChevronDown, CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import {
  contactSchema,
  interestOptions,
  teamSizeOptions,
  timelineOptions,
  type ContactInput,
} from "@/lib/validation/contact";
import type { ContactApiResponse } from "@/app/api/contact/route";
import { BRIEF_HANDOFF_KEY } from "@/lib/brief/format";
import { Button, ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; code: "not_configured" | "rate_limited" | "generic" };

const fieldLabels: Partial<Record<keyof ContactInput, string>> = {
  firstName: "First name",
  lastName: "Last name",
  email: "Work email",
  company: "Company",
  role: "Role",
  interest: "What are you looking for?",
  teamSize: "Approximate team size",
  timeline: "Timeline",
  message: "Message",
};

const inputBase =
  "mt-2 block w-full rounded-sm border border-line-strong bg-ink-900 px-3.5 py-3 hover:border-fg/35 text-[0.95rem] text-fg placeholder:text-fg-subtle transition-colors focus:border-mint focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint aria-[invalid=true]:border-red-400/80";

function Field({
  id,
  label,
  required,
  error,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-baseline justify-between text-sm font-medium text-fg">
        <span>
          {label}
          {required && (
            <span aria-hidden="true" className="ml-0.5 text-mint">
              *
            </span>
          )}
        </span>
        {!required && <span className="text-xs font-normal text-fg-subtle">Optional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-fg-subtle">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm text-red-300">
          <CircleAlert aria-hidden="true" className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm({ publicEmail, schedulingUrl }: { publicEmail?: string; schedulingUrl?: string }) {
  const searchParams = useSearchParams();
  const preset = searchParams.get("service");
  const initialInterest = preset && preset in interestOptions ? (preset as ContactInput["interest"]) : undefined;
  const fromBrief = searchParams.get("from") === "brief";

  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [startedAt] = useState(() => Date.now());
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [summary, setSummary] = useState<(keyof ContactInput)[]>([]);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    // Focus goes to the error summary instead; each entry links to its field.
    shouldFocusError: false,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      role: "",
      interest: initialInterest,
      teamSize: "",
      timeline: "",
      message: "",
      website: "",
    },
  });

  // Arriving from the brief assistant: pre-fill the message and top service once.
  useEffect(() => {
    if (!fromBrief) return;
    try {
      const raw = sessionStorage.getItem(BRIEF_HANDOFF_KEY);
      if (!raw) return;
      const handoff = JSON.parse(raw) as { message?: unknown; service?: unknown };
      if (typeof handoff.message === "string") setValue("message", handoff.message.slice(0, 4000));
      if (typeof handoff.service === "string" && handoff.service in interestOptions) {
        setValue("interest", handoff.service as ContactInput["interest"]);
      }
      sessionStorage.removeItem(BRIEF_HANDOFF_KEY);
    } catch {
      /* storage unavailable or malformed: leave the form empty */
    }
  }, [fromBrief, setValue]);
  const message = useWatch({ control, name: "message" });
  const briefIncluded = fromBrief && (message ?? "").startsWith("Project brief:");

  useEffect(() => {
    if (summary.length) summaryRef.current?.focus();
  }, [summary]);

  useEffect(() => {
    if (status.kind === "success" || status.kind === "error") statusRef.current?.focus();
  }, [status]);

  const onInvalid = (errs: FieldErrors<ContactInput>) => {
    setSummary(Object.keys(errs) as (keyof ContactInput)[]);
  };

  const onSubmit = async (values: ContactInput) => {
    setSummary([]);
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, startedAt }),
      });
      const data = (await res.json().catch(() => null)) as ContactApiResponse | null;

      if (res.ok && data?.ok) {
        setStatus({ kind: "success" });
        reset();
        return;
      }
      if (data && !data.ok && data.error === "invalid" && data.fieldErrors) {
        Object.entries(data.fieldErrors).forEach(([field, messages]) => {
          setError(field as keyof ContactInput, { message: messages[0] });
        });
        setSummary(Object.keys(data.fieldErrors) as (keyof ContactInput)[]);
        setStatus({ kind: "idle" });
        return;
      }
      const code = data && !data.ok && (data.error === "not_configured" || data.error === "rate_limited") ? data.error : "generic";
      setStatus({ kind: "error", code });
    } catch {
      setStatus({ kind: "error", code: "generic" });
    }
  };

  const describedBy = (name: keyof ContactInput, hint?: boolean) =>
    errors[name] ? `${name}-error` : hint ? `${name}-hint` : undefined;

  if (status.kind === "success") {
    return (
      <m.div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-mint/40 bg-mint/[0.06] p-8 outline-none md:p-12"
        data-testid="contact-success"
      >
        <CircleCheck aria-hidden="true" className="size-8 text-mint" />
        <h2 className="mt-6 text-h3 font-semibold">Thanks, your message is on its way.</h2>
        <p className="mt-3 max-w-lg leading-relaxed text-fg-muted">
          A member of our U.S. team will read it and reply by email. If it’s helpful, we’ll suggest a short call to understand the details.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <ButtonLink href="/insights" variant="secondary" arrow>
            Read our insights
          </ButtonLink>
          <Button variant="ghost" onClick={() => setStatus({ kind: "idle" })}>
            Send another message
          </Button>
        </div>
      </m.div>
    );
  }

  const submitting = status.kind === "submitting";

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate aria-describedby="form-required-note" className="space-y-6" data-testid="contact-form">
      <p id="form-required-note" className="text-xs text-fg-subtle">
        Fields marked <span className="text-mint">*</span> are required.
      </p>

      {briefIncluded && (
        <p className="flex items-center gap-2 rounded-md border border-mint/30 bg-mint/[0.06] px-3 py-2 text-sm text-fg" data-testid="brief-included">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-mint" />
          Your AI-drafted brief is included in the message below. Edit it as you like.
        </p>
      )}

      <AnimatePresence>
        {summary.length > 0 && (
          <m.div
            ref={summaryRef}
            tabIndex={-1}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-md border border-red-400/40 bg-red-400/[0.06] outline-none"
          >
            <div className="p-4 text-sm">
              <p className="font-medium text-fg">Please check {summary.length === 1 ? "this field" : `these ${summary.length} fields`}:</p>
              <ul className="mt-2 list-disc pl-5 text-red-200">
                {summary.map((field) => (
                  <li key={field}>
                    <a
                      href={`#${field}`}
                      className="underline underline-offset-2 hover:text-fg"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(field)?.focus();
                      }}
                    >
                      {fieldLabels[field] ?? field}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="firstName" label="First name" required error={errors.firstName?.message}>
          <input id="firstName" autoComplete="given-name" className={inputBase} aria-invalid={Boolean(errors.firstName)} aria-required="true" aria-describedby={describedBy("firstName")} {...register("firstName")} />
        </Field>
        <Field id="lastName" label="Last name" required error={errors.lastName?.message}>
          <input id="lastName" autoComplete="family-name" className={inputBase} aria-invalid={Boolean(errors.lastName)} aria-required="true" aria-describedby={describedBy("lastName")} {...register("lastName")} />
        </Field>
        <Field id="email" label="Work email" required error={errors.email?.message}>
          <input id="email" type="email" inputMode="email" autoComplete="email" className={inputBase} aria-invalid={Boolean(errors.email)} aria-required="true" aria-describedby={describedBy("email")} {...register("email")} />
        </Field>
        <Field id="company" label="Company" required error={errors.company?.message}>
          <input id="company" autoComplete="organization" className={inputBase} aria-invalid={Boolean(errors.company)} aria-required="true" aria-describedby={describedBy("company")} {...register("company")} />
        </Field>
        <Field id="role" label="Role" error={errors.role?.message} className="sm:col-span-2">
          <input id="role" autoComplete="organization-title" placeholder="e.g. VP Engineering" className={inputBase} aria-invalid={Boolean(errors.role)} aria-describedby={describedBy("role")} {...register("role")} />
        </Field>
        <Field id="interest" label="What are you looking for?" required error={errors.interest?.message} className="sm:col-span-2">
          <div className="relative">
          <select id="interest" className={cn(inputBase, "appearance-none pr-10")} aria-invalid={Boolean(errors.interest)} aria-required="true" aria-describedby={describedBy("interest")} {...register("interest")} defaultValue={initialInterest ?? ""}>
            <option value="" disabled>
              Select an option
            </option>
            {Object.entries(interestOptions).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3.5 top-[calc(50%+4px)] size-4 -translate-y-1/2 text-fg-subtle" />
          </div>
        </Field>
        <Field id="teamSize" label="Approximate team size" error={errors.teamSize?.message}>
          <div className="relative">
          <select id="teamSize" className={cn(inputBase, "appearance-none pr-10")} aria-describedby={describedBy("teamSize")} {...register("teamSize")}>
            <option value="">Select</option>
            {Object.entries(teamSizeOptions).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3.5 top-[calc(50%+4px)] size-4 -translate-y-1/2 text-fg-subtle" />
          </div>
        </Field>
        <Field id="timeline" label="Timeline" error={errors.timeline?.message}>
          <div className="relative">
          <select id="timeline" className={cn(inputBase, "appearance-none pr-10")} aria-describedby={describedBy("timeline")} {...register("timeline")}>
            <option value="">Select</option>
            {Object.entries(timelineOptions).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3.5 top-[calc(50%+4px)] size-4 -translate-y-1/2 text-fg-subtle" />
          </div>
        </Field>
        <Field
          id="message"
          label="Message"
          required
          error={errors.message?.message}
          hint="What are you building, modernizing, automating, or operating? Context on systems and constraints helps."
          className="sm:col-span-2"
        >
          <textarea id="message" rows={6} className={cn(inputBase, "resize-y")} aria-invalid={Boolean(errors.message)} aria-required="true" aria-describedby={describedBy("message", true)} {...register("message")} />
        </Field>
      </div>

      {/* Honeypot: visually hidden and skipped by keyboard/AT; bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <AnimatePresence>
        {status.kind === "error" && (
          <m.div
            ref={statusRef}
            tabIndex={-1}
            role="alert"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex gap-3 rounded-md border border-amber-400/40 bg-amber-400/[0.06] p-4 text-sm outline-none"
            data-testid="contact-error"
          >
            <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-300" />
            <div className="text-fg-muted">
              {status.code === "not_configured" && (
                <p>
                  <strong className="font-medium text-fg">Your message has not been sent.</strong> Our contact form isn’t connected to email yet.
                  {publicEmail ? (
                    <>
                      {" "}Please write to us directly at{" "}
                      <a href={`mailto:${publicEmail}`} className="text-fg underline underline-offset-4">
                        {publicEmail}
                      </a>
                      .
                    </>
                  ) : (
                    " Please try again later."
                  )}
                </p>
              )}
              {status.code === "rate_limited" && (
                <p>
                  <strong className="font-medium text-fg">Too many messages in a short time.</strong> Please wait a few minutes and try again.
                </p>
              )}
              {status.code === "generic" && (
                <p>
                  <strong className="font-medium text-fg">Something went wrong and your message was not sent.</strong> Your details are still in the form; please try again.
                </p>
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" arrow={!submitting} disabled={submitting} aria-disabled={submitting}>
          {submitting ? (
            <span className="flex items-center gap-2">
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
              Sending…
            </span>
          ) : (
            "Start the conversation"
          )}
        </Button>
        {schedulingUrl ? (
          <ButtonLink href={schedulingUrl} variant="secondary" size="lg">
            Schedule a conversation
          </ButtonLink>
        ) : (
          <p className="text-sm text-fg-subtle">Prefer a call? Say so in your message and we’ll suggest times.</p>
        )}
      </div>
      <p className="text-xs leading-relaxed text-fg-subtle">
        We use your details only to respond to this inquiry. See our{" "}
        <a href="/privacy" className="underline underline-offset-2 hover:text-fg">
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}
