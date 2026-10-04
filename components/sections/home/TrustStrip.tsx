const principles = ["U.S.-managed", "Global delivery", "Security-first", "Flexible engagement", "Outcome-focused"];

/** Operating principles in place of client logos. */
export function TrustStrip() {
  return (
    <section aria-label="How Domiutra operates" className="border-y border-line">
      <ul className="container-site flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-6">
        {principles.map((p, i) => (
          <li key={p} className="flex items-center gap-2.5 text-sm text-fg-muted">
            <span className="font-mono text-[0.65rem] text-mint">0{i + 1}</span>
            {p}
          </li>
        ))}
      </ul>
    </section>
  );
}
