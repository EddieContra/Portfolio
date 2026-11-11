import { SKILL_GROUPS } from '../data/skills';
import { useTilt } from '../hooks/useTilt';
import Icon from './Icon';

// Bento grid. `featured` groups get a large 4x2 tile, `wide` groups span the
// full row; everything else is a 2-col tile. grid-flow-dense packs the gaps.
function spanFor(g) {
  if (g.featured) return 'md:col-span-2 lg:col-span-4 lg:row-span-2';
  if (g.wide) return 'md:col-span-2 lg:col-span-6';
  return 'lg:col-span-2';
}

export default function Skills() {
  return (
    <section id="skills" className="relative py-28 sm:py-40">
      <div className="wrap">
        <span className="sec-label rv">What I work with</span>
        <h2 className="sec-title rv rv-d1">Skills &amp; tools.</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 grid-flow-dense gap-4">
          {SKILL_GROUPS.map((g, i) => (
            <div key={g.title} className={`${spanFor(g)} persp rv rv-d${(i % 4) + 1}`}>
              {g.featured ? <FeaturedTile group={g} /> : <Tile group={g} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tile({ group }) {
  const ref = useTilt({ max: 5 });
  return (
    <article ref={ref} className="spotlight tile h-full p-7 will-change-transform">
      <div className="relative z-[2]">
        <div className="flex items-center justify-between mb-6">
          <span className="grid place-items-center w-11 h-11 rounded-2xl bg-bg3 text-accent">
            <Icon name={group.icon} size={22} />
          </span>
          <span className="text-xs text-muted tabular-nums">{group.tags.length} tools</span>
        </div>
        <h3 className="font-semibold text-[1.2rem] text-text tracking-tight mb-4">{group.title}</h3>
        <div className="flex flex-wrap gap-1.5">
          {group.tags.map((t) => <span key={t} className="tag-pill">{t}</span>)}
        </div>
      </div>
    </article>
  );
}

function FeaturedTile({ group }) {
  const ref = useTilt({ max: 4, scale: 1.01 });
  return (
    <article
      ref={ref}
      className="spotlight relative h-full min-h-[420px] rounded-[28px] overflow-hidden p-8 sm:p-10 flex flex-col justify-end will-change-transform bg-[#06070b] text-white"
    >
      {/* animated aurora */}
      <div aria-hidden="true" className="absolute inset-0">
        <div
          className="absolute -inset-[40%] animate-[spin_24s_linear_infinite] motion-reduce:animate-none opacity-80"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, #0a84ff, #5e5ce6, #bf5af2, #30d158, #0a84ff)',
            filter: 'blur(70px)',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_100%,rgba(6,7,11,.95)_30%,rgba(6,7,11,.4)_80%)]" />
        {/* orbit rings */}
        <div className="absolute right-[-12%] top-[-18%] w-[70%] aspect-square rounded-full border border-white/10" />
        <div className="absolute right-[-2%] top-[-6%] w-[48%] aspect-square rounded-full border border-white/15" />
        <div className="absolute right-[10%] top-[8%] w-[22%] aspect-square rounded-full border border-white/20 grid place-items-center">
          <span className="grid place-items-center w-16 h-16 sm:w-20 sm:h-20 rounded-[26%] bg-white/15 backdrop-blur-xl border border-white/30">
            <Icon name={group.icon} size={34} />
          </span>
        </div>
      </div>

      <div className="relative z-[2]">
        <div className="text-sm font-semibold text-[#64d2ff] mb-2">Focus area</div>
        <h3 className="font-disp font-bold tracking-apple text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.02] mb-6">
          {group.title}
        </h3>
        <div className="flex flex-wrap gap-2">
          {group.tags.map((t) => (
            <span key={t} className="px-3.5 py-1.5 text-[.85rem] rounded-full bg-white/10 border border-white/15 backdrop-blur">
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
