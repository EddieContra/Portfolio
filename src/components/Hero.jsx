import { useEffect, useState } from 'react';
import { HERO_ROLES } from '../data/now';

export default function Hero() {
  const [activeRole, setActiveRole] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveRole((i) => (i + 1) % HERO_ROLES.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center px-10 pt-40 pb-20 relative overflow-hidden max-[1100px]:px-10 max-[768px]:!px-6 max-[480px]:!px-6"
    >
      <span className="text-[.7rem] tracking-[3.5px] uppercase text-accent mb-5 opacity-0 animate-up [animation-delay:.3s]">
        Available for Opportunities · Based in Arusha, Tanzania 🇹🇿
      </span>

      <h1 className="font-disp text-[clamp(5rem,18vw,19rem)] leading-[.82] tracking-[-3px] opacity-0 animate-up [animation-delay:.5s]">
        ED<em className="text-accent not-italic">DIE</em>
      </h1>

      <p className="font-serif italic text-[clamp(1.1rem,2vw,1.8rem)] text-muted mt-7 opacity-0 animate-up [animation-delay:.7s]">
        CS Graduate · Designer · Educator · Creator
      </p>

      <div className="flex flex-wrap gap-2.5 mt-5 opacity-0 animate-up [animation-delay:.9s]">
        {HERO_ROLES.map((r, i) => (
          <span
            key={r}
            className={[
              'border px-3.5 py-1 text-[.7rem] tracking-[1.5px] uppercase transition-all duration-300',
              i === activeRole
                ? 'bg-accent text-bg border-accent font-bold'
                : 'border-edge text-muted',
            ].join(' ')}
          >
            {r}
          </span>
        ))}
      </div>

      <div className="flex gap-5 flex-wrap mt-12 opacity-0 animate-up [animation-delay:1.1s] max-[480px]:flex-col max-[480px]:items-start">
        <a href="#projects" className="btn-fill">View My Work</a>
        <a href="#contact" className="btn-ghost">Let's Talk →</a>
        <a
          href={`${import.meta.env.BASE_URL}cv.pdf`}
          download="Eddie-CV.pdf"
          className="btn-ghost inline-flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download CV
        </a>
      </div>

      <div className="absolute bottom-10 left-10 flex items-center gap-4 text-muted text-[.65rem] tracking-[2.5px] uppercase opacity-0 animate-up [animation-delay:1.6s] max-[1100px]:left-10 max-[768px]:!left-6">
        <div className="w-[45px] h-[1px] bg-edge overflow-hidden relative">
          <div className="absolute left-[-100%] top-0 w-full h-full bg-accent" style={{ animation: 'slid 2.2s 2s infinite' }} />
        </div>
        <span>Scroll to explore</span>
      </div>

      <div
        aria-hidden="true"
        className="absolute -bottom-16 -right-12 font-disp text-[clamp(10rem,30vw,38rem)] text-transparent pointer-events-none select-none leading-none tracking-[-5px]"
        style={{ WebkitTextStroke: '1px rgb(var(--c-text) / .04)' }}
      >
        CS
      </div>
    </section>
  );
}
