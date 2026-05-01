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
    <section id="gallery" className="py-20 sm:py-28 div-thick">
      <div className="wrap">
        <span className="sec-label">Creative work</span>
        <h2 className="sec-title rv">Gallery</h2>

        <div className="flex gap-0 flex-wrap mb-8 border-2 border-text" role="tablist" aria-label="Filter gallery">
          {GALLERY_FILTERS.map((f, i) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={[
                'px-4 sm:px-5 py-2 text-xs uppercase tracking-[.15em] font-bold transition-colors cursor-pointer font-sans',
                i < GALLERY_FILTERS.length - 1 ? 'border-r-2 border-text' : '',
                filter === f.key
                  ? 'bg-text text-bg'
                  : 'bg-bg text-text hover:bg-text hover:text-bg',
              ].join(' ')}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0 border-2 border-text">
          {items.map((g, i) => (
            <div
              key={`${g.label}-${i}`}
              className={[
                'group aspect-square bg-bg grid place-items-center text-3xl relative overflow-hidden cursor-pointer rv',
                'border-text',
                // gridlines for desktop (4 cols)
                'lg:[&:not(:nth-child(4n))]:border-r-2',
                'sm:max-lg:[&:not(:nth-child(3n))]:border-r-2',
                'max-sm:[&:nth-child(odd)]:border-r-2',
                // bottom borders (everything except last row)
                'border-b-2 last:border-b-0',
              ].join(' ')}
              data-cat={g.cat}
            >
              <span aria-hidden="true">{g.emoji}</span>
              <div className="absolute inset-0 bg-text/95 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-3 text-center">
                <span className="text-bg font-bold uppercase tracking-wide text-xs sm:text-sm">{g.label}</span>
                <small className="text-[.55rem] uppercase tracking-[.2em] text-bg/70">{g.cat}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
