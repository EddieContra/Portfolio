export default function About() {
  return (
    <section id="about" className="py-20 sm:py-28 div-thick">
      <div className="wrap">
        <span className="sec-label">About</span>
        <h2 className="sec-title rv">A bit about me</h2>

        <div className="grid grid-cols-1 md:grid-cols-[12rem_1fr] gap-8 md:gap-12 items-start">
          <div className="rv">
            <div className="aspect-square w-32 sm:w-40 bg-bg2 border-2 border-text grid place-items-center font-disp text-6xl uppercase">
              E
            </div>
          </div>

          <div className="space-y-5 text-base sm:text-lg leading-relaxed text-text rv">
            <p>
              I'm <span className="font-bold">Eddie</span> — a Computer Science graduate sitting at
              the intersection of <span className="font-bold">technology, design, and education</span>.
              I build elegant software, craft compelling visuals, and teach the next generation of coders.
            </p>
            <p className="text-muted">
              From shipping <span className="text-text font-medium">full-stack web apps</span> to leading
              sessions for <span className="text-text font-medium">JA Africa's SEP / E3empower initiative</span>{' '}
              in Tanzania, everything I do is driven by purpose and precision.
            </p>
            <p className="text-muted">
              Currently exploring the frontier of <span className="text-text font-medium">Machine Learning &amp; AI</span>{' '}
              and actively seeking an internship where I can apply that curiosity at scale.
            </p>

            <dl className="grid grid-cols-3 gap-0 pt-8 mt-8 border-t-2 border-text">
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
    <div className="border-r-2 border-text last:border-r-0 pr-4 sm:pr-6 first:pl-0 pl-4 sm:pl-6 first:!pl-0">
      <dt className="font-disp text-3xl sm:text-4xl text-text leading-none uppercase">{n}</dt>
      <dd className="text-[.65rem] text-muted mt-2 tracking-[.18em] uppercase font-medium">{label}</dd>
    </div>
  );
}
