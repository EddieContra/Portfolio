import { useEffect } from 'react';
import { trackProgress } from '../lib/scroll';

/**
 * Scroll-linked effects without a library: writes the element's progress
 * through the viewport (0..1) into the CSS variable `--p` on that element,
 * and the stylesheet does the rest. Pass `onProgress` to also get the number.
 *
 * `start` / `end` are viewport fractions — see trackProgress in lib/scroll.js.
 * When `enabled` is false (e.g. reduced motion) the element is pinned at its
 * finished state, `--p: 1`.
 */
export function useScrollProgress(ref, { start = 1, end = 0, enabled = true, onProgress } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!enabled) {
      el.style.setProperty('--p', '1');
      onProgress?.(1);
      return undefined;
    }
    return trackProgress(el, (p) => {
      el.style.setProperty('--p', p.toFixed(4));
      onProgress?.(p);
    }, { start, end });
    // onProgress is intentionally read fresh each run; callers pass stable refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, start, end, enabled]);
}
