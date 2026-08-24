import { useCountUp } from '../hooks/useCountUp';

export default function About() {  return (
    <section id="about" className="py-20 sm:py-28 border-t border-edge">
      <div className="wrap">
        <span className="sec-label">About</span>
        <h2 className="sec-title rv">A bit about me</h2>

        <div className="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-8 md:gap-12 items-start">
          <div className="rv">
            <div className="relative aspect-square w-32 sm:w-40 rounded-full overflow-hidden bg-bg2 border border-edge">
              {/* Fallback shows until the photo is added at public/me.jpg */}
              <span className="absolute inset-0 grid place-items-center font-disp text-5xl font-extrabold italic text-accent">
                E
              </span>
              <img
                src={`${import.meta.env.BASE_URL}me.jpg`}
                alt="Eddie"
                width="640"
                height="640"
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="relative w-full h-full object-cover object-center"
              />
            </div>
          </div>

          <div className="space-y-5 text-base sm:text-lg leading-relaxed text-muted rv">
            <p>
              I'm <span className="text-text font-semibold">Eddie</span>, a Computer Science graduate sitting at the intersection of{' '}
              <span className="text-text">technology, design, and education</span>. I build production
              software, craft compelling visuals, and teach the next generation of coders.
            </p>
            <p>
              I work as a <span className="text-text">Programming Instructor and AI Curriculum Developer</span> at{' '}
              <span className="text-text">E3Empower</span> in Tanzania, where I've built two full AI courses and
              design bilingual learning materials, alongside brand and design work for clients.
            </p>
            <p>
              I also founded an <span className="text-text">agentic-AI consultancy</span>, building lead-response and
              booking automation on the <span className="text-text">Anthropic API</span>, and I'm open to{' '}
              <span className="text-text">full-time roles or freelance projects</span> where I can apply that at scale.
            </p>

            <dl className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 mt-8 border-t border-edge">
              <Stat n="2"   label="AI courses built"  />
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
  // Split the numeric part from any suffix (e.g. "12+" → 12 and "+") so the
  // number can roll up while the suffix stays put.
  const match = String(n).match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : String(n);
  const [value, ref] = useCountUp(target);

  return (
    <div>
      <dt
        ref={ref}
        className="font-disp font-extrabold text-3xl sm:text-4xl text-text leading-none tabular-nums"
      >
        {value}{suffix}
      </dt>
      <dd className="text-xs text-muted mt-2 tracking-wide">{label}</dd>
    </div>
  );
}
