import { useRef } from 'react';
import { EXPERIENCE } from '../data/experience';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useReducedMotion } from '../hooks/useMediaQuery';
import SectionHeader, { headingId } from './SectionHeader';

export default function Experience() {
  const listRef = useRef(null);
  const reduced = useReducedMotion();
  // --p fills the timeline rail as the list scrolls through the middle of the screen.
  useScrollProgress(listRef, { start: 0.62, end: 0.62, enabled: !reduced });

  return (
    <section id="experience" aria-labelledby={headingId('experience')} className="section border-y border-edge bg-bg2">
      <div className="wrap">
        <SectionHeader id="experience" />

        <ol ref={listRef} className="relative m-0 list-none p-0">
          <span aria-hidden="true" className="absolute bottom-2 left-[5px] top-2 w-px bg-edge md:left-[13.5rem]" />
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-accent md:left-[13.5rem]"
            style={{ transform: 'scaleY(var(--p, 1))' }}
          />

          {EXPERIENCE.map((item) => (
            <li
              key={`${item.role}-${item.company}`}
              className="rv relative grid grid-cols-1 pb-14 pl-9 last:pb-0 md:grid-cols-[13.5rem_minmax(0,1fr)] md:pl-0"
            >
              <span aria-hidden="true" className="absolute left-0 top-[.45rem] h-[11px] w-[11px] rounded-full bg-accent ring-4 ring-bg2 md:left-[13.5rem] md:-translate-x-[5px]" />

              <p className="mb-2 text-sm font-medium tabular-nums text-muted md:sticky md:top-28 md:mb-0 md:self-start md:pr-10 md:pt-0.5 md:text-right">
                {item.date}
              </p>

              <div className="md:pl-12">
                <h3 className="text-[1.3rem] font-bold leading-snug tracking-tight text-text sm:text-[1.55rem]">{item.role}</h3>
                <p className="mb-5 mt-1 font-semibold text-accent-ink">{item.company}</p>
                <ul className="m-0 max-w-2xl list-none space-y-2.5 p-0 text-[.98rem] leading-relaxed text-muted">
                  {item.points.map((point, i) => (
                    <li key={i} className="relative pl-5">
                      <span aria-hidden="true" className="absolute left-0 top-[.72em] h-1 w-1 rounded-full bg-muted" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
