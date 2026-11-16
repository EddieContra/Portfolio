import { useMemo, useRef } from 'react';
import { contourPaths } from '../lib/contours';
import { useInView } from '../hooks/useInView';

/**
 * Generated contour-map artwork: the stand-in for a project / gallery image
 * and the site's decorative motif. Drawn in `currentColor`, so set a text
 * colour on a parent (e.g. `text-accent`). The paths are only computed once
 * the art is close to the viewport, and are cached per seed.
 */
export default function ContourArt({
  seed = 1, width = 400, height = 300, cols = 30, levels = 9, peaks = 3,
  eager = false, className = '',
}) {
  const ref = useRef(null);
  const near = useInView(ref, { margin: '600px' });
  const ready = eager || near;
  const paths = useMemo(
    () => (ready ? contourPaths(seed, { width, height, cols, levels, peaks }) : null),
    [ready, seed, width, height, cols, levels, peaks]
  );

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {paths && (
        <>
          <path d={paths.minor} strokeWidth="1" opacity=".45" vectorEffect="non-scaling-stroke" />
          <path d={paths.major} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </>
      )}
    </svg>
  );
}
