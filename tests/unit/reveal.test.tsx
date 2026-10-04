import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const animate = vi.fn();
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  animate: (...args: unknown[]) => animate(...args),
}));

const { Reveal, RevealGroup, RevealItem } = await import("@/components/animations/Reveal");
const { DrawLine } = await import("@/components/animations/DrawLine");

/** Captures IntersectionObserver callbacks so tests can "scroll" elements into view. */
let ioCallbacks: IntersectionObserverCallback[] = [];
class ControlledIO {
  constructor(cb: IntersectionObserverCallback) {
    ioCallbacks.push(cb);
  }
  observe() {}
  disconnect() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
}
const scrollIntoView = () =>
  ioCallbacks.forEach((cb) => cb([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));

function placeBelowFold(below: boolean) {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    top: below ? 5000 : 10,
  } as DOMRect);
}

describe("progressive-enhancement reveals", () => {
  beforeEach(() => {
    ioCallbacks = [];
    animate.mockReset();
    vi.stubGlobal("IntersectionObserver", ControlledIO);
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("never hides content that is already on screen", () => {
    placeBelowFold(false);
    render(<Reveal>Visible copy</Reveal>);
    const el = screen.getByText("Visible copy");
    expect(el.style.opacity).toBe("");
    expect(animate).not.toHaveBeenCalled();
  });

  it("hides below-the-fold content only after hydration, then animates it in on view", () => {
    placeBelowFold(true);
    render(<Reveal y={20}>Later copy</Reveal>);
    const el = screen.getByText("Later copy");
    expect(el.style.opacity).toBe("0");
    expect(el.style.transform).toBe("translateY(20px)");

    scrollIntoView();
    expect(animate).toHaveBeenCalledTimes(1);
    const [targets, keyframes] = animate.mock.calls[0]!;
    expect(targets).toEqual([el]);
    // Explicit [from, to] pairs so transforms interpolate rather than snap.
    expect(keyframes).toEqual({ opacity: [0, 1], transform: ["translateY(20px)", "translateY(0px)"] });
  });

  it("staggers group items together", () => {
    placeBelowFold(true);
    render(
      <RevealGroup as="ul">
        <RevealItem as="li">One</RevealItem>
        <RevealItem as="li">Two</RevealItem>
      </RevealGroup>,
    );
    expect(screen.getByText("One").style.opacity).toBe("0");
    scrollIntoView();
    expect(animate.mock.calls[0]![0]).toHaveLength(2);
  });

  it("supports custom keyframes (line drawing)", () => {
    placeBelowFold(true);
    const { container } = render(<DrawLine />);
    const line = container.querySelector("span")!;
    expect(line.style.transform).toBe("scaleX(0)");
    scrollIntoView();
    expect(animate.mock.calls[0]![1]).toEqual({ transform: ["scaleX(0)", "scaleX(1)"] });
  });

  it("does nothing for reduced-motion users", () => {
    placeBelowFold(true);
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true } as MediaQueryList);
    render(<Reveal>Calm copy</Reveal>);
    expect(screen.getByText("Calm copy").style.opacity).toBe("");
  });

  it("restores visibility on unmount", () => {
    placeBelowFold(true);
    const { unmount, container } = render(<Reveal>Gone</Reveal>);
    const el = container.firstElementChild as HTMLElement;
    unmount();
    expect(el.style.opacity).toBe("");
  });
});
