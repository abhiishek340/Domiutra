import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

let pathname = "/";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

const { Navbar } = await import("@/components/navigation/Navbar");
const { MobileNav } = await import("@/components/navigation/MobileNav");
const { MegaMenu } = await import("@/components/navigation/MegaMenu");

describe("Navbar", () => {
  beforeEach(() => {
    pathname = "/";
  });

  it("marks the active section and shows five primary items", () => {
    pathname = "/industries/healthcare";
    render(<Navbar />);
    const primary = screen.getByRole("navigation", { name: "Primary" });
    expect(primary.querySelectorAll("ul > li")).toHaveLength(5);
    expect(screen.getByRole("link", { name: "Industries" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute("aria-current");
  });

  it("opens the services mega-menu, closes on Escape, and returns focus", async () => {
    render(<Navbar />);
    const trigger = screen.getByRole("button", { name: "Services" });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById(trigger.getAttribute("aria-controls")!)).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("closes the mega-menu on outside click and opens on hover intent", async () => {
    vi.useFakeTimers();
    render(<Navbar />);
    const trigger = screen.getByRole("button", { name: "Services" });
    fireEvent.mouseEnter(trigger.parentElement!);
    act(() => vi.advanceTimersByTime(120));
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.mouseDown(document.body);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.mouseEnter(trigger.parentElement!);
    fireEvent.mouseLeave(trigger.parentElement!);
    act(() => vi.advanceTimersByTime(200));
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    vi.useRealTimers();
  });

  it("becomes compact after scrolling", () => {
    render(<Navbar />);
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(nav.className).toContain("lg:h-20");
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 200, configurable: true });
      window.dispatchEvent(new Event("scroll"));
    });
    expect(nav.className).toContain("h-14");
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  });

  it("closes the menu when the route changes", () => {
    const { rerender } = render(<Navbar />);
    const trigger = screen.getByRole("button", { name: "Services" });
    fireEvent.click(trigger);
    pathname = "/services/cloud-devops";
    rerender(<Navbar />);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});

describe("MegaMenu", () => {
  it("lists services under Build / Modernize / Operate and calls onNavigate", () => {
    const onNavigate = vi.fn();
    render(<MegaMenu onNavigate={onNavigate} />);
    for (const heading of ["Build", "Modernize", "Operate", "Explore"]) expect(screen.getByText(heading)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", { name: /Cloud & DevOps/ }));
    expect(onNavigate).toHaveBeenCalled();
  });
});

describe("MobileNav", () => {
  afterEach(() => {
    document.documentElement.style.overflow = "";
  });

  function renderWithLandmarks() {
    return render(
      <>
        <MobileNav pathname="/" />
        <main id="main">content</main>
        <footer>footer</footer>
      </>,
    );
  }

  it("opens a modal dialog, locks the page, and focuses the close button", async () => {
    renderWithLandmarks();
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const dialog = await screen.findByRole("dialog", { name: "Site menu" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(document.getElementById("main")).toHaveAttribute("inert");
    expect(document.documentElement.style.overflow).toBe("hidden");
    await waitFor(() => expect(screen.getByRole("button", { name: "Close menu" })).toHaveFocus());
  });

  it("traps focus with Tab and Shift+Tab", async () => {
    renderWithLandmarks();
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const dialog = await screen.findByRole("dialog");
    const focusables = dialog.querySelectorAll<HTMLElement>("a[href], button");
    const first = focusables[0]!;
    const last = focusables[focusables.length - 1]!;

    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(first).toHaveFocus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(last).toHaveFocus();
  });

  it("closes on Escape and restores the page and trigger focus", async () => {
    renderWithLandmarks();
    const open = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(open);
    await screen.findByRole("dialog");
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(document.getElementById("main")).not.toHaveAttribute("inert");
    expect(document.documentElement.style.overflow).toBe("");
    expect(open).toHaveFocus();
  });

  it("closes from the close button and when navigating", async () => {
    const { rerender } = render(<MobileNav pathname="/" />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    fireEvent.click(await screen.findByRole("button", { name: "Close menu" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    await screen.findByRole("dialog");
    rerender(<MobileNav pathname="/about" />);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
