import { useEffect, useRef } from 'react';

// Site-wide constellation field — a low-opacity canvas of drifting dots that
// connect to nearby neighbours and toward the cursor. Sits behind everything
// (-z-10) so the existing body dot-grid + content render on top.
//
// Theme-aware: reads --c-accent from the root and re-reads it whenever the
// .dark class flips (via MutationObserver — fires only on toggle, not per frame).
// Respects prefers-reduced-motion (single static frame) and pauses when the
// tab is hidden. Cursor linking is skipped on coarse-pointer devices.

const LINK_DIST = 130;     // px — connect dots closer than this
const CURSOR_DIST = 170;   // px — connect dots to the cursor within this
const SPEED = 0.18;        // base drift speed

// Light-theme dot color. Matches the custom cursor, which reads as blue on a
// white page (its mix-blend-difference inverts the orange accent over white).
const LIGHT_DOT = [0, 148, 255];

function parseRgb(raw, fallback) {
  // tokens are space-separated rgb, e.g. "200 241 53"
  const parts = raw.trim().split(/\s+/).map(Number);
  return parts.length === 3 && parts.every((n) => !Number.isNaN(n)) ? parts : fallback;
}

// Picks the constellation color + opacities per theme. On dark the lime accent
// reads well on near-black, so keep it punchy. On light, use a blue matching the
// cursor at lower opacity so the field stays visible on white without hurting
// readability.
function readPalette() {
  const style = getComputedStyle(document.documentElement);
  const isDark = document.documentElement.classList.contains('dark');
  if (isDark) {
    return { color: parseRgb(style.getPropertyValue('--c-accent'), [200, 241, 53]), dotA: 0.55, lineA: 0.22, cursorA: 0.5 };
  }
  return { color: LIGHT_DOT, dotA: 0.42, lineA: 0.12, cursorA: 0.4 };
}

export default function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;

    let palette = readPalette();
    let dots = [];
    let w = 0, h = 0, dpr = 1;
    let raf = 0;
    let running = true;
    const mouse = { x: -9999, y: -9999 };

    const targetCount = () => {
      const area = window.innerWidth * window.innerHeight;
      // ~1 dot per 14k px², capped for performance / mobile
      return Math.min(90, Math.max(28, Math.round(area / 14000)));
    };

    const makeDots = () => {
      const n = targetCount();
      dots = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r: Math.random() * 1.4 + 0.6,
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeDots();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const { color: [r, g, b], dotA, lineA, cursorA } = palette;

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        if (!reduced) {
          d.x += d.vx;
          d.y += d.vy;
          if (d.x < 0 || d.x > w) d.vx *= -1;
          if (d.y < 0 || d.y > h) d.vy *= -1;
        }

        // dot
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${dotA})`;
        ctx.fill();

        // links to nearby dots
        for (let j = i + 1; j < dots.length; j++) {
          const e = dots[j];
          const dx = d.x - e.x;
          const dy = d.y - e.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * lineA;
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(e.x, e.y);
            ctx.stroke();
          }
        }

        // link to cursor
        if (!coarse) {
          const mdx = d.x - mouse.x;
          const mdy = d.y - mouse.y;
          const mdist = Math.hypot(mdx, mdy);
          if (mdist < CURSOR_DIST) {
            const alpha = (1 - mdist / CURSOR_DIST) * cursorA;
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    };

    const tick = () => {
      if (!running) return;
      draw();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      tick();
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    // Re-read palette whenever the theme class flips
    const observer = new MutationObserver(() => {
      palette = readPalette();
      if (reduced) draw(); // refresh the static frame
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    resize();
    if (reduced) {
      running = false;
      draw(); // one static frame
    } else {
      tick();
    }

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    if (!coarse) {
      window.addEventListener('mousemove', onMove, { passive: true });
      document.addEventListener('mouseleave', onLeave);
    }

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}
