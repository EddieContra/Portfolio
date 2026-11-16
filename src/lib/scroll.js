// A very small scroll-progress engine built on native scrolling.
//
// One passive scroll listener + one requestAnimationFrame drive every
// scroll-linked effect on the page. Elements are measured only while they are
// near the viewport (IntersectionObserver), and each effect is a pure function
// of scroll position, so nothing here can fight the trackpad or drift.

const subscribers = new Set();
let scheduled = false;
let listening = false;

function flush() {
  scheduled = false;
  const vh = window.innerHeight;
  subscribers.forEach((sub) => { if (sub.near) sub.measure(vh); });
}

function schedule() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(flush);
}

function listen() {
  if (listening) return;
  listening = true;
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
}

function unlisten() {
  if (!listening || subscribers.size) return;
  listening = false;
  window.removeEventListener('scroll', schedule);
  window.removeEventListener('resize', schedule);
}

/**
 * Report how far `el` has travelled through the viewport as a 0..1 number.
 *
 *   start: viewport fraction (0 = top, 1 = bottom) the element's TOP must
 *          reach for progress to be 0.
 *   end:   viewport fraction the element's BOTTOM must reach for progress 1.
 *
 * Defaults (start 1, end 0) run from "entering at the bottom" to "gone past
 * the top". For a tall sticky scene use { start: 0, end: 1 }.
 * Returns an unsubscribe function.
 */
export function trackProgress(el, onProgress, { start = 1, end = 0 } = {}) {
  let last = -1;
  const sub = {
    near: false,
    measure(vh) {
      const rect = el.getBoundingClientRect();
      const from = vh * start;
      const span = rect.height + from - vh * end;
      const raw = span > 0 ? (from - rect.top) / span : 1;
      const p = Math.min(1, Math.max(0, raw));
      if (Math.abs(p - last) < 0.0005) return;
      last = p;
      onProgress(p);
    },
  };

  const io = new IntersectionObserver(([entry]) => {
    sub.near = entry.isIntersecting;
    // Measure once on every change so the effect lands on its exact end state.
    sub.measure(window.innerHeight);
  }, { rootMargin: '30% 0px 30% 0px' });

  subscribers.add(sub);
  io.observe(el);
  listen();

  return () => {
    io.disconnect();
    subscribers.delete(sub);
    unlisten();
  };
}

/** Whole-page scroll progress, 0 at the top and 1 at the very bottom. */
export function trackPageProgress(onProgress) {
  const sub = {
    near: true,
    measure(vh) {
      const total = document.documentElement.scrollHeight - vh;
      onProgress(total > 0 ? Math.min(1, window.scrollY / total) : 0);
    },
  };
  subscribers.add(sub);
  listen();
  sub.measure(window.innerHeight);
  return () => {
    subscribers.delete(sub);
    unlisten();
  };
}
