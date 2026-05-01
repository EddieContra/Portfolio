import { EXPERIENCE } from '../data/experience';

export default function Experience() {
  return (
    <section id="experience" className="py-20 sm:py-28 div-thick">
      <div className="wrap">
        <span className="sec-label">Experience &amp; education</span>
        <h2 className="sec-title rv">Where I've worked</h2>

        <ol className="relative border-l-2 border-text space-y-12 ml-2 pl-7 sm:pl-9">
          {EXPERIENCE.map((e, i) => (
            <li key={e.tab} className={`rv rv-d${(i % 4) + 1} relative`}>
              <span
                className="absolute -left-[34px] sm:-left-[42px] top-1 w-3.5 h-3.5 bg-text border-2 border-text"
                aria-hidden="true"
              />

              <div className="text-[.7rem] tracking-[.18em] uppercase font-medium text-muted mb-2">
                {e.date}
              </div>

              <h3 className="font-disp text-xl sm:text-2xl uppercase tracking-tight text-text leading-tight">
                {e.role}
              </h3>

              <div className="text-text text-sm font-bold uppercase tracking-wide mb-4 mt-1">
                {e.company}
              </div>

              <ul className="space-y-2 text-muted text-sm sm:text-[.92rem] leading-relaxed list-none">
                {e.points.map((p, idx) => (
                  <li key={idx} className="relative pl-5">
                    <span className="absolute left-0 top-2 w-2 h-2 bg-text" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
