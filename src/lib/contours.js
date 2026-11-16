// Generative contour-map artwork (the site's visual motif).
//
// A seeded height field (a few soft peaks plus gentle undulation) is traced
// into iso-lines with marching squares, chained into polylines and smoothed.
// The result is a handful of SVG path strings — vector, theme-coloured via
// currentColor, and cached per seed.

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Height field for a seed: f(x, y) with x, y in 0..1 → roughly 0..1. */
function makeField(seed, peaks) {
  const rand = mulberry32(seed * 7919 + 13);
  const hills = Array.from({ length: peaks }, (_, i) => ({
    x: 0.18 + rand() * 0.64,
    y: 0.2 + rand() * 0.6,
    h: i === 0 ? 1 : 0.35 + rand() * 0.45,
    s: 5 + rand() * 9,           // sharpness
    a: 0.6 + rand() * 0.8,       // anisotropy
    r: rand() * Math.PI,
  }));
  const wave = { fx: 2 + rand() * 3, fy: 2 + rand() * 3, px: rand() * 6.28, py: rand() * 6.28 };
  return (x, y) => {
    let v = 0;
    for (const hill of hills) {
      const dx = x - hill.x, dy = y - hill.y;
      const c = Math.cos(hill.r), s = Math.sin(hill.r);
      const u = (dx * c + dy * s) * hill.a, w = (dy * c - dx * s) / hill.a;
      v += hill.h * Math.exp(-(u * u + w * w) * hill.s);
    }
    return v + 0.07 * Math.sin(x * wave.fx * 3.1 + wave.px) * Math.cos(y * wave.fy * 3.1 + wave.py);
  };
}

// Which cell edges a contour crosses, per marching-squares case.
// Edges: 0 top, 1 right, 2 bottom, 3 left.
const CASES = [
  [], [[3, 2]], [[2, 1]], [[3, 1]], [[0, 1]], [[0, 3], [2, 1]], [[0, 2]], [[0, 3]],
  [[0, 3]], [[0, 2]], [[0, 1], [3, 2]], [[0, 1]], [[3, 1]], [[2, 1]], [[3, 2]], [],
];

function traceLevel(grid, cols, rows, level) {
  const segments = [];
  const at = (i, j) => grid[j * (cols + 1) + i];
  const lerp = (a, b) => (level - a) / (b - a || 1e-9);

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const tl = at(i, j), tr = at(i + 1, j), br = at(i + 1, j + 1), bl = at(i, j + 1);
      const index = (tl > level ? 8 : 0) | (tr > level ? 4 : 0) | (br > level ? 2 : 0) | (bl > level ? 1 : 0);
      if (index === 0 || index === 15) continue;
      const point = (edge) => {
        if (edge === 0) return [i + lerp(tl, tr), j];
        if (edge === 1) return [i + 1, j + lerp(tr, br)];
        if (edge === 2) return [i + lerp(bl, br), j + 1];
        return [i, j + lerp(tl, bl)];
      };
      for (const [a, b] of CASES[index]) segments.push([point(a), point(b)]);
    }
  }
  return segments;
}

// Join loose segments into polylines so each point is emitted once and the
// line can be smoothed.
function chain(segments) {
  const key = (p) => `${Math.round(p[0] * 512)},${Math.round(p[1] * 512)}`;
  const ends = new Map();
  segments.forEach((seg, id) => {
    for (const p of seg) {
      const k = key(p);
      if (!ends.has(k)) ends.set(k, []);
      ends.get(k).push(id);
    }
  });
  const used = new Uint8Array(segments.length);
  const lines = [];

  const extend = (line, forward) => {
    for (;;) {
      const tip = forward ? line[line.length - 1] : line[0];
      const next = (ends.get(key(tip)) || []).find((id) => !used[id]);
      if (next === undefined) return;
      used[next] = 1;
      const [a, b] = segments[next];
      const other = key(a) === key(tip) ? b : a;
      if (forward) line.push(other); else line.unshift(other);
    }
  };

  segments.forEach((seg, id) => {
    if (used[id]) return;
    used[id] = 1;
    const line = [seg[0], seg[1]];
    extend(line, true);
    extend(line, false);
    lines.push(line);
  });
  return lines;
}

// Quadratic smoothing through segment midpoints.
function toPath(line, sx, sy) {
  const fmt = (p) => `${(p[0] * sx).toFixed(1)} ${(p[1] * sy).toFixed(1)}`;
  if (line.length < 3) return `M${fmt(line[0])}L${fmt(line[line.length - 1])}`;
  const closed = Math.abs(line[0][0] - line[line.length - 1][0]) < 1e-3
    && Math.abs(line[0][1] - line[line.length - 1][1]) < 1e-3;
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let d = closed ? `M${fmt(mid(line[0], line[1]))}` : `M${fmt(line[0])}L${fmt(mid(line[0], line[1]))}`;
  for (let i = 1; i < line.length - 1; i++) d += `Q${fmt(line[i])} ${fmt(mid(line[i], line[i + 1]))}`;
  d += closed ? `Q${fmt(line[0])} ${fmt(mid(line[0], line[1]))}Z` : `L${fmt(line[line.length - 1])}`;
  return d;
}

const cache = new Map();

/**
 * Contour paths for a seed. Returns { minor, major }: two SVG path `d`
 * strings in a `width` × `height` coordinate space.
 */
export function contourPaths(seed, {
  width = 400, height = 300, cols = 30, levels = 9, peaks = 3,
} = {}) {
  const id = `${seed}|${width}|${height}|${cols}|${levels}|${peaks}`;
  if (cache.has(id)) return cache.get(id);

  const rows = Math.max(4, Math.round((cols * height) / width));
  const field = makeField(seed, peaks);
  const grid = new Float32Array((cols + 1) * (rows + 1));
  let min = Infinity, max = -Infinity;
  for (let j = 0; j <= rows; j++) {
    for (let i = 0; i <= cols; i++) {
      const v = field(i / cols, j / rows);
      grid[j * (cols + 1) + i] = v;
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }

  const sx = width / cols, sy = height / rows;
  let minor = '', major = '';
  for (let l = 1; l <= levels; l++) {
    const level = min + ((max - min) * l) / (levels + 1);
    const d = chain(traceLevel(grid, cols, rows, level)).map((line) => toPath(line, sx, sy)).join('');
    if (l % 3 === 0) major += d; else minor += d;
  }

  const result = { minor, major };
  cache.set(id, result);
  return result;
}
