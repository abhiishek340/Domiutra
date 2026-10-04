import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

let search = "";
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(search),
  usePathname: () => "/contact",
}));

const { ContactForm } = await import("@/components/forms/ContactForm");

function fill() {
  const type = (label: string | RegExp, value: string) =>
    fireEvent.input(screen.getByRole("textbox", { name: label }), { target: { value } });
  type("First name", "Jordan");
  type("Last name", "Lee");
  type("Work email", "jordan@example.com");
  type("Company", "Example Co");
  fireEvent.change(screen.getByRole("combobox", { name: "What are you looking for?" }), { target: { value: "cloud-devops" } });
  type("Message", "We need help migrating three services to AWS this quarter.");
}

function respond(status: number, body: unknown) {
  const fetchMock = vi.fn().mockResolvedValue({ ok: status < 300, status, json: async () => body });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("ContactForm", () => {
  beforeEach(() => {
    search = "";
  });
  afterEach(() => vi.unstubAllGlobals());

  it("pre-selects the service from ?service=", () => {
    search = "service=ai-data";
    render(<ContactForm />);
    expect(screen.getByRole("combobox", { name: "What are you looking for?" })).toHaveValue("ai-data");
  });

  it("ignores unknown service values", () => {
    search = "service=../../etc";
    render(<ContactForm />);
    expect(screen.getByRole("combobox", { name: "What are you looking for?" })).toHaveValue("");
  });

  it("shows a focused error summary and inline errors on empty submit", async () => {
    const fetchMock = respond(200, { ok: true });
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: "Start the conversation" }));
    const summary = await screen.findByRole("alert");
    expect(summary).toHaveTextContent(/Please check/);
    await waitFor(() => expect(summary).toHaveFocus());
    expect(screen.getByRole("textbox", { name: "First name" })).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Enter your first name.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();

    // Summary entries jump to their field.
    fireEvent.click(screen.getByRole("link", { name: "First name" }));
    expect(screen.getByRole("textbox", { name: "First name" })).toHaveFocus();
  });

  it("submits valid data with the honeypot empty and shows success", async () => {
    const fetchMock = respond(200, { ok: true });
    render(<ContactForm />);
    fill();
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Start the conversation" })));
    expect(await screen.findByTestId("contact-success")).toHaveTextContent("your message is on its way");
    const sent = JSON.parse(fetchMock.mock.calls[0]![1].body);
    expect(sent).toMatchObject({ firstName: "Jordan", interest: "cloud-devops", website: "" });
    expect(typeof sent.startedAt).toBe("number");

    fireEvent.click(screen.getByRole("button", { name: "Send another message" }));
    expect(screen.getByRole("button", { name: "Start the conversation" })).toBeInTheDocument();
  });

  it("tells the visitor the truth when email isn't configured, with the public email if set", async () => {
    respond(503, { ok: false, error: "not_configured" });
    render(<ContactForm publicEmail="hello@example.com" />);
    fill();
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Start the conversation" })));
    const error = await screen.findByTestId("contact-error");
    expect(error).toHaveTextContent("Your message has not been sent.");
    expect(screen.getByRole("link", { name: "hello@example.com" })).toHaveAttribute("href", "mailto:hello@example.com");
    expect(screen.queryByTestId("contact-success")).not.toBeInTheDocument();
  });

  it("handles rate limiting, server field errors, and network failures", async () => {
    respond(429, { ok: false, error: "rate_limited" });
    const { unmount } = render(<ContactForm />);
    fill();
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Start the conversation" })));
    expect(await screen.findByTestId("contact-error")).toHaveTextContent("Too many messages");
    unmount();

    respond(422, { ok: false, error: "invalid", fieldErrors: { email: ["Use your work email."] } });
    const second = render(<ContactForm />);
    fill();
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Start the conversation" })));
    expect(await screen.findByText("Use your work email.")).toBeInTheDocument();
    second.unmount();

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    render(<ContactForm />);
    fill();
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Start the conversation" })));
    expect(await screen.findByTestId("contact-error")).toHaveTextContent("Something went wrong");
  });

  it("offers a scheduling link only when configured", () => {
    const { unmount } = render(<ContactForm />);
    expect(screen.queryByRole("link", { name: /Schedule a conversation/ })).not.toBeInTheDocument();
    unmount();
    render(<ContactForm schedulingUrl="https://cal.com/domiutra" />);
    expect(screen.getByRole("link", { name: /Schedule a conversation/ })).toHaveAttribute("href", "https://cal.com/domiutra");
  });
});
