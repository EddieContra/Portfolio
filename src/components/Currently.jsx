import { NOW_CARDS } from '../data/now';

export default function Currently() {
  return (
    <section id="currently" className="py-20 sm:py-28 border-t border-edge">
      <div className="wrap">
        <span className="sec-label">Right now</span>
        <h2 className="sec-title rv">Currently</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {NOW_CARDS.map((c, i) => (
            <article
              key={c.title}
              className={`flex gap-4 items-start p-5 rounded-2xl border border-edge bg-bg2 transition-colors hover:border-accent/50 rv rv-d${i + 1}`}
            >
              <div className="text-2xl shrink-0 mt-0.5" aria-hidden="true">{c.icon}</div>
              <div className="min-w-0">
                <div className="text-[.65rem] tracking-[.18em] uppercase text-accent mb-1 font-semibold">
                  {c.label}
                </div>
                <h3 className="font-bold text-base text-text mb-1.5 leading-snug">
                  {c.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{c.sub}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
