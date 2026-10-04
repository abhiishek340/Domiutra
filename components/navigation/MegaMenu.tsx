import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { servicesMenu } from "@/lib/data/navigation";

// Build gets the most room; Explore is set apart as a utility column.
const spans = ["col-span-4", "col-span-3", "col-span-2", "col-span-3 border-l border-line pl-8"];

export function MegaMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="container-site grid grid-cols-12 gap-8 py-10">
      {servicesMenu.map((col, i) => {
        const explore = col.heading === "Explore";
        return (
          <div key={col.heading} className={spans[i] ?? "col-span-3"}>
            <p className="label-mono text-mint">{col.heading}</p>
            <p className="mt-1 text-xs text-fg-subtle">{col.caption}</p>
            <ul className="mt-5 space-y-1">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className="group -mx-3 block rounded-sm px-3 py-2.5 transition-colors hover:bg-white/[0.04]"
                  >
                    <span className="flex items-center gap-1.5 text-sm font-medium text-fg">
                      {link.label}
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-3.5 text-fg-subtle opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
                      />
                    </span>
                    {link.description && !explore && (
                      <span className="mt-1 block text-xs leading-relaxed text-fg-muted">{link.description}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
