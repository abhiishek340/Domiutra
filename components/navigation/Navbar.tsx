"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";
import { primaryNav } from "@/lib/data/navigation";
import { cn } from "@/lib/utils/cn";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const servicesBtn = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mega-menu on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  const close = useCallback((restoreFocus = false) => {
    setMenuOpen(false);
    if (restoreFocus) servicesBtn.current?.focus();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    const onClick = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [menuOpen, close]);

  const openWithIntent = () => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setMenuOpen(true), 90);
  };
  const closeWithIntent = () => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setMenuOpen(false), 160);
  };

  const solid = scrolled || menuOpen;

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        solid
          ? "border-b border-line bg-ink-950/92 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className={cn(
          "container-site flex items-center justify-between gap-6 transition-[height] duration-300",
          scrolled ? "h-14" : "h-18 lg:h-20",
        )}
      >
        <Link href="/" className="rounded-sm text-fg" aria-label="Domiutra home">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => {
            const active = isActive(pathname, item.href);
            if (item.href === "/services") {
              return (
                <li key={item.href} onMouseEnter={openWithIntent} onMouseLeave={closeWithIntent}>
                  <button
                    ref={servicesBtn}
                    type="button"
                    aria-expanded={menuOpen}
                    aria-controls={menuId}
                    onClick={() => setMenuOpen((o) => !o)}
                    className={cn(
                      "relative inline-flex h-9 items-center gap-1 rounded-sm px-3 text-sm transition-colors",
                      active || menuOpen ? "text-fg" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      aria-hidden="true"
                      className={cn("size-3.5 transition-transform duration-200", menuOpen && "rotate-180")}
                    />
                    {active && <ActiveBar />}
                  </button>
                </li>
              );
            }
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative inline-flex h-9 items-center rounded-sm px-3 text-sm transition-colors",
                    active ? "text-fg" : "text-fg-muted hover:text-fg",
                  )}
                >
                  {item.label}
                  {active ? (
                    <ActiveBar />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3 -bottom-px h-px origin-left scale-x-0 bg-fg/40 transition-transform duration-300 ease-out group-hover:scale-x-100"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <ButtonLink href="/contact" size="md">
              Talk to Domiutra
            </ButtonLink>
          </span>
          <MobileNav pathname={pathname} />
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <m.div
            id={menuId}
            key="mega"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => window.clearTimeout(hoverTimer.current)}
            onMouseLeave={closeWithIntent}
            className="absolute inset-x-0 top-full hidden border-b border-line bg-ink-950/95 backdrop-blur-xl lg:block"
          >
            <MegaMenu onNavigate={() => close()} />
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function ActiveBar() {
  return (
    <m.span
      layoutId="nav-active"
      aria-hidden="true"
      className="absolute inset-x-3 -bottom-px h-px bg-mint"
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
    />
  );
}
