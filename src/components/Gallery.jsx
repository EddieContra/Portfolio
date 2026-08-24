import { useEffect, useMemo, useRef, useState } from 'react';
import { GALLERY, GALLERY_FILTERS } from '../data/gallery';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useModalFocus } from '../hooks/useModalFocus';
import Icon from './Icon';

export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null); // index within `items`, or null

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
            <button
              key={`${g.label}-${i}`}
              type="button"
              onClick={() => setLightbox(i)}
              aria-label={`View ${g.label}`}
              className="group aspect-square bg-bg2 border border-edge rounded-xl grid place-items-center text-muted relative overflow-hidden cursor-pointer rv transition-colors"
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
            </button>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <Lightbox items={items} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} />
      )}
    </section>
  );
}

function Lightbox({ items, index, onIndex, onClose }) {
  const g = items[index];
  const many = items.length > 1;
  const boxRef = useRef(null);
  const prev = () => onIndex((index - 1 + items.length) % items.length);
  const next = () => onIndex((index + 1) % items.length);

  useModalFocus(boxRef);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, items.length]);

  return (
    <div
      ref={boxRef}
      role="dialog"
      aria-modal="true"
      aria-label={g.label}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-[up_.3s_ease_forwards]"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 w-11 h-11 grid place-items-center rounded-full border border-white/20 text-white/85 hover:text-accent hover:border-accent transition-colors cursor-pointer"
      >
        <Icon name="close" size={18} />
      </button>

      {many && (
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-3 sm:left-6 w-11 h-11 grid place-items-center rounded-full border border-white/20 text-white/85 hover:text-accent hover:border-accent transition-colors cursor-pointer"
        >
          <Icon name="arrowRight" size={20} className="rotate-180" />
        </button>
      )}
      {many && (
        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-3 sm:right-6 w-11 h-11 grid place-items-center rounded-full border border-white/20 text-white/85 hover:text-accent hover:border-accent transition-colors cursor-pointer"
        >
          <Icon name="arrowRight" size={20} />
        </button>
      )}

      <figure className="w-full max-w-[min(92vw,1000px)] flex flex-col items-center gap-4">
        <div className="relative w-full aspect-[4/3] bg-bg2 border border-edge rounded-xl grid place-items-center overflow-hidden text-muted">
          <Icon name={g.icon} size={72} className="text-accent" />
          {g.img && (
            <img
              src={`${import.meta.env.BASE_URL}${g.img}`}
              alt={g.label}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="absolute inset-0 w-full h-full object-contain bg-bg"
            />
          )}
        </div>
        <figcaption className="text-center">
          <div className="text-white font-medium">{g.label}</div>
          <div className="text-white/60 text-xs uppercase tracking-wide mt-0.5">{g.cat}</div>
        </figcaption>
      </figure>
    </div>
  );
}
