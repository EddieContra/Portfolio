import { useEffect, useState } from 'react';
import { HERO_ROLES } from '../data/now';

export default function Hero() {
  const [activeRole, setActiveRole] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveRole((i) => (i + 1) % HERO_ROLES.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[88vh] flex items-center pt-28 sm:pt-32 pb-16 overflow-hidden"
    >
      <div className="wrap w-full relative">
        <p className="text-sm text-muted mb-6 flex items-center gap-2 opacity-0 animate-up [animation-delay:.2s]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          Available for opportunities · Arusha, Tanzania
        </p>

        <h1 className="font-disp font-extrabold leading-[.95] tracking-tight text-[clamp(3rem,11vw,7.5rem)] opacity-0 animate-up [animation-delay:.4s]">
          <span className="italic">Eddie</span>
          <span className="text-accent">.</span>
        </h1>

        <p className="mt-7 text-lg sm:text-xl md:text-2xl text-muted leading-snug max-w-2xl opacity-0 animate-up [animation-delay:.6s]">
          Full-stack developer, designer, and educator building thoughtful software and creative learning experiences from{' '}
          <span className="text-text font-medium">Arusha, Tanzania</span>.
        </p>

        <div
          className="flex flex-wrap gap-2 mt-8 opacity-0 animate-up [animation-delay:.8s]"
          aria-label="Roles I take on"
        >
          {HERO_ROLES.map((r, i) => (
            <span
              key={r}
              aria-current={i === activeRole}
              className={[
                'px-3 py-1 text-xs rounded-full border transition-all duration-300',
                i === activeRole
                  ? 'bg-accent text-bg border-accent font-semibold'
                  : 'border-edge text-muted',
              ].join(' ')}
            >
              {r}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-10 opacity-0 animate-up [animation-delay:1s]">
          <a href="#projects" className="btn-fill">
            View work
            <span aria-hidden="true">→</span>
          </a>
          <a
            href={`${import.meta.env.BASE_URL}cv.pdf`}
            download="Eddie-CV.pdf"
            className="btn-ghost"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download CV
          </a>
          <a href="#contact" className="btn-ghost">
            Get in touch
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
