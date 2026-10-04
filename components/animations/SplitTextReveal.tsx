type Props = {
  text: string;
  className?: string;
  /** Seconds before the first word starts. */
  delay?: number;
  /** Seconds between words. */
  stagger?: number;
};

/**
 * Word-by-word entrance for display headlines. Pure CSS (server component),
 * so it runs before hydration and doesn't hold back Largest Contentful Paint.
 * Words remain real text separated by real spaces: the heading's text content
 * (for crawlers and assistive tech) is exactly `text`, never duplicated.
 */
export function SplitTextReveal({ text, className, delay = 0, stagger = 0.06 }: Props) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <span className="animate-rise inline-block" style={{ animationDelay: `${delay + i * stagger}s` }}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
