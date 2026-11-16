import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PROJECTS } from '../data/projects';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useTilt } from '../hooks/useTilt';
import SectionHeader, { headingId } from './SectionHeader';
import ProjectArt from './ProjectArt';
import ProjectSheet from './ProjectSheet';
import Icon from './Icon';

// The showcase pins and travels sideways only with a mouse/trackpad, on a
// roomy screen, and when motion is welcome. Everywhere else (phones, tablets,
// reduced motion) it is a native swipeable row with scroll-snap.
const PINNED = '(min-width: 1024px) and (min-height: 660px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

const pad = (n) => String(n).padStart(2, '0');
const total = PROJECTS.length;

export default function Projects() {
  const pinned = useMediaQuery(PINNED);
  const [open, setOpen] = useState(null);          // index of the project in the sheet
  const [distance, setDistance] = useState(0);     // px the track travels while pinned
  const [edge, setEdge] = useState({ start: true, end: false });
  const outerRef = useRef(null);
  const trackRef = useRef(null);
  const countRef = useRef(null);
  const barRef = useRef(null);

  // Counter + progress bar, written straight to the DOM (no re-render per frame).
  const show = useCallback((p) => {
    if (countRef.current) countRef.current.textContent = pad(Math.min(total, Math.round(p * (total - 1)) + 1));
    if (barRef.current) barRef.current.style.transform = `scaleX(${Math.max(0.04, p).toFixed(4)})`;
    setEdge((prev) => {
      const next = { start: p < 0.01, end: p > 0.99 };
      return prev.start === next.start && prev.end === next.end ? prev : next;
    });
  }, []);

  // Pinned: measure how far the track overflows; that is the scroll distance.
  useLayoutEffect(() => {
    if (!pinned) { setDistance(0); return undefined; }
    const track = trackRef.current;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - track.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [pinned]);

  useScrollProgress(outerRef, { start: 0, end: 1, enabled: pinned, onProgress: pinned ? show : undefined });

  // Swipe row: progress comes from the row's own horizontal scroll.
  useEffect(() => {
    if (pinned) return undefined;
    const track = trackRef.current;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = track.scrollWidth - track.clientWidth;
      show(max > 0 ? track.scrollLeft / max : 0);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); track.removeEventListener('scroll', onScroll); };
  }, [pinned, show]);

  // Scroll position (page Y when pinned, row X otherwise) that shows card `i`.
  const reveal = (i, smooth = true) => {
    const track = trackRef.current;
    const card = track.children[i];
    if (!card) return;
    const behavior = smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'auto';
    const inset = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const x = Math.max(0, card.offsetLeft - inset);
    if (pinned) {
      const top = outerRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + Math.min(distance, x), behavior });
    } else {
      track.scrollTo({ left: x, behavior });
    }
  };

  const current = () => (countRef.current ? parseInt(countRef.current.textContent, 10) - 1 : 0);
  const step = (dir) => reveal(Math.min(total - 1, Math.max(0, current() + dir)));

  // Keyboard: a focused card that is off screen is brought into view.
  const onCardFocus = (i) => (event) => {
    if (!event.target.matches(':focus-visible')) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.left < 0 || rect.right > window.innerWidth) reveal(i, false);
  };

  return (
    <section id="projects" aria-labelledby={headingId('projects')}>
      <div ref={outerRef} style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}>
        <div className={pinned ? 'sticky top-0 flex h-[100svh] flex-col justify-center overflow-clip pt-16' : 'section'}>
          <div className="wrap">
            <SectionHeader id="projects" className={pinned ? '!mb-8' : ''}>
              <div className="flex items-center gap-4">
                <p className="m-0 text-sm tabular-nums text-muted" aria-hidden="true">
                  <span ref={countRef} className="font-bold text-text">01</span> / {pad(total)}
                </p>
                <div className="hidden h-px w-28 overflow-hidden bg-edge sm:block" aria-hidden="true">
                  <div ref={barRef} className="h-full origin-left bg-accent" style={{ transform: 'scaleX(.04)' }} />
                </div>
                <div className="flex gap-2">
                  <button type="button" className="icon-btn" onClick={() => step(-1)} disabled={edge.start} aria-label="Previous project">
                    <Icon name="arrowLeft" size={18} />
                  </button>
                  <button type="button" className="icon-btn" onClick={() => step(1)} disabled={edge.end} aria-label="Next project">
                    <Icon name="arrowRight" size={18} />
                  </button>
                </div>
              </div>
            </SectionHeader>
          </div>

          <ul
            ref={trackRef}
            className={[
              'm-0 flex list-none gap-4 py-2 sm:gap-6',
              'px-[max(1.25rem,env(safe-area-inset-left))] sm:px-[max(2rem,calc((100%-72rem)/2+2rem))]',  // lines up with .wrap
              pinned
                ? 'will-change-transform'
                : 'no-scrollbar snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-px-5 sm:scroll-px-[max(2rem,calc((100%-72rem)/2+2rem))]',
            ].join(' ')}
            style={pinned ? { transform: `translate3d(calc(var(--p, 0) * ${-distance}px), 0, 0)` } : undefined}
          >
            {PROJECTS.map((project, i) => (
              <li
                key={project.name}
                onFocus={onCardFocus(i)}
                className="w-[82vw] max-w-[25rem] shrink-0 snap-start sm:w-[25rem]"
              >
                <ProjectCard project={project} index={i} onOpen={() => setOpen(i)} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {open !== null && (
        <ProjectSheet project={PROJECTS[open]} index={open} onClose={() => setOpen(null)} />
      )}
    </section>
  );
}

function ProjectCard({ project, index, onOpen }) {
  const tiltRef = useTilt({ max: 5 });

  return (
    <article ref={tiltRef} className="spotlight card group relative flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] w-full">
        <ProjectArt project={project} index={index} />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <ul className="m-0 mb-3 flex list-none flex-wrap gap-x-3 gap-y-1 p-0">
          {project.tags.map((tag) => <li key={tag} className="kicker">{tag}</li>)}
        </ul>
        <h3 className="mb-2 text-[1.3rem] font-bold leading-tight tracking-tight text-text">
          {/* The button stretches over the whole card. */}
          <button
            type="button"
            onClick={onOpen}
            aria-haspopup="dialog"
            className="cursor-pointer text-left after:absolute after:inset-0 after:z-[1] after:rounded-card focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-accent-ink"
          >
            {project.name}
          </button>
        </h3>
        <p className="text-[.95rem] leading-relaxed text-muted">{project.brief}</p>
        <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-text" aria-hidden="true">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-edge transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-on">
            <Icon name="plus" size={16} />
          </span>
          Details
        </span>
      </div>
    </article>
  );
}
