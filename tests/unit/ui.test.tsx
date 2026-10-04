import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { SplitTextReveal } from "@/components/animations/SplitTextReveal";
import { Hero } from "@/components/sections/home/Hero";
import { TrustStrip } from "@/components/sections/home/TrustStrip";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@/components/layout/Analytics";
import { ButtonLink, Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { CaseStudyCard } from "@/components/cards/CaseStudyCard";
import { LeadershipGrid } from "@/components/sections/LeadershipGrid";
import { StepFlow } from "@/components/diagrams/StepFlow";
import { DeliveryModelExplorer } from "@/components/diagrams/DeliveryModelExplorer";
import { InsightsBrowser } from "@/components/sections/InsightsBrowser";
import { services } from "@/lib/data/services";
import { caseStudies } from "@/lib/data/case-studies";
import { diagramDetails } from "@/lib/data/diagram-details";
import type { Article } from "@/lib/data/types";

afterEach(() => vi.unstubAllEnvs());

describe("headline text integrity (SEO)", () => {
  it("SplitTextReveal keeps the heading text exactly once", () => {
    render(<h1>{<SplitTextReveal text="Build what matters." />}</h1>);
    expect(screen.getByRole("heading").textContent).toBe("Build what matters.");
  });

  it("the hero title reads correctly to crawlers and assistive tech", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveAccessibleName("Build. Modernize. Operate.");
    expect(h1.textContent).toBe("Build. Modernize. Operate.");
    expect(screen.getByRole("link", { name: /Talk to Domiutra/ })).toHaveAttribute("href", "/contact");
  });

  it("the ticker duplicates content visually but hides the copy from screen readers", () => {
    render(<TrustStrip />);
    const items = screen.getByRole("list", { hidden: true }).querySelectorAll("li");
    expect(items).toHaveLength(10);
    expect([...items].filter((li) => li.getAttribute("aria-hidden") === "true")).toHaveLength(5);
  });
});

describe("layout", () => {
  it("renders breadcrumbs with the current page marked and matching JSON-LD", () => {
    const { container } = render(<Breadcrumbs items={[{ name: "Services", path: "/services" }]} />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByText("Services")).toHaveAttribute("aria-current", "page");
    const ld = JSON.parse(container.querySelector('script[type="application/ld+json"]')!.innerHTML);
    expect(ld.itemListElement).toHaveLength(2);
  });

  it("footer shows legal links and hides socials/email that aren't configured", () => {
    render(<Footer />);
    for (const name of ["Security", "Privacy", "Terms", "Accessibility"]) {
      expect(screen.getByRole("link", { name })).toBeInTheDocument();
    }
    expect(screen.queryByRole("link", { name: /LinkedIn|GitHub/ })).not.toBeInTheDocument();
    expect(screen.queryByText(/@/)).not.toBeInTheDocument();
  });

  it("loads no analytics unless provider and ID are both set", () => {
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_PROVIDER", "");
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_ID", "");
    expect(Analytics()).toBeNull();
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_PROVIDER", "ga4");
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_ID", "not-a-ga-id");
    expect(Analytics()).toBeNull();
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_ID", "G-ABC123");
    expect(Analytics()).not.toBeNull();
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_PROVIDER", "plausible");
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_ID", "domiutra.com");
    expect(Analytics()).not.toBeNull();
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_PROVIDER", "unknown");
    expect(Analytics()).toBeNull();
  });
});

describe("UI primitives", () => {
  it("opens external links safely in a new tab and announces it", () => {
    render(<ButtonLink href="https://cal.com/domiutra">Book</ButtonLink>);
    const link = screen.getByRole("link", { name: /Book/ });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveTextContent("(opens in a new tab)");
  });

  it("renders internal links and buttons", () => {
    const onClick = vi.fn();
    render(
      <>
        <ButtonLink href="/services" arrow>
          Services
        </ButtonLink>
        <Button onClick={onClick}>Go</Button>
      </>,
    );
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("href", "/services");
    fireEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalled();
  });

  it("logo exposes the brand name once", () => {
    render(<Logo />);
    expect(screen.getByText("Domiutra")).toHaveClass("sr-only");
  });
});

describe("cards", () => {
  it("service card links to its page", () => {
    const s = services[0]!;
    render(<ServiceCard service={s} />);
    expect(screen.getByRole("link", { name: s.title })).toHaveAttribute("href", `/services/${s.slug}`);
  });

  it("labels representative case studies so they can't be mistaken for client work", () => {
    const rep = caseStudies.find((c) => c.kind === "representative")!;
    render(<CaseStudyCard study={rep} />);
    expect(screen.getByText("Representative engagement")).toBeInTheDocument();
  });

  it("leadership renders nothing until real people are added", () => {
    const { container } = render(<LeadershipGrid leaders={[]} />);
    expect(container).toBeEmptyDOMElement();
    render(<LeadershipGrid leaders={[{ name: "Alex Doe", role: "CEO", bio: "Bio." }]} />);
    expect(screen.getByRole("heading", { name: "Alex Doe" })).toBeInTheDocument();
    expect(screen.getByText("AD")).toBeInTheDocument(); // initials when no photo
  });
});

describe("interactive diagrams", () => {
  it("StepFlow reveals step details on selection", () => {
    const steps = ["Data", "Model / Agent", "Workflow", "Human review", "Business system", "Outcome"];
    render(<StepFlow steps={steps} details={diagramDetails.ai} label="AI workflow" />);
    const human = screen.getByRole("button", { name: /Human review/ });
    expect(human).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(human);
    expect(human).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/People approve outputs/)).toBeInTheDocument();
  });

  it("StepFlow without details renders static steps", () => {
    render(<StepFlow steps={["A", "B"]} label="Static" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Static" }).children).toHaveLength(2);
  });

  it("explorer tabs follow the ARIA tabs pattern with arrow keys", () => {
    render(<DeliveryModelExplorer />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(tabs[0]!, { key: "ArrowLeft" });
    expect(tabs[2]).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(tabs[2]!, { key: "Home" });
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(tabs[0]!, { key: "End" });
    expect(within(screen.getByRole("tabpanel")).getByText("Service owner")).toBeInTheDocument();
    fireEvent.keyDown(tabs[2]!, { key: "Enter" }); // unrelated keys are ignored
    expect(tabs[2]).toHaveAttribute("aria-selected", "true");
  });
});

describe("insights browser", () => {
  const articles: Article[] = [
    { slug: "a", title: "AI article", excerpt: "x".repeat(30), category: "AI", publishedAt: "2026-09-01", readingTime: "5 min" },
    { slug: "b", title: "Cloud article", excerpt: "y".repeat(30), category: "Cloud", publishedAt: "2026-09-02", readingTime: "5 min" },
  ];

  it("filters by category, shows counts, and offers an empty state", () => {
    render(<InsightsBrowser articles={articles} />);
    expect(screen.getByRole("button", { name: /^All/ })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: /^AI/ }));
    expect(screen.getByText("AI article")).toBeInTheDocument();
    expect(screen.queryByText("Cloud article")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^Leadership/ }));
    expect(screen.getByText("Nothing in Leadership yet.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Show all articles" }));
    expect(screen.getByText("Cloud article")).toBeInTheDocument();
  });
});
