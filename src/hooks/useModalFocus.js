import { useEffect } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea';

/**
 * Modal focus management: on open, moves focus into the container (first
 * focusable element), traps Tab within it, and restores focus to the
 * previously focused element on close.
 */
export function useModalFocus(containerRef, open = true) {
  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    if (!container) return;

    const previous = document.activeElement;
    const focusables = () => container.querySelectorAll(FOCUSABLE);
    focusables()[0]?.focus();

    const onKey = (e) => {
      if (e.key !== 'Tab') return;
      const els = focusables();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    container.addEventListener('keydown', onKey);
    return () => {
      container.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [containerRef, open]);
}
