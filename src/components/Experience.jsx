import { EXPERIENCE } from '../data/experience';

export default function Experience() {
  return (
    <section id="experience" className="py-20 sm:py-28 border-t border-edge">
      <div className="wrap">
        <span className="sec-label">Experience &amp; education</span>
        <h2 className="sec-title rv">Where I've worked</h2>

        <ol className="relative border-l border-edge space-y-12 ml-2 pl-7 sm:pl-9">
          {EXPERIENCE.map((e, i) => (
            <li key={`${e.role}-${e.company}`} className={`rv rv-d${(i % 4) + 1} relative`}>
              <span
                className="absolute -left-[33px] sm:-left-[41px] top-1.5 w-3 h-3 rounded-full bg-accent ring-4 ring-bg"
                aria-hidden="true"
              />

              <div className="text-xs text-muted tracking-wide mb-1.5 italic">{e.date}</div>

              <h3 className="text-lg sm:text-xl font-bold text-text leading-snug">
                {e.role}
              </h3>

              <div className="text-accent text-sm font-medium mb-4 mt-0.5">
                {e.company}
              </div>

              <ul className="space-y-2 text-muted text-sm sm:text-[.92rem] leading-relaxed list-none">
                {e.points.map((p, idx) => (
                  <li key={idx} className="relative pl-5">
                    <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-edge" aria-hidden="true" />
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
