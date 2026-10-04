import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { footerNav, legalNav } from "@/lib/data/navigation";
import { site } from "@/lib/site";

const socialLabels: Record<keyof typeof site.social, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  x: "X",
};

export function Footer() {
  const socials = (Object.keys(site.social) as (keyof typeof site.social)[])
    .map((key) => ({ key, url: site.social[key] }))
    .filter((s): s is { key: keyof typeof site.social; url: string } => Boolean(s.url));

  return (
    <footer className="border-t border-line bg-ink-950">
      <div className="container-site">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 py-14 md:grid-cols-12 md:py-16">
          <div className="col-span-2 md:col-span-5">
            <Link href="/" className="inline-block rounded-sm text-fg" aria-label="Domiutra home">
              <Logo />
            </Link>
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-fg-muted">
              U.S.-managed engineering, cloud, AI, and operations. Build. Modernize. Operate.
            </p>
            {site.publicEmail && (
              <a href={`mailto:${site.publicEmail}`} className="mt-6 inline-block text-sm text-fg-muted underline-offset-4 hover:text-fg hover:underline">
                {site.publicEmail}
              </a>
            )}
          </div>

          {Object.entries(footerNav).map(([heading, links], i) => (
            <nav key={heading} aria-label={`${heading} links`} className={i === 0 ? "md:col-span-3 md:col-start-7" : "md:col-span-3"}>
              <h2 className="label-mono text-fg-subtle">{heading}</h2>
              <ul className="mt-5 space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-fg-muted transition-colors hover:text-fg">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-6 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Domiutra. All rights reserved.</p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legalNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-fg">
                    {link.label}
                  </Link>
                </li>
              ))}
              {socials.map((s) => (
                <li key={s.key}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-fg">
                    {socialLabels[s.key]}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
