import { useEffect } from 'react';

/**
 * Adds `.in` to every `.rv` element as it enters the viewport (see index.css).
 * Pass deps to re-scan after the DOM changes (e.g. a filter swaps the items).
 */
export function useScrollReveal(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll('.rv:not(.in)');
    if (!els.length) return undefined;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
