import { useEffect, useState } from 'react';
import { TESTIMONIALS } from '../data/testimonials';
import { useReducedMotion } from '../hooks/useReducedMotion';

const DURATION = 7000;

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const total = TESTIMONIALS.length;
  const autoplay = !paused && !reduced;

  useEffect(() => {
    if (!autoplay) return;
    const id = setTimeout(() => setActive((i) => (i + 1) % total), DURATION);
    return () => clearTimeout(id);
  }, [active, autoplay, total]);

  const t = TESTIMONIALS[active];

  return (
    <section id="testimonials" className="relative py-28 sm:py-40 overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 glow-top" />
      <div
        className="wrap relative text-center"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <span className="sec-label rv">Kind words</span>

        <blockquote key={active} className="mx-auto max-w-4xl min-h-[14rem] sm:min-h-[12rem] flex flex-col items-center justify-center">
          <p className="font-disp font-semibold tracking-apple leading-[1.18] text-[clamp(1.6rem,3.6vw,2.75rem)] text-text opacity-0 animate-up">
            <span className="text-accent" aria-hidden="true">“</span>
            {t.quote}
            <span className="text-accent" aria-hidden="true">”</span>
          </p>
          <footer className="mt-8 flex items-center gap-3 opacity-0 animate-up [animation-delay:.15s]">
            <div className="relative w-11 h-11 grid place-items-center bg-bg3 text-text font-semibold rounded-full text-sm overflow-hidden">
              {t.avatar}
              {t.img && (
                <img
                  src={`${import.meta.env.BASE_URL}${t.img}`}
                  alt={t.name}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </div>
            <div className="text-left">
              <div className="text-text font-semibold text-[.95rem]">{t.name}</div>
              <div className="text-muted text-sm">{t.role}</div>
            </div>
          </footer>
        </blockquote>

        {/* Apple-style pagination with progress fill */}
        <div className="mt-12 inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-bg3/70 backdrop-blur" role="tablist" aria-label="Choose testimonial">
          {TESTIMONIALS.map((tt, i) => {
            const on = i === active;
            return (
              <button
                key={tt.name + i}
                type="button"
                role="tab"
                aria-selected={on}
                aria-label={`${tt.name}, ${tt.role}`}
                onClick={() => setActive(i)}
                className={[
                  'relative h-2 rounded-full overflow-hidden cursor-pointer transition-all duration-500 ease-apple',
                  on ? 'w-12 bg-muted/40' : 'w-2 bg-muted/50 hover:bg-muted',
                ].join(' ')}
              >
                {on && (
                  <span
                    key={`${active}-${autoplay}`}
                    className="absolute inset-0 bg-text origin-left rounded-full"
                    style={autoplay
                      ? { animation: `progress ${DURATION}ms linear forwards` }
                      : { transform: 'scaleX(1)' }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
