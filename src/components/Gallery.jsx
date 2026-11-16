import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { GALLERY, GALLERY_FILTERS } from '../data/gallery';
import { asset } from '../lib/assets';
import { useScrollReveal } from '../hooks/useScrollReveal';
import SectionHeader, { headingId } from './SectionHeader';
import ContourArt from './ContourArt';
import Lightbox from './Lightbox';
import Icon from './Icon';

const labelFor = (cat) => GALLERY_FILTERS.find((f) => f.key === cat)?.label ?? cat;

export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null); // index within `items`, or null

  const items = useMemo(
    () => GALLERY.map((item, id) => ({ ...item, id })).filter((item) => filter === 'all' || item.cat === filter),
    [filter]
  );

  // New tiles mount when the filter changes; reveal them too.
  useScrollReveal([filter]);

  return (
    <section id="gallery" aria-labelledby={headingId('gallery')} className="section border-y border-edge bg-bg2">
      <div className="wrap">
        <SectionHeader id="gallery">
          <FilterBar value={filter} onChange={setFilter} />
        </SectionHeader>

        <p className="sr-only" role="status">
          {`Showing ${items.length} ${items.length === 1 ? 'item' : 'items'}: ${labelFor(filter)}`}
        </p>

        <ul className="m-0 grid list-none grid-flow-dense grid-cols-2 gap-3 p-0 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {items.map((item, i) => (
            <li key={`${filter}-${item.id}`} className={`rv rv-d${(i % 4) + 1} ${i % 5 === 0 ? 'col-span-2 row-span-2' : ''}`}>
              <Tile item={item} large={i % 5 === 0} onOpen={() => setLightbox(i)} />
            </li>
          ))}
        </ul>
      </div>

      {lightbox !== null && (
        <Lightbox items={items} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} />
      )}
    </section>
  );
}

function Tile({ item, large, onOpen }) {
  const src = asset(item.img);
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`${item.label}, ${labelFor(item.cat)}. Open viewer`}
      className="group relative block aspect-square w-full cursor-pointer overflow-hidden rounded-[1.1rem] border border-edge bg-bg3 text-left"
    >
      {src ? (
        <img src={src} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
      ) : (
        <>
          <ContourArt seed={item.id + 31} width={300} height={300} cols={22} levels={7} peaks={2} className="absolute inset-0 h-full w-full text-accent opacity-60 transition-transform duration-700 ease-out group-hover:scale-110" />
          <span className="absolute inset-0 grid place-items-center text-text">
            <Icon name={item.icon} size={large ? 44 : 28} />
          </span>
        </>
      )}
      {/* caption is always visible: there is no hover on touch screens */}
      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-bg3 via-bg3/90 to-transparent p-3 pt-8 sm:p-4 sm:pt-10">
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-text">{item.label}</span>
          <span className="block text-xs text-muted">{labelFor(item.cat)}</span>
        </span>
        <span className="hidden h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-accent-on opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:grid">
          <Icon name="arrowUpRight" size={15} />
        </span>
      </span>
    </button>
  );
}

/** Filter chips with a sliding highlight. Scrolls sideways on narrow screens. */
function FilterBar({ value, onChange }) {
  const groupRef = useRef(null);
  const [pill, setPill] = useState(null);

  useLayoutEffect(() => {
    const group = groupRef.current;
    const measure = () => {
      const button = group.querySelector('[aria-pressed="true"]');
      if (button) setPill({ left: button.offsetLeft, width: button.offsetWidth });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(group);
    return () => observer.disconnect();
  }, [value]);

  const select = (key, event) => {
    onChange(key);
    event.currentTarget.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  };

  return (
    <div className="rv -mx-5 max-w-[100vw] overflow-x-auto px-5 no-scrollbar sm:mx-0 sm:px-0">
      <div
        ref={groupRef}
        role="group"
        aria-label="Filter gallery"
        className="relative inline-flex rounded-full border border-edge bg-bg p-1"
      >
        {pill && (
          <span
            aria-hidden="true"
            className="absolute bottom-1 top-1 rounded-full bg-text transition-[left,width] duration-500 ease-out"
            style={{ left: pill.left, width: pill.width }}
          />
        )}
        {GALLERY_FILTERS.map((option) => {
          const pressed = value === option.key;
          return (
            <button
              key={option.key}
              type="button"
              aria-pressed={pressed}
              onClick={(event) => select(option.key, event)}
              className={`relative z-[1] min-h-[2.75rem] cursor-pointer whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors duration-300 sm:px-5 ${pressed ? 'text-bg' : 'text-muted hover:text-text'}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
