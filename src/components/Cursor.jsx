import { useEffect, useRef } from 'react';

const HOVER_SELECTOR = 'a, button, .proj-card, .gal-item, .exp-tab, .filt, .now-card, .tag-pill, .clickable';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    let raf;

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx - 5 + 'px';
      dot.style.top  = my - 5 + 'px';
    };

    const tick = () => {
      rx += (mx - rx - 19) * 0.12;
      ry += (my - ry - 19) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      raf = requestAnimationFrame(tick);
    };

    const onEnter = () => {
      dot.style.transform = 'scale(2.2)';
      ring.style.width = ring.style.height = '56px';
    };
    const onLeave = () => {
      dot.style.transform = 'scale(1)';
      ring.style.width = ring.style.height = '38px';
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    // Delegate hover events
    const handleOver = (e) => { if (e.target.closest(HOVER_SELECTOR)) onEnter(); };
    const handleOut  = (e) => { if (e.target.closest(HOVER_SELECTOR)) onLeave(); };
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout',  handleOut);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout',  handleOut);
    };
  }, []);

  return (
    <>
      <div
        id="cur"
        ref={dotRef}
        className="w-2.5 h-2.5 bg-accent rounded-full fixed pointer-events-none z-[9999] mix-blend-difference transition-transform duration-150"
      />
      <div
        id="cur-ring"
        ref={ringRef}
        className="w-[38px] h-[38px] border border-accent/90 rounded-full fixed pointer-events-none z-[9998] mix-blend-difference transition-[width,height] duration-300"
      />
    </>
  );
}
