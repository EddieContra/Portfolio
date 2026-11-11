import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, MQ, scrollTo } from '../lib/motion';
import { PROJECTS } from '../data/projects';
import { useTilt } from '../hooks/useTilt';
import ProjectModal from './ProjectModal';
import ProjectArt from './ProjectArt';

const pad = (n) => String(n).padStart(2, '0');

export default function Projects() {
  const [active, setActive] = useState(null);
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const countRef = useRef(null);
  const barRef = useRef(null);
  const stRef = useRef(null);
  const total = PROJECTS.length;

  // Desktop: pin the stage and translate the card track horizontally.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.desktop, () => {
      const track = trackRef.current;
      const distance = () => Math.max(0, track.scrollWidth - pinRef.current.clientWidth);
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const i = Math.min(total, Math.round(self.progress * (total - 1)) + 1);
            if (countRef.current) countRef.current.textContent = pad(i);
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
      stRef.current = tween.scrollTrigger;
      return () => { stRef.current = null; };
    });
    return () => mm.revert();
  }, { scope: sectionRef });

  // Keyboard: bring a focused card into view inside the pinned track.
  const onCardFocus = (i) => {
    const st = stRef.current;
    if (!st) return;
    const y = st.start + (st.end - st.start) * (i / Math.max(1, total - 1));
    if (Math.abs(window.scrollY - y) > 4) scrollTo(y, { offset: 0, immediate: true });
  };

  return (
    <section id="projects" ref={sectionRef} className="relative">
      <div ref={pinRef} className="relative md:h-[100svh] md:flex md:flex-col md:justify-center py-28 md:py-0 overflow-hidden md:motion-reduce:h-auto md:motion-reduce:py-28">
        <div className="wrap w-full flex items-end justify-between gap-6 md:mb-10">
          <div>
            <span className="sec-label rv">Selected work</span>
            <h2 className="sec-title rv rv-d1 !mb-10 md:!mb-0">Projects.</h2>
          </div>
          <div className="hidden md:flex md:motion-reduce:hidden flex-col items-end gap-3 pb-2" aria-hidden="true">
            <div className="text-sm text-muted tabular-nums">
              <span ref={countRef} className="text-text font-semibold">01</span> / {pad(total)}
            </div>
            <div className="w-40 h-[2px] rounded-full bg-edge overflow-hidden">
              <div ref={barRef} className="h-full bg-accent origin-left" style={{ transform: 'scaleX(0)' }} />
            </div>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex flex-col md:flex-row gap-5 md:gap-7 px-6 sm:px-8 md:pl-[max(2rem,calc((100vw-1080px)/2+2rem))] md:pr-[12vw] will-change-transform md:motion-reduce:grid md:motion-reduce:grid-cols-2 md:motion-reduce:max-w-[1080px] md:motion-reduce:mx-auto md:motion-reduce:px-8"
        >
          {PROJECTS.map((p, i) => (
            <ProjectCard
              key={p.name}
              project={p}
              index={i}
              onOpen={() => setActive({ project: p, index: i })}
              onFocus={() => onCardFocus(i)}
            />
          ))}
        </div>
      </div>

      <ProjectModal
        project={active?.project ?? null}
        index={active?.index ?? 0}
        onClose={() => setActive(null)}
      />
    </section>
  );
}

function ProjectCard({ project, index, onOpen, onFocus }) {
  const tiltRef = useTilt({ max: 6, scale: 1.01 });

  return (
    <div className="persp shrink-0 md:w-[min(64vw,720px,calc((100svh-330px)*1.45))] md:motion-reduce:w-auto rv">
      <button
        ref={tiltRef}
        type="button"
        onClick={onOpen}
        onFocus={onFocus}
        className="spotlight group w-full text-left tile cursor-pointer will-change-transform"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-[28px]">
          <ProjectArt project={project} index={index} />
        </div>
        <div className="relative z-[2] p-6 sm:p-8 flex items-end justify-between gap-6">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[.8rem] font-medium text-accent mb-2">
              {project.tags.map((t) => <span key={t}>{t}</span>)}
            </div>
            <h3 className="font-semibold text-[1.35rem] sm:text-[1.7rem] text-text leading-tight tracking-tight mb-2">
              {project.name}
            </h3>
            <p className="text-[.98rem] text-muted leading-relaxed max-w-xl">{project.brief}</p>
          </div>
          <span
            aria-hidden="true"
            className="shrink-0 grid place-items-center w-11 h-11 rounded-full bg-bg3 text-text text-xl transition-all duration-300 ease-apple group-hover:bg-accent group-hover:text-white group-hover:rotate-90"
          >
            +
          </span>
        </div>
      </button>
    </div>
  );
}
