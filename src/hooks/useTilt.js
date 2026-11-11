import { useEffect, useRef } from 'react';

/**
 * Pointer-driven 3D tilt with a spring-ish lerp, plus --mx / --my / --spot
 * CSS variables for the `.spotlight` glow. Attach the returned ref to the
 * element that should tilt. Disabled on touch and under reduced motion
 * (the spotlight still works with a mouse when only tilt is disabled).
 */
export function useTilt({ max = 8, scale = 1.015, lerp = 0.12 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cur = { rx: 0, ry: 0, s: 1 };
    const tgt = { rx: 0, ry: 0, s: 1 };
    let raf = 0;
    let active = false;

    const render = () => {
      cur.rx += (tgt.rx - cur.rx) * lerp;
      cur.ry += (tgt.ry - cur.ry) * lerp;
      cur.s += (tgt.s - cur.s) * lerp;
      el.style.transform = `perspective(1100px) rotateX(${cur.rx.toFixed(3)}deg) rotateY(${cur.ry.toFixed(3)}deg) scale(${cur.s.toFixed(4)})`;
      const settled = Math.abs(tgt.rx - cur.rx) < 0.01 && Math.abs(tgt.ry - cur.ry) < 0.01 && Math.abs(tgt.s - cur.s) < 0.0005;
      if (active || !settled) raf = requestAnimationFrame(render);
      else raf = 0;
    };
    const kick = () => { if (!raf && !reduced) raf = requestAnimationFrame(render); };

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      if (reduced) return;
      tgt.ry = (px - 0.5) * 2 * max;
      tgt.rx = -(py - 0.5) * 2 * max;
      kick();
    };
    const onEnter = () => {
      active = true;
      el.style.setProperty('--spot', '1');
      tgt.s = scale;
      kick();
    };
    const onLeave = () => {
      active = false;
      el.style.setProperty('--spot', '0');
      tgt.rx = 0; tgt.ry = 0; tgt.s = 1;
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
    };
  }, [max, scale, lerp]);

  return ref;
}
