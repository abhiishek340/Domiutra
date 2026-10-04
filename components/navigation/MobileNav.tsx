"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m } from "motion/react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { primaryNav } from "@/lib/data/navigation";
import { services } from "@/lib/data/services";
import { cn } from "@/lib/utils/cn";

const noopSubscribe = () => () => {};
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen mobile navigation. Implements the modal dialog pattern:
 * focus moves in on open, is trapped while open, Escape closes, focus returns
 * to the trigger, and the page behind is inert and doesn't scroll.
 */
export function MobileNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // True only on the client, so the portal target (document.body) exists.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const main = document.getElementById("main");
    const footer = document.querySelector("footer");
    document.documentElement.style.overflow = "hidden";
    main?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");

    const focusFirst = window.setTimeout(() => {
      // Start on the close button: predictable for keyboard and screen-reader users.
      panel.current?.querySelector<HTMLElement>('button[aria-label="Close menu"]')?.focus();
    }, 20);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const nodes = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const triggerEl = trigger.current;
    return () => {
      window.clearTimeout(focusFirst);
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
      triggerEl?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="inline-flex size-10 items-center justify-center rounded-sm border border-line text-fg lg:hidden"
        aria-label="Open menu"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <m.div
                key="mobile-nav"
                ref={panel}
                role="dialog"
                aria-modal="true"
                aria-label="Site menu"
                className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink-950 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.18 } }}
                transition={{ duration: 0.25 }}
              >
                <div className="container-site flex h-18 shrink-0 items-center justify-between border-b border-line">
                  <Link href="/" className="rounded-sm" onClick={() => setOpen(false)}>
                    <Logo />
                  </Link>
                  <button
                    type="button"
                    className="inline-flex size-10 items-center justify-center rounded-sm border border-line"
                    aria-label="Close menu"
                    onClick={() => setOpen(false)}
                  >
                    <X className="size-5" aria-hidden="true" />
                  </button>
                </div>

                <m.nav
                  aria-label="Mobile"
                  className="container-site flex flex-1 flex-col gap-10 py-8"
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } } }}
                >
                  <ul className="space-y-1">
                    {primaryNav.map((item) => {
                      const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                      return (
                        <m.li
                          key={item.href}
                          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                        >
                          <Link
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex items-baseline justify-between py-2 text-[2rem] font-semibold tracking-tight",
                              active ? "text-mint" : "text-fg",
                            )}
                          >
                            {item.label}
                          </Link>
                        </m.li>
                      );
                    })}
                  </ul>

                  <m.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                    <p className="label-mono text-fg-subtle">Services</p>
                    <ul className="mt-3 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
                      {services.map((s) => (
                        <li key={s.slug}>
                          <Link
                            href={`/services/${s.slug}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 border-b border-line py-3 text-sm text-fg-muted hover:text-fg"
                          >
                            <span className="font-mono text-xs text-mint">{s.number}</span>
                            {s.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </m.div>

                  <m.div
                    className="mt-auto"
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                  >
                    <ButtonLink href="/contact" size="lg" arrow className="w-full" onClick={() => setOpen(false)}>
                      Talk to Domiutra
                    </ButtonLink>
                  </m.div>
                </m.nav>
              </m.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
