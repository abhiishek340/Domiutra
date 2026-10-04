import Link from "next/link";
import { JsonLd } from "@/components/content/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo/jsonld";
import { cn } from "@/lib/utils/cn";

/** Visible breadcrumbs plus matching BreadcrumbList structured data. */
export function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const all: Crumb[] = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className={cn("label-mono flex flex-wrap items-center gap-2", tone === "dark" ? "text-fg-subtle" : "text-ink-text-muted")}>
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className={tone === "dark" ? "text-fg-muted" : "text-ink-text"}>
                    {c.name}
                  </span>
                ) : (
                  <>
                    <Link href={c.path} className="transition-colors hover:text-mint">
                      {c.name}
                    </Link>
                    <span aria-hidden="true">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </>
  );
}
