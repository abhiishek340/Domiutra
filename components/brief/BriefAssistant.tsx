"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { ArrowUp, Check, Copy, RotateCcw, Sparkles } from "lucide-react";
import type { Brief } from "@/lib/brief/schema";
import { PROMPT_MAX, PROMPT_MIN } from "@/lib/brief/schema";
import { BRIEF_HANDOFF_KEY, briefToText } from "@/lib/brief/format";
import type { BriefApiResponse } from "@/app/api/brief/route";
import { BotOrb } from "./BotOrb";
import { BriefResult } from "./BriefResult";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const EXAMPLES = [
  "Our 15-year-old Java billing system is slow to change and we want to move it to AWS.",
  "We want AI to extract data from shipping documents our ops team re-keys by hand.",
  "Our SaaS roadmap is ahead of our team and we need to ship enterprise SSO and audit logs.",
];

const STEPS = ["Reading your situation", "Matching services", "Shaping the team", "Mapping risks and questions"];

type State =
  | { kind: "idle" }
  | { kind: "thinking"; prompt: string }
  | { kind: "done"; prompt: string; brief: Brief; demo: boolean }
  | { kind: "error"; prompt: string; code: string };

const ERROR_COPY: Record<string, string> = {
  off_topic: "I can only help scope technology and business-systems projects. Try describing what you want to build, modernize, or run.",
  rate_limited: "You've drafted several briefs in a short time. Please wait a few minutes and try again.",
  timeout: "That took longer than expected. Please try again.",
  not_configured: "The brief assistant isn't connected right now. You can describe your project on the contact page instead.",
  invalid: "Add a little more detail about your situation and try again.",
};
const GENERIC_ERROR = "Something went wrong while drafting your brief. Please try again.";

const EASE = [0.22, 1, 0.36, 1] as const;

function Bubble({ from, children, animateIn = true }: { from: "bot" | "user"; children: React.ReactNode; animateIn?: boolean }) {
  return (
    <m.div
      // The greeting renders visible in server HTML; only later messages animate in.
      initial={animateIn ? { opacity: 0, y: 12, scale: 0.98 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: EASE }}
      className={cn("flex gap-3", from === "user" && "justify-end")}
    >
      {from === "bot" && <BotOrb size={32} className="mt-1" />}
      <div
        className={cn(
          "min-w-0 rounded-lg",
          from === "user"
            ? "max-w-[85%] rounded-tr-sm bg-mint/[0.12] px-4 py-3 text-fg ring-1 ring-mint/25"
            : "flex-1 rounded-tl-sm text-fg-muted",
        )}
      >
        {children}
      </div>
    </m.div>
  );
}

/** Conversational project-brief assistant backed by /api/brief (Gemini). */
export function BriefAssistant({ demo = false }: { demo?: boolean }) {
  const router = useRouter();
  const [state, setState] = useState<State>({ kind: "idle" });
  const [prompt, setPrompt] = useState("");
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const latestRef = useRef<HTMLDivElement>(null);
  const focusComposer = useRef(false);
  const inputId = useId();
  const hintId = useId();

  const busy = state.kind === "thinking";
  const length = prompt.trim().length;
  const canSend = !busy && length >= PROMPT_MIN && length <= PROMPT_MAX;

  // Advance the "thinking" checklist while waiting.
  useEffect(() => {
    if (!busy) return;
    const id = window.setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 1300);
    return () => window.clearInterval(id);
  }, [busy]);

  // Bring the newest message into view: the brief from its top, so it reads naturally.
  useEffect(() => {
    if (state.kind === "idle") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    latestRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: state.kind === "done" ? "start" : "nearest" });
  }, [state.kind]);

  async function send(text: string) {
    const clean = text.trim();
    if (clean.length < PROMPT_MIN || clean.length > PROMPT_MAX || busy) return;
    setStep(0);
    setCopied(false);
    setState({ kind: "thinking", prompt: clean });
    setPrompt("");
    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: clean }),
      });
      const data = (await res.json().catch(() => null)) as BriefApiResponse | null;
      if (data?.ok) setState({ kind: "done", prompt: clean, brief: data.brief, demo: data.demo });
      else setState({ kind: "error", prompt: clean, code: data && !data.ok ? data.error : "generic" });
    } catch {
      setState({ kind: "error", prompt: clean, code: "generic" });
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(prompt);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      void send(prompt);
    }
  };

  const reset = () => {
    // The composer re-mounts on reset; focus it after render so keyboard users keep their place.
    focusComposer.current = true;
    setState({ kind: "idle" });
    setPrompt("");
  };

  useEffect(() => {
    if (state.kind === "idle" && focusComposer.current) {
      focusComposer.current = false;
      textareaRef.current?.focus();
    }
  }, [state.kind]);

  const handOff = () => {
    if (state.kind !== "done") return;
    try {
      sessionStorage.setItem(
        BRIEF_HANDOFF_KEY,
        JSON.stringify({ message: briefToText(state.brief, state.prompt), service: state.brief.services[0]?.slug }),
      );
    } catch {
      /* storage unavailable: the contact form simply won't be pre-filled */
    }
    router.push("/contact?from=brief");
  };

  const copy = async () => {
    if (state.kind !== "done") return;
    try {
      await navigator.clipboard.writeText(briefToText(state.brief, state.prompt));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-line-strong bg-ink-900/70 shadow-float backdrop-blur-xl" data-testid="brief-assistant">
      {/* Ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(122_240_195/0.14),transparent)] blur-2xl" />

      {/* Header */}
      <div className="relative flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <div className="flex items-center gap-3">
          <BotOrb size={36} thinking={busy} />
          <div>
            <p className="font-semibold leading-tight">Brief Assistant</p>
            <p className="text-xs text-fg-subtle">Drafts a project plan from one description</p>
          </div>
        </div>
        <span
          className={cn(
            "label-mono inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1",
            demo ? "border-amber-400/40 text-amber-300" : "border-mint/30 text-mint",
          )}
        >
          <span aria-hidden="true" className={cn("size-1.5 rounded-full", demo ? "bg-amber-300" : "bg-mint animate-pulse-soft")} data-loop="" />
          {demo ? "Demo mode" : "AI · Online"}
        </span>
      </div>

      {/* Conversation */}
      <div role="log" aria-live="polite" aria-label="Brief assistant conversation" className="relative min-h-72 space-y-5 px-5 py-6">
        <Bubble from="bot" animateIn={false}>
          <p className="pt-1.5 leading-relaxed text-fg">
            Tell me what you&rsquo;re trying to build, modernize, or run. I&rsquo;ll draft a brief: services, team shape, phases, risks, and the questions we&rsquo;d ask.
          </p>
          {state.kind === "idle" && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Example prompts">
              {EXAMPLES.map((ex) => (
                <li key={ex}>
                  <button
                    type="button"
                    onClick={() => {
                      setPrompt(ex);
                      textareaRef.current?.focus();
                    }}
                    className="rounded-full border border-line-strong bg-ink-950/60 px-3 py-1.5 text-left text-sm text-fg-muted transition-colors hover:border-mint/50 hover:text-fg"
                  >
                    {ex}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Bubble>

        {state.kind !== "idle" && (
          <div ref={latestRef} className="scroll-mt-24">
          <Bubble from="user">
            <p className="whitespace-pre-wrap leading-relaxed">{state.prompt}</p>
          </Bubble>
          </div>
        )}

        <AnimatePresence mode="wait">
          {state.kind === "thinking" && (
            <m.div key="thinking" exit={{ opacity: 0, transition: { duration: 0.15 } }}>
              <Bubble from="bot">
                <ol className="space-y-2 pt-1.5" aria-label="Drafting your brief">
                  {STEPS.map((s, i) => (
                    <li key={s} className={cn("flex items-center gap-2 text-sm transition-opacity", i > step && "opacity-30")}>
                      {i < step ? (
                        <Check aria-hidden="true" className="size-4 text-mint" />
                      ) : (
                        <span aria-hidden="true" className={cn("size-4 rounded-full border", i === step ? "border-mint" : "border-line-strong")} />
                      )}
                      <span className={i === step ? "text-shimmer" : ""}>{s}</span>
                    </li>
                  ))}
                </ol>
              </Bubble>
            </m.div>
          )}

          {state.kind === "done" && (
            <m.div key="done" className="space-y-5">
              <Bubble from="bot">
                <BriefResult brief={state.brief} />
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.4 }}
                  className="mt-5 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <p className="flex items-start gap-2 text-xs leading-relaxed text-fg-subtle">
                    <Sparkles aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-mint" />
                    {state.demo
                      ? "Demo response: a sample brief, not generated from your text. Connect a Gemini API key for live drafts."
                      : "AI-generated first draft from your description. Not a quote: a Domiutra engineer reviews every brief."}
                  </p>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button variant="secondary" onClick={copy} aria-live="polite">
                      {copied ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button onClick={handOff} arrow>
                      Send this brief to Domiutra
                    </Button>
                  </div>
                </m.div>
              </Bubble>
            </m.div>
          )}

          {state.kind === "error" && (
            <m.div key="error">
              <Bubble from="bot">
                <p role="alert" className="pt-1.5 leading-relaxed text-fg">
                  {ERROR_COPY[state.code] ?? GENERIC_ERROR}
                </p>
              </Bubble>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* Composer */}
      <form onSubmit={onSubmit} className="relative border-t border-line p-3 md:p-4">
        {state.kind === "done" || state.kind === "error" ? (
          <button
            type="button"
            onClick={reset}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-line-strong py-3 text-sm text-fg-muted transition-colors hover:border-mint/40 hover:text-fg"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            Start a new brief
          </button>
        ) : (
          <div className="flex items-end gap-2 rounded-lg border border-line-strong bg-ink-950/70 p-2 transition-colors focus-within:border-mint/60">
            <label htmlFor={inputId} className="sr-only">
              Describe your project
            </label>
            <textarea
              ref={textareaRef}
              id={inputId}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, PROMPT_MAX))}
              onKeyDown={onKeyDown}
              disabled={busy}
              rows={2}
              aria-describedby={hintId}
              placeholder="Describe your system, the problem, and what you want to achieve…"
              className="max-h-40 min-h-12 flex-1 resize-none bg-transparent px-2 py-1.5 text-[0.95rem] text-fg outline-none placeholder:text-fg-subtle focus-visible:outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!canSend}
              aria-label="Draft my brief"
              className="flex size-10 shrink-0 items-center justify-center rounded-md bg-mint text-ink-950 transition-[transform,opacity,background-color] hover:bg-mint-soft active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowUp aria-hidden="true" className="size-5" />
            </button>
          </div>
        )}
        {state.kind !== "done" && state.kind !== "error" && (
          <p id={hintId} className="mt-2 flex justify-between px-1 text-xs text-fg-subtle">
            <span>
              {length > 0 && length < PROMPT_MIN ? `A bit more detail, please (${PROMPT_MIN - length} more characters)` : "Ctrl/⌘ + Enter to send"}
            </span>
            <span className={cn(length > PROMPT_MAX * 0.9 && "text-amber-300")}>
              {length}/{PROMPT_MAX}
            </span>
          </p>
        )}
      </form>
    </div>
  );
}
