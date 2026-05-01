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
      className="min-h-[80vh] flex items-center pt-16 pb-20 sm:pt-20 sm:pb-24"
    >
      <div className="wrap w-full">
        <p className="text-xs font-bold tracking-[.22em] uppercase mb-6 flex items-center gap-3 opacity-0 animate-up [animation-delay:.2s]">
          <span className="w-2 h-2 bg-text inline-block" aria-hidden="true" />
          Available — Arusha, Tanzania
        </p>

        <h1 className="font-disp uppercase tracking-tighter leading-[.85] text-[clamp(4rem,15vw,11rem)] opacity-0 animate-up [animation-delay:.4s]">
          Eddie<span aria-hidden="true">.</span>
        </h1>

        <p className="mt-7 text-lg sm:text-xl md:text-2xl max-w-2xl leading-snug opacity-0 animate-up [animation-delay:.6s]">
          Full-stack developer, designer, and educator building thoughtful software and creative
          learning experiences from <span className="font-bold">Arusha, Tanzania</span>.
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
                'px-3 py-1 text-[.7rem] uppercase font-bold tracking-[.12em] border-2 border-text transition-colors duration-300',
                i === activeRole ? 'bg-text text-bg' : 'bg-bg text-text',
              ].join(' ')}
            >
              {r}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-10 opacity-0 animate-up [animation-delay:1s]">
          <a href="#projects" className="btn-fill">
            View Work
            <span aria-hidden="true">→</span>
          </a>
          <a
            href={`${import.meta.env.BASE_URL}cv.pdf`}
            download="Emmanuel-Kiishweko-CV.pdf"
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
            Get in Touch
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
