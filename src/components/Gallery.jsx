import { useMemo, useState } from 'react';
import { GALLERY, GALLERY_FILTERS } from '../data/gallery';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Gallery() {
  const [filter, setFilter] = useState('all');

  const items = useMemo(
    () => (filter === 'all' ? GALLERY : GALLERY.filter((g) => g.cat === filter)),
    [filter]
  );

  // Re-observe reveal targets when filter changes (new DOM)
  useScrollReveal([filter]);

  return (
    <section
      id="gallery"
      className="bg-bg2 py-32 px-10 max-[1100px]:px-10 max-[768px]:!px-6 max-[480px]:!py-20"
    >
      <span className="sec-label">Creative Portfolio</span>
      <h2 className="sec-title rv">GALLERY.</h2>

      <div className="flex gap-3 flex-wrap mb-10">
        {GALLERY_FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={[
              'filt bg-transparent border border-edge px-5 py-2 text-[.7rem] tracking-[1.5px] uppercase cursor-pointer transition-all duration-200 font-sans',
              filter === f.key
                ? 'bg-accent text-bg border-accent'
                : 'text-muted hover:bg-accent hover:text-bg hover:border-accent',
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4 max-[768px]:grid-cols-2 max-[480px]:grid-cols-2">
        {items.map((g, i) => (
          <div
            key={`${g.label}-${i}`}
            className={[
              'gal-item aspect-square bg-bg3 grid place-items-center text-4xl relative overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02] rv',
              i % 5 === 0 ? 'col-span-2 !aspect-[2/1] max-[768px]:col-span-1 max-[768px]:!aspect-square' : '',
            ].join(' ')}
            data-cat={g.cat}
          >
            <span>{g.emoji}</span>
            <div className="absolute inset-0 bg-accent/95 flex flex-col items-center justify-center gap-1 opacity-0 hover:opacity-100 transition-opacity duration-300">
              <span className="font-disp text-2xl text-bg tracking-[3px]">{g.label}</span>
              <small className="text-[.65rem] tracking-[2px] uppercase text-bg/70">{g.cat}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
