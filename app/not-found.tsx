import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { services } from "@/lib/data/services";

// Next.js adds `noindex` to not-found responses automatically.
export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden pt-32 pb-24">
      <div aria-hidden="true" className="bg-grid mask-radial pointer-events-none absolute inset-0 opacity-40" />
      <div className="container-site relative grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="label-mono text-mint">Error 404 · route not found</p>
          <h1 className="mt-6 text-h1 font-semibold">This path doesn’t lead anywhere.</h1>
          <p className="mt-6 max-w-lg text-lead text-fg-muted">
            The page may have moved, or the link may be mistyped. Here are a few reliable places to continue.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <ButtonLink href="/" size="lg" arrow>Back to home</ButtonLink>
            <ButtonLink href="/contact" variant="ghost" size="lg" arrow>Talk to Domiutra</ButtonLink>
          </div>
        </div>
        <nav aria-label="Services" className="lg:col-span-4 lg:col-start-9">
          <p className="label-mono text-fg-subtle">Services</p>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="flex items-center gap-3 py-3 text-sm text-fg-muted hover:text-fg">
                  <span className="font-mono text-xs text-mint">{s.number}</span>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
