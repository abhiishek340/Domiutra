import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { Brief } from "@/lib/brief/schema";

const push = vi.fn();
let search = "";
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => new URLSearchParams(search),
  usePathname: () => "/",
}));

const { BriefAssistant } = await import("@/components/brief/BriefAssistant");
const { BotOrb } = await import("@/components/brief/BotOrb");
const { ContactForm } = await import("@/components/forms/ContactForm");
const { BRIEF_HANDOFF_KEY } = await import("@/lib/brief/format");

const brief: Brief = {
  relevant: true,
  title: "Billing platform modernization",
  summary: "A legacy billing system is slow to change.",
  services: [
    { slug: "application-modernization", reason: "Incremental decomposition." },
    { slug: "qa-automation", reason: "Regression safety net." },
  ],
  engagement: { model: "dedicated", reason: "Ongoing roadmap." },
  team: { workType: "modernization", teamSize: 6, durationMonths: 12, usInvolvement: "standard", ongoingSupport: false },
  phases: [
    { name: "Assess", detail: "Map the system." },
    { name: "Stabilize", detail: "Add tests." },
    { name: "Migrate", detail: "Move a domain." },
  ],
  risks: ["Hidden business rules.", "Cutover windows."],
  questions: ["What changes most?", "Any compliance needs?", "Who decides architecture?"],
};

function respond(status: number, body: unknown) {
  const fn = vi.fn().mockResolvedValue({ ok: status < 300, status, json: async () => body });
  vi.stubGlobal("fetch", fn);
  return fn;
}

const PROMPT = "Our 15-year-old billing system is slow to change and we want AWS.";

function typeAndSend(text = PROMPT) {
  fireEvent.change(screen.getByRole("textbox", { name: "Describe your project" }), { target: { value: text } });
  fireEvent.click(screen.getByRole("button", { name: "Draft my brief" }));
}

describe("BriefAssistant", () => {
  beforeEach(() => {
    push.mockReset();
    Element.prototype.scrollIntoView = vi.fn();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    sessionStorage.clear();
  });

  it("greets the visitor and fills the composer from example prompts", () => {
    render(<BriefAssistant />);
    expect(screen.getByRole("log", { name: "Brief assistant conversation" })).toHaveTextContent(/draft a brief/);
    const example = within(screen.getByRole("list", { name: "Example prompts" })).getAllByRole("button")[0]!;
    fireEvent.click(example);
    expect(screen.getByRole("textbox", { name: "Describe your project" })).toHaveValue(example.textContent);
    expect(screen.getByRole("button", { name: "Draft my brief" })).toBeEnabled();
  });

  it("requires enough detail before sending", () => {
    render(<BriefAssistant />);
    const send = screen.getByRole("button", { name: "Draft my brief" });
    expect(send).toBeDisabled();
    fireEvent.change(screen.getByRole("textbox", { name: "Describe your project" }), { target: { value: "Fix my app" } });
    expect(send).toBeDisabled();
    expect(screen.getByText(/more characters/)).toBeInTheDocument();
  });

  it("shows progress, then renders the full brief with team shape and service links", async () => {
    const fetchMock = respond(200, { ok: true, brief, demo: false });
    render(<BriefAssistant />);
    await act(async () => typeAndSend());

    expect(JSON.parse(fetchMock.mock.calls[0]![1].body)).toEqual({ prompt: PROMPT });
    const result = await screen.findByTestId("brief-result");
    expect(within(result).getByRole("heading", { name: brief.title })).toBeInTheDocument();
    expect(within(result).getByRole("link", { name: /Application Modernization/ })).toHaveAttribute("href", "/services/application-modernization");
    expect(within(result).getByText("Dedicated team")).toBeInTheDocument();
    expect(within(result).getByRole("list", { name: "Roles" }).children.length).toBeGreaterThan(2);
    expect(screen.getByText(/AI-generated first draft/)).toBeInTheDocument();
    expect(screen.getByText(PROMPT)).toBeInTheDocument(); // the visitor's message bubble
  });

  it("sends with Ctrl/⌘ + Enter", async () => {
    const fetchMock = respond(200, { ok: true, brief, demo: false });
    render(<BriefAssistant />);
    const box = screen.getByRole("textbox", { name: "Describe your project" });
    fireEvent.change(box, { target: { value: PROMPT } });
    await act(async () => fireEvent.keyDown(box, { key: "Enter", metaKey: true }));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("labels demo responses honestly", async () => {
    respond(200, { ok: true, brief, demo: true });
    render(<BriefAssistant demo />);
    expect(screen.getByText("Demo mode")).toBeInTheDocument();
    await act(async () => typeAndSend());
    expect(await screen.findByText(/Demo response: a sample brief/)).toBeInTheDocument();
  });

  it("hands the brief to the contact form and navigates there", async () => {
    respond(200, { ok: true, brief, demo: false });
    render(<BriefAssistant />);
    await act(async () => typeAndSend());
    fireEvent.click(await screen.findByRole("button", { name: /Send this brief to Domiutra/ }));
    const handoff = JSON.parse(sessionStorage.getItem(BRIEF_HANDOFF_KEY)!);
    expect(handoff.service).toBe("application-modernization");
    expect(handoff.message).toContain("Project brief: Billing platform modernization");
    expect(push).toHaveBeenCalledWith("/contact?from=brief");
  });

  it("copies the brief as text", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    respond(200, { ok: true, brief, demo: false });
    render(<BriefAssistant />);
    await act(async () => typeAndSend());
    await act(async () => fireEvent.click(await screen.findByRole("button", { name: "Copy" })));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("Project brief:"));
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
  });

  it.each([
    ["off_topic", 422, /only help scope technology/],
    ["rate_limited", 429, /wait a few minutes/],
    ["timeout", 504, /longer than expected/],
    ["not_configured", 503, /isn't connected right now/],
    ["upstream_error", 502, /Something went wrong/],
  ])("explains %s errors in plain language and lets the visitor start over", async (error, status, copy) => {
    respond(status, { ok: false, error });
    render(<BriefAssistant />);
    await act(async () => typeAndSend());
    expect(await screen.findByRole("alert")).toHaveTextContent(copy);
    fireEvent.click(screen.getByRole("button", { name: "Start a new brief" }));
    const composer = screen.getByRole("textbox", { name: "Describe your project" });
    expect(composer).toHaveValue("");
    await waitFor(() => expect(composer).toHaveFocus());
  });

  it("recovers from network failures", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    render(<BriefAssistant />);
    await act(async () => typeAndSend());
    expect(await screen.findByRole("alert")).toHaveTextContent(/Something went wrong/);
  });

  it("the orb signals thinking state visually only", () => {
    const { container } = render(<BotOrb thinking />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(container.firstElementChild).toHaveClass("is-thinking");
  });
});

describe("contact form handoff from the brief assistant", () => {
  afterEach(() => {
    search = "";
    sessionStorage.clear();
  });

  it("pre-fills the message and service once, then clears the handoff", async () => {
    sessionStorage.setItem(BRIEF_HANDOFF_KEY, JSON.stringify({ message: "Project brief: Billing\n\nDetails", service: "cloud-devops" }));
    search = "from=brief";
    render(<ContactForm />);
    await waitFor(() => expect(screen.getByRole("textbox", { name: "Message" })).toHaveValue("Project brief: Billing\n\nDetails"));
    expect(screen.getByRole("combobox", { name: "What are you looking for?" })).toHaveValue("cloud-devops");
    expect(screen.getByTestId("brief-included")).toBeInTheDocument();
    expect(sessionStorage.getItem(BRIEF_HANDOFF_KEY)).toBeNull();
  });

  it("ignores malformed handoffs and unknown services", async () => {
    sessionStorage.setItem(BRIEF_HANDOFF_KEY, "{broken");
    search = "from=brief";
    const { unmount } = render(<ContactForm />);
    expect(screen.getByRole("textbox", { name: "Message" })).toHaveValue("");
    unmount();

    sessionStorage.setItem(BRIEF_HANDOFF_KEY, JSON.stringify({ message: 42, service: "hacking" }));
    render(<ContactForm />);
    await waitFor(() => expect(sessionStorage.getItem(BRIEF_HANDOFF_KEY)).toBeNull());
    expect(screen.getByRole("combobox", { name: "What are you looking for?" })).toHaveValue("");
    expect(screen.queryByTestId("brief-included")).not.toBeInTheDocument();
  });

  it("does nothing without ?from=brief", () => {
    sessionStorage.setItem(BRIEF_HANDOFF_KEY, JSON.stringify({ message: "Project brief: x" }));
    render(<ContactForm />);
    expect(screen.getByRole("textbox", { name: "Message" })).toHaveValue("");
    expect(sessionStorage.getItem(BRIEF_HANDOFF_KEY)).not.toBeNull();
  });
});
