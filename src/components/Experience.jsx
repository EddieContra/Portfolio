import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, MQ } from '../lib/motion';
import { EXPERIENCE } from '../data/experience';

export default function Experience() {
  const listRef = useRef(null);
  const fillRef = useRef(null);

  // The timeline rail fills with blue as you scroll through the entries.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.fromTo(
        fillRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: listRef.current, start: 'top 65%', end: 'bottom 65%', scrub: 0.4 },
        }
      );
      listRef.current.querySelectorAll('[data-dot]').forEach((dot) => {
        gsap.fromTo(
          dot,
          { scale: 0.35, opacity: 0.35 },
          {
            scale: 1,
            opacity: 1,
            scrollTrigger: { trigger: dot, start: 'top 65%', toggleActions: 'play none none reverse' },
            duration: 0.4,
          }
        );
      });
    });
    return () => mm.revert();
  }, { scope: listRef });

  return (
    <section id="experience" className="relative py-28 sm:py-40 bg-bg2/40 dark:bg-bg2/30">
      <div className="wrap">
        <span className="sec-label rv">Experience &amp; education</span>
        <h2 className="sec-title rv rv-d1">Where I've worked.</h2>

        <ol ref={listRef} className="relative ml-2 md:ml-0">
          {/* rail */}
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-0 md:left-[13.5rem] w-px bg-edge" />
          <span
            ref={fillRef}
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-0 md:left-[13.5rem] w-px origin-top bg-gradient-to-b from-accent via-accent to-[#a78bfa]"
          />

          {EXPERIENCE.map((e) => (
            <li
              key={`${e.role}-${e.company}`}
              className="relative grid grid-cols-1 md:grid-cols-[13.5rem_1fr] pb-16 last:pb-0"
            >
              <div className="pl-8 md:pl-0 md:pr-10 md:text-right mb-2 md:mb-0">
                <div className="md:sticky md:top-28 text-sm font-medium text-muted tabular-nums rv">{e.date}</div>
              </div>

              <span aria-hidden="true" className="absolute left-0 md:left-[13.5rem] top-1.5 -translate-x-1/2">
                <span data-dot className="block w-3 h-3 rounded-full bg-accent ring-[6px] ring-bg shadow-[0_0_18px_rgb(var(--c-accent)/.7)]" />
              </span>

              <div className="pl-8 md:pl-12 rv rv-d1">
                <h3 className="text-[1.35rem] sm:text-[1.65rem] font-semibold text-text leading-snug tracking-tight">
                  {e.role}
                </h3>
                <div className="text-accent text-[1rem] font-medium mt-1 mb-5">{e.company}</div>
                <ul className="space-y-2.5 text-muted text-[.98rem] sm:text-[1.04rem] leading-relaxed list-none p-0 max-w-2xl">
                  {e.points.map((p, idx) => (
                    <li key={idx} className="relative pl-5">
                      <span className="absolute left-0 top-[.7em] w-1.5 h-1.5 rounded-full bg-muted/50" aria-hidden="true" />
                      {p}
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
