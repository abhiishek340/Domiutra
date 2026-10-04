import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Reveal } from "@/components/animations/Reveal";

type Props = {
  eyebrow?: string;
  index?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "split";
  tone?: "dark" | "light";
  as?: "h1" | "h2";
  className?: string;
  id?: string;
};

export function Eyebrow({
  children,
  index,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  index?: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "label-mono flex items-center gap-3",
        tone === "dark" ? "text-fg-muted" : "text-ink-text-muted",
        className,
      )}
    >
      {index && <span className={tone === "dark" ? "text-mint" : "text-mint-deep"}>{index}</span>}
      <span className={cn("h-px w-6", tone === "dark" ? "bg-line-strong" : "bg-line-dark-strong")} aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

/**
 * Section heading with two layouts: stacked ("left") or an editorial
 * split where the title and intro sit on different columns.
 */
export function SectionHeading({
  eyebrow,
  index,
  title,
  intro,
  align = "left",
  tone = "dark",
  as: Tag = "h2",
  className,
  id,
}: Props) {
  const muted = tone === "dark" ? "text-fg-muted" : "text-ink-text-muted";
  if (align === "split") {
    return (
      <div className={cn("grid gap-6 md:grid-cols-12 md:gap-8", className)}>
        <Reveal className="md:col-span-7">
          {eyebrow && <Eyebrow index={index} tone={tone} className="mb-6">{eyebrow}</Eyebrow>}
          <Tag id={id} className="text-h2 font-semibold">{title}</Tag>
        </Reveal>
        {intro && (
          <Reveal delay={0.08} className={cn("md:col-span-4 md:col-start-9 md:self-end", muted)}>
            <div className="text-lead">{intro}</div>
          </Reveal>
        )}
      </div>
    );
  }
  return (
    <Reveal className={cn("max-w-3xl", className)}>
      {eyebrow && <Eyebrow index={index} tone={tone} className="mb-6">{eyebrow}</Eyebrow>}
      <Tag id={id} className="text-h2 font-semibold">{title}</Tag>
      {intro && <div className={cn("text-lead mt-6 max-w-2xl", muted)}>{intro}</div>}
    </Reveal>
  );
}
