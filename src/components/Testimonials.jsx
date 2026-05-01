import { useEffect, useState } from 'react';
import { TESTIMONIALS } from '../data/testimonials';

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const total = TESTIMONIALS.length;

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % total), 6000);
    return () => clearInterval(id);
  }, [total]);

  const t = TESTIMONIALS[active];

  return (
    <section id="testimonials" className="py-20 sm:py-28 div-thick">
      <div className="wrap">
        <span className="sec-label">Kind words</span>
        <h2 className="sec-title rv">Testimonials</h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-0 border-2 border-text">
          <blockquote
            key={active}
            className="animate-up p-6 sm:p-8 lg:border-r-2 lg:border-text max-lg:border-b-2 max-lg:border-text"
          >
            <p className="font-disp text-lg sm:text-xl md:text-2xl text-text leading-snug uppercase">
              <span aria-hidden="true">&ldquo;</span>{t.quote}<span aria-hidden="true">&rdquo;</span>
            </p>
            <footer className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 grid place-items-center bg-text text-bg font-disp text-sm border-2 border-text uppercase">
                {t.avatar}
              </div>
              <div>
                <div className="text-text font-bold text-sm uppercase tracking-wide">{t.name}</div>
                <div className="text-muted text-xs uppercase tracking-[.15em]">{t.role}</div>
              </div>
            </footer>
          </blockquote>

          <div role="tablist" aria-label="Choose testimonial">
            {TESTIMONIALS.map((tt, i) => (
              <button
                key={tt.name + i}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={[
                  'w-full text-left p-4 sm:p-5 transition-colors cursor-pointer',
                  i < TESTIMONIALS.length - 1 ? 'border-b-2 border-text' : '',
                  i === active ? 'bg-text text-bg' : 'bg-bg text-text hover:bg-bg2',
                ].join(' ')}
              >
                <div className="text-[.6rem] tracking-[.2em] uppercase font-bold opacity-70 mb-1">
                  {tt.role}
                </div>
                <div className="text-sm font-bold uppercase tracking-wide">
                  {tt.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
