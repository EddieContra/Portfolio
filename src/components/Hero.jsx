import { useEffect, useRef, useState } from 'react';
import { HERO, SITE } from '../data/site';
import { HERO_ROLES } from '../data/now';
import { publicUrl } from '../lib/assets';
import { Rich } from '../lib/rich';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useReducedMotion } from '../hooks/useMediaQuery';
import { useInView } from '../hooks/useInView';
import HeroBackdrop from './HeroBackdrop';
import Icon from './Icon';

export default function Hero() {
  const sectionRef = useRef(null);
  const progress = useRef(0);
  const reduced = useReducedMotion();
  const active = useInView(sectionRef, { once: false });

  // --p runs 0 → 1 while the hero scrolls out; the copy drifts up and fades
  // (see the inline styles below) and the scene tips into a top-down map.
  useScrollProgress(sectionRef, {
    start: 0,
    end: 0,
    enabled: !reduced,
    onProgress: (p) => { progress.current = reduced ? 0 : p; },
  });

  return (
    <section
      id="hero"
      ref={sectionRef}
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-clip"
      style={{ '--p': 0 }}
    >
      <HeroBackdrop progress={progress} active={active} />

      <div
        className="wrap relative pb-10 pt-32 sm:pb-14 motion-safe:will-change-transform"
        style={reduced ? undefined : {
          opacity: 'calc(1 - var(--p) * 1.7)',
          transform: 'translate3d(0, calc(var(--p) * -72px), 0)',
        }}
      >
        <p className="mb-5 flex items-center gap-3 text-sm text-muted animate-fade-up sm:mb-6">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inset-0 rounded-full bg-accent motion-safe:animate-pulse-ring" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          {HERO.status}
        </p>

        <h1 className="font-disp text-[clamp(4.75rem,21vw,13.5rem)] font-extrabold italic leading-[.82] tracking-[-0.055em] text-text animate-slide-up">
          {SITE.name}
          <span className="not-italic text-accent" aria-hidden="true">.</span>
        </h1>

        <RoleTicker reduced={reduced} />

        <p className="mt-6 max-w-2xl text-[clamp(1.05rem,1.7vw,1.3rem)] leading-relaxed text-muted animate-slide-up">
          <Rich text={HERO.intro} />
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-3 animate-fade-up [animation-delay:320ms]">
          <a href="#projects" className="btn-fill">
            {HERO.actions.work}
            <Icon name="arrowRight" size={17} />
          </a>
          <a href={publicUrl(SITE.cv.file)} download={SITE.cv.downloadName} className="btn-ghost">
            <Icon name="download" size={17} />
            {HERO.actions.cv}
          </a>
          <a href="#contact" className="btn-link sm:ml-2">
            {HERO.actions.contact}
            <Icon name="arrowUpRight" size={16} />
          </a>
        </div>

        <a
          href="#about"
          className="mt-12 hidden items-center gap-3 text-xs font-semibold uppercase tracking-label text-muted no-underline transition-colors hover:text-text sm:inline-flex animate-fade-up [animation-delay:500ms]"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full border border-edge">
            <Icon name="arrowDown" size={15} />
          </span>
          Scroll
        </a>
      </div>
    </section>
  );
}

/** Cycles through HERO_ROLES. Screen readers get the full list once. */
function RoleTicker({ reduced }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % HERO_ROLES.length), 2800);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div className="mt-6 animate-fade-up [animation-delay:160ms] sm:mt-8">
      <ul className="sr-only">
        {HERO_ROLES.map((role) => <li key={role}>{role}</li>)}
      </ul>
      {reduced ? (
        <p aria-hidden="true" className="flex flex-wrap gap-2">
          {HERO_ROLES.map((role) => <span key={role} className="tag-pill">{role}</span>)}
        </p>
      ) : (
        <p aria-hidden="true" className="flex h-8 items-center gap-3 overflow-hidden text-[clamp(1.05rem,2.2vw,1.5rem)] font-bold tracking-tight text-text">
          <span className="h-px w-8 shrink-0 bg-accent sm:w-12" />
          <span key={index} className="block animate-rise [animation-duration:.7s]">{HERO_ROLES[index]}</span>
        </p>
      )}
    </div>
  );
}
