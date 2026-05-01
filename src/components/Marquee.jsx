// Scrolling text strip — pauses on hover. Honors prefers-reduced-motion via CSS.
// Renders content twice in the same track so the -50% translate loops seamlessly.

export default function Marquee({ items, speed = 32 }) {
  const Block = ({ ariaHidden = false }) => (
    <div
      className="flex items-center gap-12 pr-12 shrink-0"
      aria-hidden={ariaHidden ? 'true' : undefined}
    >
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-12">
          <span>{it}</span>
          <span aria-hidden="true" className="text-text/60">●</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden border-y-2 border-text bg-bg py-4 select-none">
      <div
        className="marquee-track text-text font-disp uppercase tracking-wide text-xl sm:text-2xl"
        style={{ animationDuration: `${speed}s` }}
      >
        <Block />
        <Block ariaHidden />
      </div>
    </div>
  );
}
