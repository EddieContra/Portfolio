export default function About() {
  return (
    <section
      id="about"
      className="bg-bg2 py-32 px-10 grid grid-cols-[1fr_1.2fr] gap-28 items-center
                 max-[1100px]:grid-cols-1 max-[1100px]:px-10 max-[1100px]:gap-12
                 max-[768px]:!px-6 max-[480px]:!py-20"
    >
      <div className="relative rv max-[768px]:max-w-[300px]">
        <div className="aspect-[3/4] bg-bg3 grid place-items-center font-disp text-[10rem] text-accent/25 relative z-10">
          E
        </div>
        <div className="absolute inset-0 border-2 border-accent translate-x-[14px] translate-y-[14px] z-0" />
      </div>

      <div>
        <span className="sec-label">About Me</span>
        <h2 className="sec-title rv">THE<br />STORY<br />SO FAR.</h2>

        <p className="text-muted leading-[1.95] text-base mb-5 rv">
          I'm <strong className="text-text">Eddie</strong> — a Computer Science graduate who sits at the intersection of{' '}
          <strong className="text-text">technology, design, and education</strong>. I build elegant software, craft
          compelling visuals, and teach the next generation of coders.
        </p>

        <p className="text-muted leading-[1.95] text-base mb-5 rv rv-d1">
          From developing <strong className="text-text">full-stack web applications</strong> to leading sessions for{' '}
          <strong className="text-text">JA Africa's SEP initiative</strong> in Tanzania, everything I do is driven by
          purpose and precision.
        </p>

        <p className="text-muted leading-[1.95] text-base mb-5 rv rv-d2">
          Currently exploring the frontier of <strong className="text-text">Machine Learning &amp; AI</strong> and
          actively seeking an internship where I can apply that curiosity at scale.
        </p>

        <div className="grid grid-cols-3 gap-6 border-t border-edge pt-10 mt-10 rv rv-d2 max-[768px]:grid-cols-2">
          <Stat n="8+"  label="Months Interning"  />
          <Stat n="3+"  label="Years Experience"  />
          <Stat n="12+" label="Tools Mastered"    />
        </div>
      </div>
    </section>
  );
}

function Stat({ n, label }) {
  return (
    <div>
      <h3 className="font-disp text-[3.5rem] text-accent leading-none">{n}</h3>
      <p className="text-[.65rem] tracking-[2px] uppercase text-muted mt-1">{label}</p>
    </div>
  );
}
