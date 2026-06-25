import { useMemo, useState } from 'react';
import { GALLERY, GALLERY_FILTERS } from '../data/gallery';
import { useScrollReveal } from '../hooks/useScrollReveal';
import Icon from './Icon';

export default function Gallery() {
  const [filter, setFilter] = useState('all');

  const items = useMemo(
    () => (filter === 'all' ? GALLERY : GALLERY.filter((g) => g.cat === filter)),
    [filter]
  );

  // Re-observe reveal targets when filter changes (new DOM)
  useScrollReveal([filter]);

  return (
    <section id="gallery" className="py-20 sm:py-28 border-t border-edge">
      <div className="wrap">
        <span className="sec-label">Creative work</span>
        <h2 className="sec-title rv">Gallery</h2>

        <div className="flex gap-2 flex-wrap mb-8" role="tablist" aria-label="Filter gallery">
          {GALLERY_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={[
                'px-4 py-1.5 text-xs tracking-wide rounded-full border transition-colors cursor-pointer font-sans',
                filter === f.key
                  ? 'bg-text text-bg border-text'
                  : 'border-edge text-muted hover:border-text hover:text-text',
              ].join(' ')}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((g, i) => (
            <div
              key={`${g.label}-${i}`}
              className="group aspect-square bg-bg2 border border-edge rounded-xl grid place-items-center text-muted relative overflow-hidden cursor-pointer rv transition-colors group-hover:text-accent"
              data-cat={g.cat}
            >
              <Icon name={g.icon} size={30} className="transition-colors group-hover:text-accent" />
              {g.img && (
                <img
                  src={`${import.meta.env.BASE_URL}${g.img}`}
                  alt={g.label}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-text/95 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-3 text-center">
                <span className="text-bg font-medium text-sm">{g.label}</span>
                <small className="text-[.6rem] uppercase tracking-wide text-bg/70">{g.cat}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
