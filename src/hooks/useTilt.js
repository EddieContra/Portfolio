import { useEffect, useRef } from 'react';

/**
 * Pointer-driven 3D tilt with a spring-like settle, plus --mx / --my / --spot
 * CSS variables for the `.spotlight` glow. Mouse/trackpad only; under reduced
 * motion the glow still follows the cursor but nothing rotates.
 *
 * The tilting element must not carry its own transform or the `rv` class —
 * wrap it instead.
 */
export function useTilt({ max = 6, lift = 1.012 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const current = { rx: 0, ry: 0, s: 1 };
    const target = { rx: 0, ry: 0, s: 1 };
    let raf = 0;
    let hovering = false;

    const render = () => {
      current.rx += (target.rx - current.rx) * 0.14;
      current.ry += (target.ry - current.ry) * 0.14;
      current.s += (target.s - current.s) * 0.14;
      const settled = Math.abs(target.rx - current.rx) < 0.01
        && Math.abs(target.ry - current.ry) < 0.01
        && Math.abs(target.s - current.s) < 0.0005;
      if (settled && !hovering) {
        el.style.transform = '';
        el.style.willChange = '';
        raf = 0;
        return;
      }
      el.style.transform = `perspective(1000px) rotateX(${current.rx.toFixed(2)}deg) rotateY(${current.ry.toFixed(2)}deg) scale(${current.s.toFixed(4)})`;
      raf = requestAnimationFrame(render);
    };
    const kick = () => { if (!raf && !still) raf = requestAnimationFrame(render); };

    const onMove = (event) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      target.ry = (px - 0.5) * 2 * max;
      target.rx = -(py - 0.5) * 2 * max;
      kick();
    };
    const onEnter = () => {
      hovering = true;
      el.style.setProperty('--spot', '1');
      if (!still) el.style.willChange = 'transform';
      target.s = lift;
      kick();
    };
    const onLeave = () => {
      hovering = false;
      el.style.setProperty('--spot', '0');
      target.rx = 0; target.ry = 0; target.s = 1;
      kick();
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      el.style.transform = '';
      el.style.willChange = '';
    };
  }, [max, lift]);

  return ref;
}
