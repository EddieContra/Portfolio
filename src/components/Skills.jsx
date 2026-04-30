import { SKILL_GROUPS } from '../data/skills';

export default function Skills() {
  return (
    <section
      id="skills"
      className="bg-bg py-32 px-10 max-[1100px]:px-10 max-[768px]:!px-6 max-[480px]:!py-20"
    >
      <span className="sec-label">What I Work With</span>
      <h2 className="sec-title rv">SKILLS &amp;<br />ARSENAL.</h2>

      <div className="grid grid-cols-3 gap-6 max-[1100px]:grid-cols-2 max-[768px]:grid-cols-1">
        {SKILL_GROUPS.map((g, i) => (
          <div
            key={g.title}
            className={[
              'bg-bg2 border border-edge p-8 transition-all duration-300',
              'hover:border-accent hover:-translate-y-1',
              `rv rv-d${(i % 3) + 1}`,
              g.wide ? 'col-span-2 max-[1100px]:col-span-2 max-[768px]:col-span-1' : '',
            ].join(' ')}
          >
            <div className="text-[.65rem] tracking-[2.5px] uppercase text-accent mb-6 flex items-center gap-2">
              <span>{g.icon}</span>
              <span>{g.title}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {g.tags.map((t) => (
                <span key={t} className="tag-pill">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
