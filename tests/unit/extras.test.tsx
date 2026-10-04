import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MDXProvider } from "@mdx-js/react";
import { InteractiveEstimator } from "@/components/forms/InteractiveEstimator";
import { MotionProvider } from "@/components/animations/MotionProvider";
import { LegalPage } from "@/components/sections/LegalPage";
import { useMDXComponents as getMdxComponents } from "@/mdx-components";

describe("InteractiveEstimator inputs", () => {
  it("team size slider updates the output and total", () => {
    render(<InteractiveEstimator />);
    const slider = screen.getByRole("slider", { name: "Delivery team size" });
    fireEvent.change(slider, { target: { value: "20" } });
    expect(screen.getAllByText("20 people")[0]).toBeInTheDocument();
    const roles = within(screen.getByTestId("estimator-roles"));
    expect(roles.getByText("Tech leads")).toBeInTheDocument();
  });

  it("duration slider and work type change the delivery structure", () => {
    render(<InteractiveEstimator />);
    fireEvent.click(screen.getByLabelText("Project delivery"));
    fireEvent.change(screen.getByRole("slider", { name: "Expected duration" }), { target: { value: "12" } });
    expect(screen.getByText(/About 6 milestones/)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("AI & Data"));
    expect(within(screen.getByTestId("estimator-roles")).getByText("Data / ML engineers")).toBeInTheDocument();
  });

  it("ongoing-support switch toggles and is locked on for managed services", () => {
    render(<InteractiveEstimator />);
    const toggle = screen.getByRole("switch", { name: "Ongoing support needed?" });
    expect(toggle).toHaveAttribute("aria-checked", "true");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(within(screen.getByTestId("estimator-roles")).queryByText("Production support")).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Managed service"));
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(toggle).toBeDisabled();
    expect(screen.getByText("Included in a managed service.")).toBeInTheDocument();
  });

  it("U.S. involvement changes leadership allocation and copy", () => {
    render(<InteractiveEstimator />);
    fireEvent.click(screen.getByLabelText("High"));
    expect(screen.getByText(/embedded in your rhythm/)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Light"));
    expect(screen.getByText(/Day-to-day coordination runs through the delivery team/)).toBeInTheDocument();
  });
});

describe("providers and content pages", () => {
  it("MotionProvider renders its children", () => {
    render(
      <MotionProvider>
        <p>Inside motion</p>
      </MotionProvider>,
    );
    expect(screen.getByText("Inside motion")).toBeInTheDocument();
  });

  it.each(["privacy", "terms", "accessibility"] as const)("renders the %s starter template with its review banner", async (slug) => {
    const page = await LegalPage({ slug, path: `/${slug}` });
    render(<MDXProvider components={getMdxComponents()}>{page}</MDXProvider>);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("note")).toHaveTextContent("not yet legally reviewed");
    expect(screen.getAllByRole("link", { name: "our contact page" }).length).toBeGreaterThan(0);
  });
});
