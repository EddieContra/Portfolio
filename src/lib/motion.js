import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

// gsap.matchMedia conditions shared by every scroll-driven effect.
export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  desktop: '(prefers-reduced-motion: no-preference) and (min-width: 768px)',
};

let lenis = null;

export function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Inertial smooth scroll (Lenis) driven by GSAP's ticker so ScrollTrigger
 * scrubs stay perfectly in sync. Also handles in-page #anchor links.
 * No-op under prefers-reduced-motion. Returns a destroy fn.
 */
export function initSmoothScroll() {
  if (prefersReducedMotion() || lenis) return () => {};

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => 1 - Math.pow(1 - t, 4),
    smoothWheel: true,
    anchors: { offset: -44 },
  });

  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

/** Scroll to a y position or element, smoothly if Lenis is active. */
export function scrollTo(target, opts = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset: -44, ...opts });
    return;
  }
  if (typeof target === 'number') window.scrollTo({ top: target, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  else target?.scrollIntoView?.({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

/** Pause/resume page scroll (modals, mobile menu). */
export function lockScroll(locked) {
  document.body.style.overflow = locked ? 'hidden' : '';
  if (lenis) locked ? lenis.stop() : lenis.start();
}
