import { useCountUp } from '../hooks/useCountUp';
import { useTilt } from '../hooks/useTilt';
import { NOW_CARDS } from '../data/now';
import RevealText from './RevealText';
import Icon from './Icon';

const MANIFESTO = [
  'I sit at the intersection of ',
  { text: 'technology, design and education.', em: true },
  ' I build production software, craft compelling visuals, and teach the next generation of coders, from Arusha, Tanzania, to the world.',
];

export default function About() {
  const tiltRef = useTilt({ max: 10, scale: 1.02 });

  return (
    <section id="about" className="relative py-28 sm:py-40">
      <div className="wrap">
        <span className="sec-label rv">About</span>
        <RevealText
          segments={MANIFESTO}
          className="font-disp font-bold tracking-apple leading-[1.1] text-[clamp(2rem,5.2vw,4rem)] text-text max-w-5xl"
        />

        <div className="mt-24 sm:mt-32 grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 md:gap-16 items-center">
          {/* Portrait in a tilting glass frame */}
          <div className="rv persp">
            <div ref={tiltRef} className="spotlight relative tile p-3 sm:p-4 will-change-transform preserve-3d max-w-[420px] mx-auto md:mx-0">
              <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden bg-bg3">
                <span className="absolute inset-0 grid place-items-center font-disp text-7xl font-bold text-accent">E</span>
                <img
                  src={`${import.meta.env.BASE_URL}me.jpg`}
                  alt="Eddie"
                  width="640"
                  height="640"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  className="relative w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute left-4 bottom-4 right-4 text-white" style={{ transform: 'translateZ(40px)' }}>
                  <div className="text-xs uppercase tracking-[.2em] text-white/70">Based in</div>
                  <div className="font-semibold text-lg">Arusha, Tanzania</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 text-[1.08rem] sm:text-[1.2rem] leading-relaxed text-muted">
            <p className="rv">
              I'm <span className="text-text font-semibold">Eddie</span>, a Computer Science graduate and a{' '}
              <span className="text-text">Programming Instructor and AI Curriculum Developer</span> at{' '}
              <span className="text-text">E3Empower</span>, where I've built two full AI courses and design bilingual
              learning materials, alongside brand and design work for clients.
            </p>
            <p className="rv rv-d1">
              I also founded an <span className="text-text">agentic-AI consultancy</span>, building lead-response and
              booking automation on the <span className="text-text">Anthropic API</span>, and I'm open to{' '}
              <span className="text-text">full-time roles or freelance projects</span> where I can apply that at scale.
            </p>

            <dl className="grid grid-cols-3 gap-4 sm:gap-8 pt-10 rv rv-d2">
              <Stat n="2"   label="AI courses built" />
              <Stat n="3+"  label="Years experience" />
              <Stat n="12+" label="Tools mastered" />
            </dl>
          </div>
        </div>

        {/* Right now */}
        <div id="currently" className="mt-28 sm:mt-36">
          <h3 className="font-disp font-bold tracking-apple text-[clamp(1.8rem,4vw,3rem)] text-text mb-10 rv">
            Right now<span className="text-accent">.</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {NOW_CARDS.map((c, i) => (
              <NowCard key={c.title} card={c} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function NowCard({ card, index }) {
  const ref = useTilt({ max: 6 });
  return (
    <div className={`rv rv-d${index + 1} persp`}>
      <article ref={ref} className="spotlight tile h-full p-6 sm:p-7 flex flex-col will-change-transform">
        <div className="relative z-[2] grid place-items-center w-12 h-12 rounded-2xl bg-accent/10 text-accent mb-8">
          <Icon name={card.icon} size={24} />
        </div>
        <div className="relative z-[2] text-[.78rem] font-semibold text-accent mb-1.5">{card.label}</div>
        <h4 className="relative z-[2] font-semibold text-[1.15rem] text-text leading-snug mb-2 tracking-tight">{card.title}</h4>
        <p className="relative z-[2] text-[.93rem] text-muted leading-relaxed">{card.sub}</p>
      </article>
    </div>
  );
}

function Stat({ n, label }) {
  const match = String(n).match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : String(n);
  const [value, ref] = useCountUp(target);

  return (
    <div>
      <dt
        ref={ref}
        className="font-disp font-bold tracking-apple text-[clamp(2.6rem,6vw,4.5rem)] leading-none tabular-nums text-gradient"
      >
        {value}{suffix}
      </dt>
      <dd className="text-sm text-muted mt-3">{label}</dd>
    </div>
  );
}
