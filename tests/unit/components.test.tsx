import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { InteractiveEstimator } from "@/components/forms/InteractiveEstimator";
import { FAQ } from "@/components/sections/FAQ";
import { serializeJsonLd } from "@/lib/seo/jsonld";

describe("InteractiveEstimator", () => {
  it("updates the team when the delivery model changes", () => {
    render(<InteractiveEstimator />);
    const roles = screen.getByTestId("estimator-roles");
    expect(within(roles).queryByText("Support engineers")).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Managed service"));

    expect(within(screen.getByTestId("estimator-roles")).getByText("Support engineers")).toBeInTheDocument();
    expect(screen.getByText("Service owner")).toBeInTheDocument();
  });

  it("shows the illustrative disclaimer", () => {
    render(<InteractiveEstimator />);
    expect(screen.getByText(/Illustrative planning tool/)).toBeInTheDocument();
  });
});

describe("FAQ", () => {
  const items = [
    { question: "First?", answer: "Answer one." },
    { question: "Second?", answer: "Answer two." },
  ];

  it("exposes expanded state and toggles panels", () => {
    render(<FAQ items={items} />);
    const first = screen.getByRole("button", { name: "First?" });
    const second = screen.getByRole("button", { name: "Second?" });
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(second).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(second);
    expect(second).toHaveAttribute("aria-expanded", "true");
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("region", { name: "Second?" })).toHaveTextContent("Answer two.");
  });
});

describe("serializeJsonLd", () => {
  it("escapes < to prevent script injection", () => {
    const out = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("</script>");
    expect(out).toContain("\\u003c/script>");
  });
});
