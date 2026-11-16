import { NOW_CARDS } from '../data/now';
import { useTilt } from '../hooks/useTilt';
import SectionHeader, { headingId } from './SectionHeader';
import Icon from './Icon';

export default function Currently() {
  return (
    <section id="currently" aria-labelledby={headingId('currently')} className="section !pt-0">
      <div className="wrap">
        <SectionHeader id="currently" />
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {NOW_CARDS.map((card, i) => (
            <li key={card.title} className={`rv rv-d${(i % 4) + 1}`}>
              <NowCard card={card} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function NowCard({ card }) {
  const ref = useTilt({ max: 5 });
  return (
    <article ref={ref} className="spotlight card flex h-full flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-bg3 text-accent-ink">
          <Icon name={card.icon} size={21} />
        </span>
        <span className="kicker">{card.label}</span>
      </div>
      <h3 className="mb-2 text-[1.1rem] font-bold leading-snug tracking-tight text-text">{card.title}</h3>
      <p className="text-[.92rem] leading-relaxed text-muted">{card.sub}</p>
    </article>
  );
}
