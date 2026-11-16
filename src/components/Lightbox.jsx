import { useEffect, useRef } from 'react';
import { GALLERY_FILTERS } from '../data/gallery';
import { asset } from '../lib/assets';
import Sheet from './Sheet';
import ContourArt from './ContourArt';
import Icon from './Icon';

/** Full-screen gallery viewer: arrow keys, on-screen buttons and swipe. */
export default function Lightbox({ items, index, onIndex, onClose }) {
  const item = items[index];
  const many = items.length > 1;
  const swipe = useRef(null);
  const src = asset(item.img);
  const category = GALLERY_FILTERS.find((f) => f.key === item.cat)?.label ?? item.cat;

  const go = (dir) => onIndex((index + dir + items.length) % items.length);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'ArrowRight') go(1);
      else if (event.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  const onPointerDown = (event) => { swipe.current = { x: event.clientX, y: event.clientY }; };
  const onPointerUp = (event) => {
    if (!swipe.current || !many) return;
    const dx = event.clientX - swipe.current.x;
    const dy = event.clientY - swipe.current.y;
    swipe.current = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  };

  return (
    <Sheet variant="full" label={`Gallery viewer: ${item.label}`} closeLabel="Close viewer" onClose={onClose}>
      <div
        className="flex h-full flex-col items-center justify-center gap-5 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(4.5rem,calc(env(safe-area-inset-top)+3.5rem))] sm:px-20"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        style={{ touchAction: 'pan-y' }}
      >
        <figure key={item.id} className="m-0 flex min-h-0 w-full max-w-5xl flex-1 flex-col items-center justify-center gap-4 animate-fade-in">
          <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-card border border-edge bg-bg3">
            {src ? (
              <img src={src} alt={item.label} className="absolute inset-0 h-full w-full object-contain" />
            ) : (
              <>
                <ContourArt seed={item.id + 31} width={800} height={600} cols={40} levels={12} peaks={2} eager className="absolute inset-0 h-full w-full text-accent opacity-60" />
                <span className="absolute inset-0 grid place-items-center text-text" aria-hidden="true">
                  <Icon name={item.icon} size={64} />
                </span>
              </>
            )}
          </div>
          <figcaption className="text-center">
            <span className="block font-semibold text-text">{item.label}</span>
            <span className="block text-sm text-muted">{category}</span>
          </figcaption>
        </figure>

        {many && (
          <div className="flex items-center gap-4">
            <button type="button" className="icon-btn" onClick={() => go(-1)} aria-label="Previous item">
              <Icon name="arrowLeft" size={18} />
            </button>
            <p className="m-0 min-w-[4rem] text-center text-sm tabular-nums text-muted" aria-live="polite">
              <span className="sr-only">Item </span>{index + 1} <span aria-hidden="true">/</span><span className="sr-only">of</span> {items.length}
            </p>
            <button type="button" className="icon-btn" onClick={() => go(1)} aria-label="Next item">
              <Icon name="arrowRight" size={18} />
            </button>
          </div>
        )}
      </div>
    </Sheet>
  );
}
