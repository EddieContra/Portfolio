import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { lockScroll } from '../lib/motion';
import { GALLERY, GALLERY_FILTERS } from '../data/gallery';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useModalFocus } from '../hooks/useModalFocus';
import Icon from './Icon';

const CAT_TINT = {
  design: 'from-[#5e5ce6]/30',
  photo:  'from-[#ff9f0a]/25',
  video:  'from-[#ff375f]/25',
  edu:    'from-[#30d158]/25',
};

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
    <section id="gallery" className="relative py-28 sm:py-40 bg-bg2/40 dark:bg-bg2/30">
      <div className="wrap">
        <span className="sec-label rv">Creative work</span>
        <h2 className="sec-title rv rv-d1">Gallery.</h2>

        <Segmented value={filter} onChange={setFilter} />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[1fr] grid-flow-dense gap-3 sm:gap-4">
          {items.map((g, i) => (
            <button
              key={`${filter}-${g.label}`}
              type="button"
              onClick={() => setLightbox(i)}
              aria-label={`View ${g.label}`}
              className={[
                'group relative aspect-square rounded-[22px] overflow-hidden cursor-pointer rv bg-bg3 text-muted',
                'hover:shadow-[0_24px_60px_-20px_rgb(var(--c-accent)/.45)]',
                i % 7 === 0 ? 'sm:col-span-2 sm:row-span-2' : '',
                `rv-d${(i % 4) + 1}`,
              ].join(' ')}
              data-cat={g.cat}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${CAT_TINT[g.cat] ?? 'from-accent/20'} to-transparent`} />
              <div className="absolute inset-0 grid place-items-center transition-transform duration-700 ease-apple group-hover:scale-110">
                <Icon name={g.icon} size={i % 7 === 0 ? 56 : 34} className="transition-colors group-hover:text-accent" />
              </div>
              {g.img && (
                <img
                  src={`${import.meta.env.BASE_URL}${g.img}`}
                  alt={g.label}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-apple group-hover:scale-105"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 p-4 text-left bg-gradient-to-t from-black/70 to-transparent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 transition-all duration-500 ease-apple">
                <div className="text-white font-semibold text-sm">{g.label}</div>
                <div className="text-white/70 text-xs capitalize">{g.cat}</div>
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

// Apple segmented control with a sliding selection pill.
function Segmented({ value, onChange }) {
  const wrapRef = useRef(null);
  const [pill, setPill] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      const btn = wrapRef.current?.querySelector('[aria-selected="true"]');
      if (btn) setPill({ left: btn.offsetLeft, width: btn.offsetWidth });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [value]);

  return (
    <div className="mb-10 -mx-6 px-6 overflow-x-auto no-scrollbar rv rv-d2">
      <div
        ref={wrapRef}
        role="tablist"
        aria-label="Filter gallery"
        className="relative inline-flex p-1 rounded-full bg-bg3/80 backdrop-blur"
      >
        <span
          aria-hidden="true"
          className="absolute top-1 bottom-1 rounded-full bg-bg shadow-[0_2px_8px_rgba(0,0,0,.18)] transition-all duration-500 ease-apple"
          style={{ left: pill.left, width: pill.width }}
        />
        {GALLERY_FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            role="tab"
            aria-selected={value === f.key}
            onClick={() => onChange(f.key)}
            className={[
              'relative z-[1] px-4 sm:px-5 py-2 text-sm whitespace-nowrap rounded-full cursor-pointer transition-colors duration-300',
              value === f.key ? 'text-text font-medium' : 'text-muted hover:text-text',
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
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
    lockScroll(true);
    return () => {
      document.removeEventListener('keydown', onKey);
      lockScroll(false);
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
      className="fixed inset-0 z-[500] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-6 animate-fade"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 w-11 h-11 grid place-items-center rounded-full bg-white/10 backdrop-blur text-white hover:bg-white/20 transition-colors cursor-pointer"
      >
        <Icon name="close" size={18} />
      </button>

      {many && (
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-3 sm:left-6 w-11 h-11 grid place-items-center rounded-full bg-white/10 backdrop-blur text-white hover:bg-white/20 transition-colors cursor-pointer"
        >
          <Icon name="arrowRight" size={20} className="rotate-180" />
        </button>
      )}
      {many && (
        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-3 sm:right-6 w-11 h-11 grid place-items-center rounded-full bg-white/10 backdrop-blur text-white hover:bg-white/20 transition-colors cursor-pointer"
        >
          <Icon name="arrowRight" size={20} />
        </button>
      )}

      <figure key={index} className="w-full max-w-[min(92vw,1000px)] flex flex-col items-center gap-4 opacity-0 animate-sheet">
        <div className="relative w-full aspect-[4/3] bg-bg2 rounded-[28px] grid place-items-center overflow-hidden text-muted">
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
