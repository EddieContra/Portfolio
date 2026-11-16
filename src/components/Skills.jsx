import { SKILL_GROUPS } from '../data/skills';
import { useTilt } from '../hooks/useTilt';
import SectionHeader, { headingId } from './SectionHeader';
import ContourArt from './ContourArt';
import Icon from './Icon';

// Bento grid: `featured` groups get the large accent tile, `wide` groups span
// the full row, the rest are standard tiles. Dense flow packs the gaps.
function span(group) {
  if (group.featured) return 'md:col-span-2 lg:col-span-4 lg:row-span-2';
  if (group.wide) return 'md:col-span-2 lg:col-span-6';
  return 'lg:col-span-2';
}

export default function Skills() {
  return (
    <section id="skills" aria-labelledby={headingId('skills')} className="section">
      <div className="wrap">
        <SectionHeader id="skills" />
        <ul className="m-0 grid list-none grid-flow-dense grid-cols-1 gap-4 p-0 md:grid-cols-2 lg:grid-cols-6">
          {SKILL_GROUPS.map((group, i) => (
            <li key={group.title} className={`${span(group)} rv rv-d${(i % 4) + 1}`}>
              {group.featured ? <FeaturedTile group={group} /> : <Tile group={group} />}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Tags({ tags, className }) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
      {tags.map((tag) => <li key={tag} className={className}>{tag}</li>)}
    </ul>
  );
}

function Tile({ group }) {
  const ref = useTilt({ max: 4 });
  return (
    <article ref={ref} className="spotlight card h-full p-6 sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-bg3 text-accent-ink">
          <Icon name={group.icon} size={21} />
        </span>
        <h3 className="text-[1.1rem] font-bold leading-snug tracking-tight text-text">{group.title}</h3>
      </div>
      <Tags tags={group.tags} className="tag-pill" />
    </article>
  );
}

function FeaturedTile({ group }) {
  const ref = useTilt({ max: 3, lift: 1.006 });
  return (
    <article ref={ref} className="relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-card bg-accent p-7 text-accent-on sm:p-10">
      <ContourArt seed={11} width={600} height={420} cols={36} levels={12} className="absolute inset-0 h-full w-full opacity-25" />
      <span className="absolute right-6 top-6 grid h-14 w-14 place-items-center rounded-2xl bg-accent-on text-accent sm:right-8 sm:top-8">
        <Icon name={group.icon} size={27} />
      </span>
      <div className="relative">
        <h3 className="mb-5 font-disp text-[clamp(2.2rem,5vw,3.75rem)] font-extrabold leading-none tracking-display">
          {group.title}
        </h3>
        <Tags tags={group.tags} className="inline-flex items-center rounded-full border border-accent-on/30 px-3.5 py-1.5 text-[.85rem] font-medium leading-5" />
      </div>
    </article>
  );
}
