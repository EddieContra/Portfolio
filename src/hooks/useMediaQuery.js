import { useEffect, useState } from 'react';

/** Live boolean for a CSS media query. */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);

  return matches;
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

/** A mouse or trackpad: hover effects and pointer-driven motion make sense. */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');
