import { useState } from 'react';
import { EXPERIENCE } from '../data/experience';

export default function Experience() {
  const [active, setActive] = useState(0);
  const cur = EXPERIENCE[active];

  return (
    <section
      id="experience"
      className="bg-bg py-32 px-10 max-[1100px]:px-10 max-[768px]:!px-6 max-[480px]:!py-20"
    >
      <span className="sec-label">Career Journey</span>
      <h2 className="sec-title rv">EXPERIENCE &amp;<br />EDUCATION.</h2>

      <div className="grid grid-cols-[220px_1fr] gap-20 items-start max-[1100px]:gap-12 max-[768px]:grid-cols-1">
        <div className="border-l border-edge max-[768px]:border-l-0 max-[768px]:border-b max-[768px]:flex max-[768px]:overflow-x-auto">
          {EXPERIENCE.map((e, i) => (
            <button
              key={e.tab}
              type="button"
              onClick={() => setActive(i)}
              className={[
                'exp-tab block w-full text-left px-7 py-4 cursor-pointer text-[.83rem] leading-snug transition-all',
                'border-l-[3px] -ml-px',
                'max-[768px]:border-l-0 max-[768px]:border-b-[3px] max-[768px]:-mb-px max-[768px]:ml-0 max-[768px]:whitespace-nowrap',
                i === active
                  ? 'border-l-accent text-accent bg-accent/[.04] max-[768px]:!border-l-transparent max-[768px]:!border-b-accent'
                  : 'border-l-transparent text-muted hover:text-text hover:border-l-edge max-[768px]:hover:border-l-transparent max-[768px]:hover:border-b-edge',
              ].join(' ')}
            >
              {e.tab}
            </button>
          ))}
        </div>

        <div key={active} className="animate-up">
          <div className="font-disp text-[2.4rem] tracking-wider mb-1.5">{cur.role}</div>
          <div className="text-accent text-[.78rem] tracking-[2px] uppercase mb-2">{cur.company}</div>
          <div className="text-muted text-[.78rem] italic mb-7">{cur.date}</div>
          <ul className="list-none flex flex-col gap-3.5">
            {cur.points.map((p, i) => (
              <li key={i} className="text-muted text-[.88rem] leading-[1.75] pl-7 relative before:content-['→'] before:absolute before:left-0 before:text-accent">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
