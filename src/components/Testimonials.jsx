import { useEffect, useState } from 'react';
import { TESTIMONIALS } from '../data/testimonials';

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const total = TESTIMONIALS.length;

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % total), 6000);
    return () => clearInterval(id);
  }, [total]);

  const t = TESTIMONIALS[active];

  return (
    <section
      id="testimonials"
      className="bg-bg2 py-32 px-10 max-[1100px]:px-10 max-[768px]:!px-6 max-[480px]:!py-20"
    >
      <span className="sec-label">Kind Words</span>
      <h2 className="sec-title rv">TESTIMONIALS.</h2>

      <div className="grid grid-cols-[1.4fr_1fr] gap-16 items-center max-[1100px]:grid-cols-1 max-[1100px]:gap-10">
        <blockquote
          key={active}
          className="relative rv animate-up"
        >
          <div
            aria-hidden="true"
            className="font-serif italic text-accent text-[10rem] leading-none absolute -left-2 -top-12 select-none opacity-30 max-[768px]:text-[7rem] max-[768px]:-top-8"
          >
            “
          </div>
          <p className="font-serif italic text-[clamp(1.4rem,2.4vw,2.1rem)] leading-[1.45] text-text relative z-10">
            {t.quote}
          </p>
          <footer className="mt-8 flex items-center gap-4">
            <div className="w-12 h-12 grid place-items-center bg-accent text-bg font-disp tracking-wider text-lg">
              {t.avatar}
            </div>
            <div>
              <div className="text-text font-medium text-sm">{t.name}</div>
              <div className="text-muted text-[.78rem] tracking-wide">{t.role}</div>
            </div>
          </footer>
        </blockquote>

        <div className="flex flex-col gap-2.5">
          {TESTIMONIALS.map((tt, i) => (
            <button
              key={tt.name + i}
              type="button"
              onClick={() => setActive(i)}
              className={[
                'text-left p-5 border transition-colors duration-200 cursor-pointer',
                i === active
                  ? 'border-accent bg-accent/[.05]'
                  : 'border-edge hover:border-muted',
              ].join(' ')}
            >
              <div className="text-[.7rem] tracking-[2px] uppercase text-muted mb-1">
                {tt.role}
              </div>
              <div className={`text-sm leading-snug ${i === active ? 'text-text' : 'text-muted'}`}>
                {tt.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
