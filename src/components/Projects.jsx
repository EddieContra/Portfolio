import { useState } from 'react';
import { PROJECTS } from '../data/projects';
import ProjectModal from './ProjectModal';

export default function Projects() {
  const [active, setActive] = useState(null);

  return (
    <section
      id="projects"
      className="bg-bg2 py-32 px-10 max-[1100px]:px-10 max-[768px]:!px-6 max-[480px]:!py-20"
    >
      <span className="sec-label">Selected Work</span>
      <h2 className="sec-title rv">PROJECTS.</h2>

      <div className="grid grid-cols-3 gap-6 max-[1100px]:grid-cols-2 max-[768px]:grid-cols-1">
        {PROJECTS.map((p, i) => (
          <button
            key={p.name}
            type="button"
            onClick={() => setActive(p)}
            className={[
              'proj-card text-left bg-bg3 border border-edge cursor-pointer overflow-hidden',
              'transition-all duration-300 hover:border-accent hover:-translate-y-1.5',
              `rv rv-d${(i % 3) + 1}`,
            ].join(' ')}
          >
            <div className="aspect-video bg-bg2 grid place-items-center text-5xl relative overflow-hidden group">
              <span>{p.emoji}</span>
              <div className="absolute inset-0 bg-accent/95 grid place-items-center font-disp text-3xl text-bg tracking-[6px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                VIEW
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {p.tags.map((t) => (
                  <span key={t} className="text-[.6rem] tracking-[1.5px] uppercase text-accent bg-accent/10 px-2.5 py-0.5">
                    {t}
                  </span>
                ))}
              </div>
              <div className="font-disp text-[1.7rem] tracking-wider mb-2 leading-none">{p.name}</div>
              <p className="text-[.83rem] text-muted leading-[1.7]">{p.brief}</p>
            </div>
          </button>
        ))}
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
