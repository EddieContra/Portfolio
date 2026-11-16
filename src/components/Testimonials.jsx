import { useEffect, useRef, useState } from 'react';
import { TESTIMONIALS } from '../data/testimonials';
import { asset } from '../lib/assets';
import { useReducedMotion } from '../hooks/useMediaQuery';
import { useInView } from '../hooks/useInView';
import SectionHeader, { headingId } from './SectionHeader';
import Icon from './Icon';

const DURATION = 8000;
const total = TESTIMONIALS.length;

/**
 * Testimonial carousel. All quotes share one grid cell, so the tallest one
 * sets the height and nothing below ever shifts. It advances by itself only
 * while on screen, and stops for good once the visitor takes control (buttons,
 * dots, swipe or the pause button).
 */
export default function Testimonials() {
  const sectionRef = useRef(null);
  const swipe = useRef(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hold, setHold] = useState(false);          // hover / focus inside
  const reduced = useReducedMotion();
  const onScreen = useInView(sectionRef, { once: false });
  const running = playing && !hold && !reduced && onScreen && total > 1;

  useEffect(() => {
    if (!running) return undefined;
    const id = setTimeout(() => setActive((i) => (i + 1) % total), DURATION);
    return () => clearTimeout(id);
  }, [running, active]);

  const goTo = (i) => { setPlaying(false); setActive((i + total) % total); };

  const onPointerDown = (event) => { swipe.current = event.clientX; };
  const onPointerUp = (event) => {
    if (swipe.current === null) return;
    const dx = event.clientX - swipe.current;
    swipe.current = null;
    if (Math.abs(dx) > 48) goTo(active + (dx < 0 ? 1 : -1));
  };

  return (
    <section id="testimonials" ref={sectionRef} aria-labelledby={headingId('testimonials')} className="section">
      <div className="wrap">
        <SectionHeader id="testimonials" />

        <div
          role="group"
          aria-roledescription="carousel"
          aria-labelledby={headingId('testimonials')}
          onMouseEnter={() => setHold(true)}
          onMouseLeave={() => setHold(false)}
          onFocusCapture={() => setHold(true)}
          onBlurCapture={() => setHold(false)}
        >
          <div
            className="grid touch-pan-y"
            aria-live={playing ? 'off' : 'polite'}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            {TESTIMONIALS.map((item, i) => {
              const shown = i === active;
              const photo = asset(item.img);
              return (
                <figure
                  key={item.name + i}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${total}`}
                  aria-hidden={!shown}
                  className={`col-start-1 row-start-1 m-0 transition-[opacity,transform] duration-700 ease-out ${shown ? 'opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}
                >
                  <Icon name="quote" size={40} className="mb-6 text-accent" />
                  <blockquote className="m-0 max-w-4xl font-disp text-[clamp(1.45rem,3.4vw,2.6rem)] font-bold leading-[1.22] tracking-[-0.02em] text-text">
                    <p className="m-0">{item.quote}</p>
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-4">
                    <span className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-bg3 text-sm font-bold text-text" aria-hidden="true">
                      {item.avatar}
                      {photo && <img src={photo} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />}
                    </span>
                    <span>
                      <span className="block font-semibold text-text">{item.name}</span>
                      <span className="block text-sm text-muted">{item.role}</span>
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>

          {total > 1 && (
            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-edge pt-6">
              <div className="flex gap-2">
                <button type="button" className="icon-btn" onClick={() => goTo(active - 1)} aria-label="Previous testimonial">
                  <Icon name="arrowLeft" size={18} />
                </button>
                <button type="button" className="icon-btn" onClick={() => goTo(active + 1)} aria-label="Next testimonial">
                  <Icon name="arrowRight" size={18} />
                </button>
              </div>

              <div className="flex items-center">
                {TESTIMONIALS.map((item, i) => (
                  <button
                    key={item.name + i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Show testimonial ${i + 1} of ${total}`}
                    aria-current={i === active ? 'true' : undefined}
                    className="grid h-11 w-9 cursor-pointer place-items-center"
                  >
                    <span className={`relative block h-1 overflow-hidden rounded-full transition-[width,background-color] duration-500 ease-out ${i === active ? 'w-9 bg-edge' : 'w-3 bg-muted/60'}`}>
                      {i === active && (
                        <span
                          key={`${active}-${running}`}
                          className="absolute inset-0 origin-left rounded-full bg-accent-ink"
                          style={running ? { animation: `fill-x ${DURATION}ms linear both` } : undefined}
                        />
                      )}
                    </span>
                  </button>
                ))}
              </div>

              {!reduced && (
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? 'Pause testimonials' : 'Play testimonials'}
                  className="icon-btn ml-auto"
                >
                  <Icon name={playing ? 'pause' : 'play'} size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
