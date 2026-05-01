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
    <section id="testimonials" className="py-20 sm:py-28 border-t border-edge">
      <div className="wrap">
        <span className="sec-label">Kind words</span>
        <h2 className="sec-title rv">Testimonials</h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14 items-start">
          <blockquote key={active} className="animate-up">
            <p className="text-lg sm:text-xl md:text-2xl text-text leading-relaxed">
              <span className="text-accent font-bold mr-1" aria-hidden="true">&ldquo;</span>
              {t.quote}
              <span className="text-accent font-bold ml-1" aria-hidden="true">&rdquo;</span>
            </p>
            <footer className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 grid place-items-center bg-text text-bg font-bold rounded-full text-sm">
                {t.avatar}
              </div>
              <div>
                <div className="text-text font-medium text-sm">{t.name}</div>
                <div className="text-muted text-xs">{t.role}</div>
              </div>
            </footer>
          </blockquote>

          <div className="space-y-2" role="tablist" aria-label="Choose testimonial">
            {TESTIMONIALS.map((tt, i) => (
              <button
                key={tt.name + i}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={[
                  'w-full text-left p-4 border rounded-xl transition-colors cursor-pointer',
                  i === active
                    ? 'border-accent bg-accent/[.06]'
                    : 'border-edge hover:border-muted',
                ].join(' ')}
              >
                <div className="text-[.65rem] tracking-wide uppercase text-muted mb-1">
                  {tt.role}
                </div>
                <div className={`text-sm ${i === active ? 'text-text font-medium' : 'text-muted'}`}>
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
