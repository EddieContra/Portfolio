export default function About() {
  return (
    <section id="about" className="py-20 sm:py-28 border-t border-edge">
      <div className="wrap">
        <span className="sec-label">About</span>
        <h2 className="sec-title rv">A bit about me</h2>

        <div className="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-8 md:gap-12 items-start">
          <div className="rv">
            <div className="aspect-square w-32 sm:w-40 rounded-full bg-bg2 border border-edge grid place-items-center font-disp text-5xl font-extrabold italic text-accent">
              E
            </div>
          </div>

          <div className="space-y-5 text-base sm:text-lg leading-relaxed text-muted rv">
            <p>
              I'm <span className="text-text font-semibold">Eddie</span> — a Computer Science graduate sitting at the intersection of{' '}
              <span className="text-text">technology, design, and education</span>. I build elegant software,
              craft compelling visuals, and teach the next generation of coders.
            </p>
            <p>
              From shipping <span className="text-text">full-stack web apps</span> to leading sessions for{' '}
              <span className="text-text">JA Africa's SEP / E3empower initiative</span> in Tanzania, everything I do
              is driven by purpose and precision.
            </p>
            <p>
              Currently exploring the frontier of <span className="text-text">Machine Learning &amp; AI</span> and
              actively seeking an internship where I can apply that curiosity at scale.
            </p>

            <dl className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 mt-8 border-t border-edge">
              <Stat n="8+"  label="Months interning"  />
              <Stat n="3+"  label="Years experience"  />
              <Stat n="12+" label="Tools mastered"    />
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, label }) {
  return (
    <div>
      <dt className="font-disp font-extrabold text-3xl sm:text-4xl text-text leading-none">{n}</dt>
      <dd className="text-xs text-muted mt-2 tracking-wide">{label}</dd>
    </div>
  );
}
