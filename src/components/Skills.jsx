import { SKILL_GROUPS } from '../data/skills';

export default function Skills() {
  return (
    <section id="skills" className="py-20 sm:py-28 div-thick">
      <div className="wrap">
        <span className="sec-label">What I work with</span>
        <h2 className="sec-title rv">Skills &amp; tools</h2>

        <ul className="border-2 border-text">
          {SKILL_GROUPS.map((g, i) => (
            <li
              key={g.title}
              className={[
                'grid grid-cols-1 sm:grid-cols-[16rem_1fr] gap-3 sm:gap-10 px-5 sm:px-7 py-6',
                i < SKILL_GROUPS.length - 1 ? 'border-b-2 border-text' : '',
                `rv rv-d${(i % 4) + 1}`,
              ].join(' ')}
            >
              <div className="font-disp text-base uppercase tracking-tight text-text flex items-center gap-2 sm:pt-1">
                <span aria-hidden="true">{g.icon}</span>
                <span>{g.title}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {g.tags.map((t) => (
                  <span key={t} className="tag-pill">{t}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
