import { useEffect, useRef } from 'react';
import Icon from './Icon';

/**
 * Modal sheet built on the native <dialog>: the browser traps focus, makes the
 * page behind inert, closes on Escape and returns focus to the opener.
 * On phones it rises from the bottom edge; on larger screens it is centred.
 *
 * Render it only while open: {item && <Sheet …/>}.
 *   variant "sheet"  — card with its own scroll (project details)
 *   variant "full"   — edge-to-edge overlay (lightbox, mobile menu)
 */
export default function Sheet({
  onClose, labelledBy, label, variant = 'sheet', closeLabel = 'Close', className = '', children,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog.open) dialog.showModal();
    return () => { if (dialog.open) dialog.close(); };
  }, []);

  const full = variant === 'full';

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : label}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === ref.current) onClose(); }}
      className={[
        'fixed inset-0 m-0 h-full max-h-none w-full max-w-none border-0 p-0 bg-transparent overflow-hidden',
        'backdrop:bg-black/70 backdrop:backdrop-blur-sm',
        full ? '' : 'grid items-end sm:place-items-center sm:p-8',
      ].join(' ')}
    >
      <div
        className={[
          'relative animate-sheet-up',
          full
            ? 'h-full w-full bg-bg'
            : 'w-full sm:max-w-[820px] max-h-[92dvh] sm:max-h-[88dvh] overflow-y-auto overscroll-contain nice-scroll bg-bg2 border border-edge rounded-t-card sm:rounded-card shadow-2xl shadow-black/40',
          className,
        ].join(' ')}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className={[
            'icon-btn z-10',
            full
              ? 'absolute top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))]'
              : 'sticky top-4 float-right mt-4 mr-4 -mb-11',
          ].join(' ')}
        >
          <Icon name="close" size={18} />
        </button>
        {children}
      </div>
    </dialog>
  );
}
