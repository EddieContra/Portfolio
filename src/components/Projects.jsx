import { useState } from 'react';
import { PROJECTS } from '../data/projects';
import ProjectModal from './ProjectModal';

export default function Projects() {
  const [active, setActive] = useState(null);

  return (
    <section id="projects" className="py-20 sm:py-28 border-t border-edge">
      <div className="wrap">
        <span className="sec-label">Selected work</span>
        <h2 className="sec-title rv">Projects</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {PROJECTS.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setActive(p)}
              className={[
                'group text-left bg-bg2 border border-edge rounded-2xl p-6 cursor-pointer',
                'transition-all duration-200 hover:border-text hover:-translate-y-0.5',
                `rv rv-d${(i % 3) + 1}`,
              ].join(' ')}
            >
              <div className="flex items-start gap-4 mb-5">
                <div
                  className="w-12 h-12 grid place-items-center rounded-xl bg-bg3 text-2xl shrink-0 group-hover:bg-accent group-hover:text-bg transition-colors"
                  aria-hidden="true"
                >
                  {p.emoji}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base sm:text-lg text-text leading-tight mb-1">
                    {p.name}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{p.brief}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[.65rem] tracking-wide uppercase text-accent bg-accent/10 px-2 py-0.5 rounded-full font-medium"
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
