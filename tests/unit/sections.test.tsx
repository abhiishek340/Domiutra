import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ServicesSection } from "@/components/sections/home/ServicesSection";
import { WorkflowSection } from "@/components/sections/home/WorkflowSection";
import { WhySection } from "@/components/sections/home/WhySection";
import { IndustriesSection } from "@/components/sections/home/IndustriesSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { IndustryCard } from "@/components/cards/IndustryCard";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { ServiceGlyph } from "@/components/diagrams/ServiceGlyph";
import { IndustryArt } from "@/components/diagrams/IndustryArt";
import { ServiceDiagram } from "@/components/diagrams/ServiceDiagram";
import { LifecycleLoop } from "@/components/diagrams/LifecycleLoop";
import { DeliveryLayers } from "@/components/diagrams/DeliveryLayers";
import { ProcessStages } from "@/components/diagrams/ProcessStages";
import { Magnetic } from "@/components/animations/Magnetic";
import { PointerTilt } from "@/components/animations/PointerTilt";
import { CursorGlow } from "@/components/animations/CursorGlow";
import { SpotlightGroup } from "@/components/animations/SpotlightGroup";
import { AnimatedNumber } from "@/components/animations/AnimatedNumber";
import { RotatingWords } from "@/components/animations/RotatingWords";
import { services, getService, servicesByPillar } from "@/lib/data/services";
import { industries, getIndustry } from "@/lib/data/industries";
import { caseStudies, getCaseStudy } from "@/lib/data/case-studies";
import { deliveryStages, deliveryLayers, securityPractices } from "@/lib/data/delivery";
import { leaders } from "@/lib/data/leadership";
import { certifications } from "@/lib/data/trust";
import { createRateLimiter } from "@/lib/contact/rate-limit";
import type { DiagramKey } from "@/lib/data/types";

afterEach(() => vi.restoreAllMocks());

describe("homepage sections", () => {
  it("renders all six services and four workflow stages", () => {
    render(
      <>
        <ServicesSection />
        <WorkflowSection />
      </>,
    );
    expect(screen.getByRole("heading", { name: "Six ways to move forward." })).toBeInTheDocument();
    for (const s of services) expect(screen.getByRole("link", { name: s.title })).toBeInTheDocument();
    for (const stage of ["Understand", "Build", "Launch", "Operate"]) expect(screen.getByRole("heading", { name: stage })).toBeInTheDocument();
  });

  it("renders why-Domiutra reasons and every industry link", () => {
    render(
      <>
        <WhySection />
        <IndustriesSection />
      </>,
    );
    expect(screen.getAllByRole("listitem").length).toBeGreaterThanOrEqual(6 + industries.length);
    for (const i of industries) expect(screen.getByRole("link", { name: new RegExp(i.name) })).toHaveAttribute("href", `/industries/${i.slug}`);
  });

  it("final CTA supports custom copy and hiding the secondary action", () => {
    render(<FinalCTA title="Custom title" body="Custom body" primary={{ label: "Go", href: "/contact" }} secondary={null} />);
    expect(screen.getByRole("heading", { name: "Custom title" })).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("page hero renders breadcrumbs, intro, actions, and an optional visual", () => {
    render(
      <PageHero
        title="Hello there"
        eyebrow="Eyebrow"
        intro={<p>Intro</p>}
        breadcrumbs={[{ name: "About", path: "/about" }]}
        actions={<button type="button">Act</button>}
        visual={<div>Visual</div>}
      />,
    );
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Hello there");
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByText("Visual")).toBeInTheDocument();
  });
});

describe("cards and diagrams", () => {
  it.each(industries.map((i) => [i.slug, i] as const))("industry card + art render for %s", (_slug, industry) => {
    const { container } = render(<IndustryCard industry={industry} size="lg" />);
    expect(screen.getByRole("link", { name: industry.name })).toBeInTheDocument();
    expect(container.querySelectorAll("svg [class]").length).toBeGreaterThan(0);
  });

  it("industry art renders nothing for unknown slugs", () => {
    const { container } = render(<IndustryArt slug="unknown" />);
    expect(container.querySelector("svg")!.childElementCount).toBe(0);
  });

  it.each(["engineering", "modernization", "cloud", "ai", "operations", "quality"] as DiagramKey[])(
    "service glyph draws the %s motif",
    (kind) => {
      const { container } = render(<ServiceGlyph kind={kind} />);
      expect(container.querySelector("svg")!.childElementCount).toBe(1);
    },
  );

  it("picks the loop diagram for operations and the step flow otherwise", () => {
    const ops = getService("managed-services")!;
    const { unmount } = render(<ServiceDiagram service={ops} />);
    expect(screen.getByText(/Operating lifecycle/)).toBeInTheDocument();
    unmount();
    render(<ServiceDiagram service={getService("cloud-devops")!} />);
    expect(screen.getByRole("list", { name: "Code to production" })).toBeInTheDocument();
  });

  it("lifecycle loop lists every step", () => {
    render(<LifecycleLoop steps={["Observe", "Detect", "Triage"]} />);
    expect(screen.getByRole("list", { name: "Lifecycle steps" }).children).toHaveLength(3);
  });

  it("delivery layers render every layer and discipline", () => {
    render(<DeliveryLayers />);
    expect(screen.getByRole("list", { name: /Delivery structure/ }).children).toHaveLength(deliveryLayers.length);
    expect(screen.getByRole("list", { name: "Disciplines" })).toHaveTextContent("Engineering");
  });

  it("process stages render a rail and every stage with the responsibility split", () => {
    render(<ProcessStages stages={deliveryStages} />);
    expect(screen.getByRole("navigation", { name: "Delivery stages" }).querySelectorAll("a")).toHaveLength(7);
    expect(screen.getAllByText("Domiutra")).toHaveLength(7);
  });

  it("article card shows category, date, and reading time", () => {
    render(
      <ArticleCard
        tone="dark"
        featured
        article={{ slug: "x", title: "Title", excerpt: "Excerpt text here", category: "Cloud", publishedAt: "2026-09-08", readingTime: "7 min read" }}
      />,
    );
    expect(screen.getByText("September 8, 2026")).toHaveAttribute("dateTime", "2026-09-08");
    expect(screen.getByRole("link", { name: "Title" })).toHaveAttribute("href", "/insights/x");
  });
});

describe("interaction primitives", () => {
  it("magnetic, tilt, glow, and spotlight wrappers render children and handle pointer input", () => {
    render(
      <SpotlightGroup>
        <div data-spotlight="" data-testid="card">
          <Magnetic>
            <button type="button">Magnet</button>
          </Magnetic>
        </div>
        <PointerTilt>
          <p>Tilted</p>
        </PointerTilt>
        <section>
          <CursorGlow />
        </section>
      </SpotlightGroup>,
    );
    const button = screen.getByRole("button", { name: "Magnet" });
    fireEvent.pointerMove(button, { pointerType: "mouse", clientX: 10, clientY: 10 });
    fireEvent.pointerLeave(button);
    fireEvent.pointerMove(screen.getByTestId("card"), { pointerType: "mouse", clientX: 40, clientY: 30 });
    expect(screen.getByTestId("card").style.getPropertyValue("--x")).toMatch(/px$/);
    expect(screen.getByText("Tilted")).toBeInTheDocument();
  });

  it("animated number shows the real value", () => {
    render(<AnimatedNumber value={12} />);
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("rotating words expose the full list to assistive tech", () => {
    render(<RotatingWords words={["engineering", "cloud"]} />);
    expect(screen.getByText("engineering, cloud")).toHaveClass("sr-only");
  });
});

describe("data helpers", () => {
  it("looks up services, industries, and case studies by slug", () => {
    expect(getService("ai-data")?.title).toBe("AI & Data");
    expect(getService("nope")).toBeUndefined();
    expect(getIndustry("healthcare")?.name).toBe("Healthcare");
    expect(getIndustry("nope")).toBeUndefined();
    expect(getCaseStudy(caseStudies[0]!.slug)).toBe(caseStudies[0]);
    expect(getCaseStudy("nope")).toBeUndefined();
  });

  it("groups every service under exactly one pillar", () => {
    const grouped = (["Build", "Modernize", "Operate"] as const).flatMap((p) => servicesByPillar(p));
    expect(grouped).toHaveLength(services.length);
  });

  it("ships no placeholder people or unearned certifications", () => {
    expect(leaders).toEqual([]);
    expect(certifications).toEqual([]);
    expect(securityPractices.length).toBeGreaterThanOrEqual(8);
  });

  it("rate limiter evicts expired buckets when memory grows", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 10 });
    for (let i = 0; i < 5001; i++) limiter.check(`ip-${i}`, 0);
    // A later call past the window triggers cleanup and still allows new clients.
    expect(limiter.check("fresh", 100).allowed).toBe(true);
    expect(limiter.check("ip-1", 100).allowed).toBe(true);
  });
});
