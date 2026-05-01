import { NOW_CARDS } from '../data/now';

export default function Currently() {
  return (
    <section id="currently" className="py-20 sm:py-28 div-thick">
      <div className="wrap">
        <span className="sec-label">Right now</span>
        <h2 className="sec-title rv">Currently</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-2 border-text">
          {NOW_CARDS.map((c, i) => (
            <article
              key={c.title}
              className={[
                'group flex gap-4 items-start p-5 sm:p-6 transition-colors duration-300',
                'hover:bg-text hover:text-bg',
                i % 2 === 0 ? 'sm:border-r-2 sm:border-text' : '',
                i < NOW_CARDS.length - 2 ? 'border-b-2 border-text' : '',
                i < NOW_CARDS.length - 1 && i % 2 === 0 ? 'max-sm:border-b-2 max-sm:border-text' : '',
                `rv rv-d${i + 1}`,
              ].join(' ')}
            >
              <div className="text-2xl shrink-0 mt-0.5" aria-hidden="true">{c.icon}</div>
              <div className="min-w-0">
                <div className="text-[.65rem] tracking-[.2em] uppercase mb-1 font-bold opacity-70">
                  {c.label}
                </div>
                <h3 className="font-disp text-lg sm:text-xl uppercase tracking-tight leading-tight mb-2">
                  {c.title}
                </h3>
                <p className="text-sm leading-relaxed opacity-80">{c.sub}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
