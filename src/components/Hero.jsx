import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, MQ } from '../lib/motion';
import { HERO_ROLES } from '../data/now';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { supportsWebGL } from './three/supportsWebGL';
import Icon from './Icon';

// Three.js lives in its own lazily-loaded chunk.
const HeroScene = lazy(() => import('./three/HeroScene'));

const NAME = 'Eddie';

export default function Hero() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const progress = useRef(0);
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState(false);
  const [active, setActive] = useState(true);
  const [compact, setCompact] = useState(false);
  const [role, setRole] = useState(0);

  // Decide on WebGL after mount; defer to idle so first paint stays fast.
  useEffect(() => {
    if (reduced || !supportsWebGL()) { setWebgl(false); return; }
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const id = idle(() => setWebgl(true));
    return () => cancel(id);
  }, [reduced]);

  // Compact layout (object centered behind text) on narrow screens.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const on = () => setCompact(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // Pause the render loop when the hero is off screen or the tab is hidden.
  useEffect(() => {
    const el = sectionRef.current;
    let inView = true;
    const sync = () => setActive(inView && !document.hidden);
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); });
    io.observe(el);
    document.addEventListener('visibilitychange', sync);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, []);

  // Role rotator.
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setRole((i) => (i + 1) % HERO_ROLES.length), 2600);
    return () => clearInterval(id);
  }, [reduced]);

  // Scroll-out: copy lifts, shrinks and blurs; scene reads `progress`.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.to(contentRef.current, {
        yPercent: -18,
        scale: 0.94,
        opacity: 0,
        filter: 'blur(8px)',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom 20%',
          scrub: true,
          onUpdate: (self) => { progress.current = self.progress; },
        },
      });
    });
    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-[100svh] min-h-[640px] flex items-center overflow-hidden"
    >
      {/* Stage */}
      <div className="absolute inset-0 -z-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_70%_45%,rgb(var(--c-accent)/.16),transparent_70%)]" />
        {webgl ? (
          <Suspense fallback={<StaticOrb compact={compact} />}>
            <div className="absolute inset-0 animate-fade">
              <HeroScene progress={progress} active={active} compact={compact} />
            </div>
          </Suspense>
        ) : (
          <StaticOrb compact={compact} />
        )}
        {/* legibility veil */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/60 to-transparent max-[900px]:bg-gradient-to-t max-[900px]:from-bg max-[900px]:via-bg/70 max-[900px]:to-bg/10" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div ref={contentRef} className="wrap w-full relative z-10 will-change-transform max-[900px]:mt-[30vh]">
        <p className="text-sm sm:text-[.95rem] text-muted mb-5 flex items-center gap-2.5 opacity-0 animate-up [animation-delay:.15s]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30d158] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#30d158]" />
          </span>
          Available for opportunities · Arusha, Tanzania
        </p>

        <h1
          className="font-disp font-bold tracking-[-0.05em] leading-[.9] text-[clamp(4.5rem,15vw,11.5rem)]"
          aria-label={`${NAME}.`}
        >
          {NAME.split('').map((ch, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="inline-block opacity-0 animate-up text-chrome"
              style={{ animationDelay: `${0.3 + i * 0.07}s` }}
            >
              {ch}
            </span>
          ))}
          <span
            aria-hidden="true"
            className="inline-block opacity-0 animate-up text-accent"
            style={{ animationDelay: `${0.3 + NAME.length * 0.07}s` }}
          >
            .
          </span>
        </h1>

        <div className="mt-5 h-[1.4em] text-[clamp(1.35rem,3vw,2.1rem)] font-semibold tracking-tight opacity-0 animate-up [animation-delay:.85s]">
          <span className="sr-only">{HERO_ROLES.join(', ')}</span>
          <span key={role} aria-hidden="true" className="inline-block animate-up text-gradient animate-shimmer">
            {HERO_ROLES[role]}
          </span>
        </div>

        <p className="mt-5 lede max-w-xl opacity-0 animate-up [animation-delay:1s]">
          Building production AI agents, thoughtful software and creative learning experiences.
        </p>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-9 opacity-0 animate-up [animation-delay:1.15s]">
          <a href="#projects" className="btn-fill">View work</a>
          <a
            href={`${import.meta.env.BASE_URL}cv.pdf`}
            download="Eddie-CV.pdf"
            className="btn-ghost"
          >
            <Icon name="download" size={16} />
            Download CV
          </a>
          <a href="#contact" className="btn-link ml-1">Get in touch ›</a>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 opacity-0 animate-up [animation-delay:1.6s]" aria-hidden="true">
        <div className="w-[22px] h-[36px] rounded-full border border-text/30 flex justify-center pt-1.5">
          <span className="block w-[3px] h-[7px] rounded-full bg-text/60 animate-float [animation-duration:2s]" />
        </div>
      </div>
    </section>
  );
}

// Reduced-motion / no-WebGL fallback: a soft chrome-and-blue orb in CSS.
function StaticOrb({ compact }) {
  return (
    <div
      className={[
        'absolute rounded-full',
        compact
          ? 'w-[78vw] h-[78vw] max-w-[440px] max-h-[440px] left-1/2 -translate-x-1/2 top-[8%]'
          : 'w-[38vw] h-[38vw] max-w-[560px] max-h-[560px] right-[8%] top-1/2 -translate-y-1/2',
      ].join(' ')}
      style={{
        background:
          'radial-gradient(circle at 32% 28%, rgba(255,255,255,.95), rgba(255,255,255,.15) 22%, transparent 40%),' +
          'radial-gradient(circle at 70% 75%, rgba(167,139,250,.65), transparent 45%),' +
          'radial-gradient(circle at 50% 50%, rgb(var(--c-accent)) 0%, rgb(var(--c-accent) / .35) 55%, transparent 72%)',
        filter: 'blur(.5px)',
        boxShadow: '0 0 160px 20px rgb(var(--c-accent) / .25)',
      }}
    />
  );
}
