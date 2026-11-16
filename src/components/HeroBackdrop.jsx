import { useEffect, useRef, useState } from 'react';
import { canRunScene, sceneForced } from '../lib/capability';
import { useTheme } from '../hooks/useTheme';
import ContourArt from './ContourArt';

const readAccent = () =>
  getComputedStyle(document.documentElement).getPropertyValue('--c-accent').trim().split(/\s+/).map((n) => Number(n) / 255);

/**
 * Hero artwork. Everyone starts with the static contour map (SVG). After first
 * paint, devices that pass `canRunScene()` load the small WebGL scene and
 * cross-fade to it; if the scene cannot hold its frame rate it hands back to
 * the static map. `progress` is a ref holding the hero's scroll-out (0..1).
 */
export default function HeroBackdrop({ progress, active }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const [live, setLive] = useState(false);
  const { theme } = useTheme();

  // Load and start the scene once the page is idle.
  useEffect(() => {
    let cancelled = false;
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 300));
    const cancelIdle = window.cancelIdleCallback || clearTimeout;

    const boot = () => {
      if (cancelled || !canRunScene()) return;
      import('../webgl/terrain').then(({ createTerrain }) => {
        if (cancelled || !canvasRef.current) return;
        const scene = createTerrain(canvasRef.current, {
          color: readAccent(),
          getProgress: () => progress.current,
          watchdog: !sceneForced(),
          onSlow: () => {
            scene?.destroy();
            sceneRef.current = null;
            setLive(false);
          },
        });
        if (!scene) return;
        sceneRef.current = scene;
        scene.start();
        setLive(true);
      }).catch(() => { /* stay on the static map */ });
    };

    const id = idle(boot, { timeout: 2000 });
    return () => {
      cancelled = true;
      cancelIdle(id);
      sceneRef.current?.destroy();
      sceneRef.current = null;
    };
  }, [progress]);

  // Pause while the hero is off screen or the tab is hidden.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;
    const sync = () => (active && !document.hidden ? scene.start() : scene.stop());
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, [active, live]);

  // Follow the theme accent.
  useEffect(() => { sceneRef.current?.setColor(readAccent()); }, [theme, live]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* soft accent bloom behind the summit */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_30%,rgb(var(--c-accent)/.10),transparent_70%)] lg:bg-[radial-gradient(45%_60%_at_72%_42%,rgb(var(--c-accent)/.10),transparent_70%)]" />

      {/* static contour map */}
      <div
        className={[
          'absolute inset-x-0 top-0 h-[70%] lg:inset-y-0 lg:left-[28%] lg:h-auto text-accent',
          'transition-opacity duration-1000 ease-out',
          '[mask-image:radial-gradient(closest-side,black_35%,transparent)]',
          live ? 'opacity-0' : 'opacity-70',
        ].join(' ')}
      >
        <ContourArt seed={7} width={900} height={700} cols={44} levels={13} peaks={2} eager className="h-full w-full" />
      </div>

      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-out ${live ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* keeps the copy readable over the artwork */}
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-bg via-bg/85 to-transparent lg:h-[40%]" />
      <div className="absolute inset-y-0 left-0 hidden w-[55%] bg-gradient-to-r from-bg/90 via-bg/50 to-transparent lg:block" />
    </div>
  );
}
