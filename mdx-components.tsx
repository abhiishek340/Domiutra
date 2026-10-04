import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps, ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { site } from "@/lib/site";

/* ---------- Components available inside MDX without importing ---------- */

function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="not-prose my-10 rounded-md border border-line-dark-strong bg-white p-6 md:p-7">
      {title && <p className="label-mono text-mint-deep">{title}</p>}
      <div className="mt-3 space-y-3 text-[0.98rem] leading-relaxed text-ink-text [&_li]:ml-4 [&_li]:list-disc [&_ol_li]:list-decimal">
        {children}
      </div>
    </aside>
  );
}

function KeyTakeaways({ items }: { items: string[] }) {
  return (
    <aside aria-label="Key takeaways" className="my-10 border-y border-line-dark-strong py-6">
      <p className="label-mono text-ink-text">Key takeaways</p>
      <ol className="mt-4 space-y-3 !pl-0" style={{ listStyle: "none" }}>
        {items.map((item, i) => (
          <li key={item} className="grid grid-cols-[2rem_1fr] text-[0.98rem] leading-relaxed text-ink-text">
            <span className="font-mono text-xs leading-7 text-mint-deep">0{i + 1}</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}

/** Marks starter legal text that must be reviewed by counsel before relying on it. */
function ReviewNote({ inline, children }: { inline?: boolean; children?: ReactNode }) {
  if (inline) {
    return (
      <span className="my-4 flex gap-2 rounded-sm border border-dashed border-amber-600/50 bg-amber-50 px-3 py-2 text-sm text-amber-900">
        <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <span>
          <strong className="font-semibold">Requires review: </strong>
          {children}
        </span>
      </span>
    );
  }
  return (
    <aside className="mb-10 flex gap-3 rounded-md border border-amber-600/40 bg-amber-50 p-5 text-amber-950" role="note">
      <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <div className="text-sm leading-relaxed">
        <p className="font-semibold">Starter template: not yet legally reviewed.</p>
        <p className="mt-1">
          This document is a starting point prepared for Domiutra and has not been reviewed by legal counsel. Sections marked “Requires review” need business-specific information or legal input before this policy is relied upon.
        </p>
      </div>
    </aside>
  );
}

/** Renders the configured public email, or a link to the contact page. */
function ContactLine() {
  if (site.publicEmail) {
    return <a href={`mailto:${site.publicEmail}`}>{site.publicEmail}</a>;
  }
  return <Link href="/contact">our contact page</Link>;
}

/* ---------- Element overrides ---------- */

function Anchor({ href = "", children, ...rest }: ComponentProps<"a">) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

function Table(props: ComponentProps<"table">) {
  return (
    <div className="table-wrap" role="region" aria-label="Table" tabIndex={0}>
      <table {...props} />
    </div>
  );
}

const components: MDXComponents = {
  a: Anchor,
  table: Table,
  Callout,
  KeyTakeaways,
  ReviewNote,
  ContactLine,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
