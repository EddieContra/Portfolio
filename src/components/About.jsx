import { useRef } from 'react';
import { ABOUT } from '../data/site';
import { publicUrl } from '../lib/assets';
import { parseRich, Rich } from '../lib/rich';
import { useCountUp } from '../hooks/useCountUp';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useReducedMotion } from '../hooks/useMediaQuery';
import { useTilt } from '../hooks/useTilt';
import SectionHeader, { headingId } from './SectionHeader';
import ContourArt from './ContourArt';

export default function About() {
  const [lead, ...body] = ABOUT.paragraphs;
  const tiltRef = useTilt({ max: 7 });
  const { portrait } = ABOUT;

  return (
    <section id="about" aria-labelledby={headingId('about')} className="section">
      <div className="wrap">
        <SectionHeader id="about" />

        <LeadStatement text={lead} />

        <div className="mt-16 grid grid-cols-1 items-center gap-12 sm:mt-24 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
          <div className="rv relative mx-auto w-full max-w-[22rem] md:mx-0 md:max-w-none">
            <ContourArt seed={21} cols={26} levels={8} className="absolute -inset-8 h-[calc(100%+4rem)] w-[calc(100%+4rem)] text-accent opacity-40 [mask-image:radial-gradient(closest-side,black_55%,transparent)]" />
            <div ref={tiltRef} className="spotlight card relative overflow-hidden p-2.5">
              <img
                src={publicUrl(portrait.src)}
                alt={portrait.alt}
                width={portrait.width}
                height={portrait.height}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full rounded-[1.1rem] bg-bg3 object-cover"
              />
            </div>
          </div>

          <div>
            <div className="space-y-5 text-[1.05rem] leading-relaxed text-muted sm:text-[1.15rem]">
              {body.map((paragraph, i) => (
                <p key={i} className={`rv rv-d${i + 1}`}><Rich text={paragraph} /></p>
              ))}
            </div>

            <dl className="rv mt-10 grid grid-cols-3 gap-4 border-t border-edge pt-8 sm:gap-8">
              {ABOUT.stats.map((stat) => <Stat key={stat.label} {...stat} />)}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Large opening statement; words brighten as the paragraph scrolls up the screen. */
function LeadStatement({ text }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  useScrollProgress(ref, { start: 0.9, end: 0.42, enabled: !reduced });

  let index = 0;
  const words = parseRich(text).flatMap((part, p) =>
    part.text.split(/(\s+)/).map((chunk, c) => {
      if (!chunk) return null;
      if (/^\s+$/.test(chunk)) return chunk;
      const i = index++;
      return (
        <span key={`${p}-${c}`} data-w style={{ '--i': i }} className={part.strong ? 'text-accent-ink' : undefined}>
          {chunk}
        </span>
      );
    })
  );

  return (
    <p
      ref={ref}
      style={{ '--n': index }}
      className="reveal-words max-w-5xl font-disp text-[clamp(1.6rem,4.3vw,3.25rem)] font-bold leading-[1.16] tracking-[-0.025em] text-text"
    >
      {words}
    </p>
  );
}

function Stat({ value, label }) {
  // "12+" → count 12, keep the "+" fixed.
  const match = String(value).match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : '';
  const [count, ref] = useCountUp(target, { duration: 1600 });

  return (
    <div className="flex flex-col-reverse gap-2">
      <dt className="text-xs leading-snug text-muted sm:text-sm">{label}</dt>
      <dd ref={ref} className="m-0 font-disp text-[clamp(2.2rem,5.5vw,3.75rem)] font-extrabold leading-none tracking-display text-text tabular-nums">
        <span aria-hidden="true">{match ? count : value}{suffix}</span>
        <span className="sr-only">{value}</span>
      </dd>
    </div>
  );
}
