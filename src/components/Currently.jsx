import { NOW_CARDS } from '../data/now';

export default function Currently() {
  return (
    <section
      id="currently"
      className="bg-bg py-32 px-10 max-[1100px]:px-10 max-[768px]:!px-6 max-[480px]:!py-20"
    >
      <span className="sec-label">Right Now</span>
      <h2 className="sec-title rv">CURRENTLY.</h2>

      <div className="grid grid-cols-4 gap-6 max-[1100px]:grid-cols-2 max-[480px]:grid-cols-1">
        {NOW_CARDS.map((c, i) => (
          <article
            key={c.title}
            className={[
              'now-card bg-bg2 border border-edge p-8 transition-all duration-300 relative overflow-hidden group',
              'hover:border-accent/30 hover:-translate-y-1',
              `rv rv-d${i + 1}`,
            ].join(' ')}
          >
            <div className="text-2xl mb-5">{c.icon}</div>
            <div className="text-[.6rem] tracking-[2.5px] uppercase text-accent mb-2">{c.label}</div>
            <h3 className="font-disp text-2xl tracking-wider mb-2 leading-tight">{c.title}</h3>
            <p className="text-[.8rem] text-muted leading-[1.65]">{c.sub}</p>
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent group-hover:w-full transition-[width] duration-500" />
          </article>
        ))}
      </div>
    </section>
  );
}
