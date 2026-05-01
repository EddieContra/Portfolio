import { useState } from 'react';
import { PROJECTS } from '../data/projects';
import ProjectModal from './ProjectModal';

export default function Projects() {
  const [active, setActive] = useState(null);

  return (
    <section id="projects" className="py-20 sm:py-28 div-thick">
      <div className="wrap">
        <span className="sec-label">Selected work</span>
        <h2 className="sec-title rv">Projects</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-2 border-text">
          {PROJECTS.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setActive(p)}
              className={[
                'group text-left bg-bg p-6 sm:p-7 cursor-pointer relative',
                'border-text transition-colors duration-300',
                'hover:bg-text hover:text-bg',
                // gridlines: every cell gets right + bottom 2px border, except last col / row
                i % 2 === 0 ? 'sm:border-r-2' : '',
                i < PROJECTS.length - 2 ? 'border-b-2' : '',
                i < PROJECTS.length - 1 && i % 2 === 0 ? 'max-sm:border-b-2' : '',
                `rv rv-d${(i % 3) + 1}`,
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="text-3xl shrink-0" aria-hidden="true">{p.emoji}</div>
                <span className="text-[.65rem] uppercase tracking-[.18em] font-bold opacity-60 group-hover:opacity-100">
                  0{i + 1} / 0{PROJECTS.length}
                </span>
              </div>

              <h3 className="font-disp text-xl sm:text-2xl uppercase tracking-tight leading-tight mb-2">
                {p.name}
              </h3>
              <p className="text-sm leading-relaxed mb-4 opacity-80">{p.brief}</p>

              <div className="flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[.6rem] tracking-[.15em] uppercase border border-current px-2 py-0.5 font-bold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
