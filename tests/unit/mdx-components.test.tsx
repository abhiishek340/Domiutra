import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ComponentType, ReactNode } from "react";
import { useMDXComponents as getMdxComponents } from "@/mdx-components";

type Props = Record<string, unknown> & { children?: ReactNode };
type Key = "Callout" | "KeyTakeaways" | "ReviewNote" | "ContactLine" | "a" | "table";
const c = getMdxComponents() as unknown as Record<Key, ComponentType<Props>>;

describe("MDX components", () => {
  it("renders callouts and key takeaways", () => {
    const { Callout, KeyTakeaways } = c;
    render(
      <>
        <Callout title="Remember">Body text</Callout>
        <KeyTakeaways items={["First point", "Second point"]} />
      </>,
    );
    expect(screen.getByText("Remember")).toBeInTheDocument();
    expect(screen.getByRole("complementary", { name: "Key takeaways" })).toHaveTextContent("First point");
    expect(screen.getByText("02")).toBeInTheDocument();
  });

  it("marks legal text as unreviewed, in banner and inline forms", () => {
    const { ReviewNote } = c;
    render(
      <>
        <ReviewNote />
        <ReviewNote inline>Insert legal entity name.</ReviewNote>
      </>,
    );
    expect(screen.getByRole("note")).toHaveTextContent("not yet legally reviewed");
    expect(screen.getByText("Insert legal entity name.")).toBeInTheDocument();
  });

  it("ContactLine never invents an address: links to the contact page when no email is configured", () => {
    const { ContactLine } = c;
    render(<ContactLine />);
    expect(screen.getByRole("link", { name: "our contact page" })).toHaveAttribute("href", "/contact");
  });

  it("keeps internal links in-app and opens external links safely", () => {
    const { a: Anchor } = c;
    render(
      <>
        <Anchor href="/services">Services</Anchor>
        <Anchor href="https://example.com">External</Anchor>
      </>,
    );
    expect(screen.getByRole("link", { name: "Services" })).not.toHaveAttribute("target");
    expect(screen.getByRole("link", { name: "External" })).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("wraps tables in a keyboard-scrollable region", () => {
    const { table: Table } = c;
    render(
      <Table>
        <tbody>
          <tr>
            <td>Cell</td>
          </tr>
        </tbody>
      </Table>,
    );
    expect(screen.getByRole("region", { name: "Table" })).toHaveAttribute("tabindex", "0");
  });
});
