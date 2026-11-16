import { useEffect, useState } from 'react';

/** True once (or while) the element is within `margin` of the viewport. */
export function useInView(ref, { margin = '0px', once = true } = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (once) io.disconnect();
      } else if (!once) {
        setInView(false);
      }
    }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin, once]);

  return inView;
}
