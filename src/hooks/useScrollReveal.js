import { useEffect } from 'react';

/**
 * Watches all `.rv` elements in the document and adds `.in` when they
 * enter the viewport. Re-observes on every render so it picks up
 * elements added by filters/tabs/etc.
 */
export function useScrollReveal(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll('.rv:not(.in)');
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
