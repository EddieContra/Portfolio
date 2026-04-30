import { useEffect, useState } from 'react';

/** Returns true after the page has been scrolled past `threshold` px. */
export function useStuckNav(threshold = 60) {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return stuck;
}
