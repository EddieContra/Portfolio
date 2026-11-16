// Hero scene: a slowly turning mountain drawn as glowing contour lines.
//
// Plain WebGL 1, no libraries (this whole file is a few KB). A flat grid is
// lifted into a volcano-shaped height field in the vertex shader; the fragment
// shader draws anti-aliased iso-lines from the interpolated height. A depth
// pre-pass hides the lines on the far side of the mountain.
//
// The page drives it: getProgress() (0..1, read every frame) tips the camera
// from a low orbit up to a top-down "map" view as the hero scrolls away, and
// setColor() follows the theme accent.

const GRID_DESKTOP = 200;   // vertices per side (200² = 40k, fits Uint16 indices)
const GRID_COMPACT = 132;
const SIZE = 2.3;           // world half-width of the terrain
const HEIGHT = 1.2;         // world height of the summit
const LEVELS = 22;          // contour lines from base to summit
const FOV = (34 * Math.PI) / 180;

const VERT = `
attribute vec2 aPos;
uniform mat4 uViewProj;
uniform vec2 uShift;
uniform vec3 uEye;
varying float vH;
varying float vR;
varying float vFog;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++) { s += a * noise(p); p = p * 2.03 + vec2(17.1, 9.2); a *= 0.5; }
  return s;
}
// A stratovolcano with a breached crater, a lower shoulder and eroded flanks.
float height(vec2 p) {
  vec2 c = p - vec2(0.04, -0.02);
  float d = length(c);
  float peak = 0.94 * exp(-d * d * 7.0);
  vec2 k = p - vec2(0.10, -0.04);
  float crater = -0.17 * exp(-dot(k, k) * 110.0);
  vec2 s = p - vec2(-0.50, 0.28);
  float shoulder = 0.30 * exp(-dot(s, s) * 8.0);
  float ridges = (fbm(p * 2.1 + 3.0) - 0.5) * 0.2 * (0.30 + peak * 1.2);
  return max(0.0, peak + crater + shoulder + ridges + 0.02 * fbm(p * 6.0));
}

void main() {
  float h = height(aPos);
  vec3 world = vec3(aPos.x * ${SIZE.toFixed(2)}, h * ${HEIGHT.toFixed(2)}, aPos.y * ${SIZE.toFixed(2)});
  vH = h;
  vR = length(aPos);
  vFog = clamp((distance(world, uEye) - 3.6) / 5.0, 0.0, 1.0);
  vec4 clip = uViewProj * vec4(world, 1.0);
  clip.xy += uShift * clip.w;
  gl_Position = clip;
}`;

const FRAG = `
#extension GL_OES_standard_derivatives : enable
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec3 uColor;
uniform float uAlpha;
uniform float uPhase;
uniform float uPx;
uniform float uReveal;
uniform vec3 uTorch;   // xy = pointer in device px, z = strength
varying float vH;
varying float vR;
varying float vFog;

void main() {
  float v = vH * ${LEVELS.toFixed(1)} - uPhase;
  float fw = fwidth(v);
  float d = abs(fract(v - 0.5) - 0.5);
  float minor = 1.0 - smoothstep(fw * 0.5 * uPx, fw * (0.5 * uPx + 1.0), d);
  float dm = abs(fract(v * 0.25 - 0.5) - 0.5) * 4.0;
  float major = 1.0 - smoothstep(fw * 0.95 * uPx, fw * (0.95 * uPx + 1.0), dm);
  float sparse = 1.0 - smoothstep(0.22, 0.55, fw);        // drop minor lines where they would alias
  float line = max(minor * 0.46 * sparse, major * mix(0.55, 1.0, sparse));

  // Intro: contours rise from the plain to the summit.
  float front = uReveal * 1.45 - 0.2;
  float shown = 1.0 - smoothstep(front - 0.1, front, vH);
  float lead = smoothstep(front - 0.26, front - 0.1, vH) * shown * (1.0 - step(0.999, uReveal));

  vec2 dp = (gl_FragCoord.xy - uTorch.xy) / (230.0 * uPx);
  float torch = exp(-dot(dp, dp)) * uTorch.z;

  float edge = 1.0 - smoothstep(0.5, 0.97, vR);
  float bright = mix(0.42, 1.0, smoothstep(0.0, 0.75, vH)) * mix(1.0, 0.3, vFog);
  float a = line * (bright + torch * 0.6 + lead * 0.8);
  a += (0.05 + torch * 0.05) * vH * vH;                    // faint glow on the upper slopes
  a = clamp(a * edge * shown * uAlpha, 0.0, 1.0);
  gl_FragColor = vec4(uColor * a, a);
}`;

// ── Minimal column-major mat4 helpers ────────────────────────────────────────
function perspective(fovy, aspect, near, far) {
  const f = 1 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0];
}

function lookAt(eye, target) {
  let zx = eye[0] - target[0], zy = eye[1] - target[1], zz = eye[2] - target[2];
  const zl = Math.hypot(zx, zy, zz) || 1;
  zx /= zl; zy /= zl; zz /= zl;
  // x = up(0,1,0) × z
  let xx = zz, xz = -zx;
  const xl = Math.hypot(xx, xz) || 1;
  xx /= xl; xz /= xl;
  // y = z × x
  const yx = zy * xz, yy = zz * xx - zx * xz, yz = -zy * xx;
  return [
    xx, yx, zx, 0,
    0, yy, zy, 0,
    xz, yz, zz, 0,
    -(xx * eye[0] + xz * eye[2]),
    -(yx * eye[0] + yy * eye[1] + yz * eye[2]),
    -(zx * eye[0] + zy * eye[1] + zz * eye[2]),
    1,
  ];
}

function multiply(a, b) {
  const out = new Float32Array(16);
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      out[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
    }
  }
  return out;
}

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`terrain shader: ${info}`);
  }
  return shader;
}

function buildGrid(n) {
  const positions = new Float32Array(n * n * 2);
  for (let j = 0, k = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      positions[k++] = (i / (n - 1)) * 2 - 1;
      positions[k++] = (j / (n - 1)) * 2 - 1;
    }
  }
  const indices = new Uint16Array((n - 1) * (n - 1) * 6);
  for (let j = 0, k = 0; j < n - 1; j++) {
    for (let i = 0; i < n - 1; i++) {
      const a = j * n + i, b = a + 1, c = a + n, d = c + 1;
      indices[k++] = a; indices[k++] = c; indices[k++] = b;
      indices[k++] = b; indices[k++] = c; indices[k++] = d;
    }
  }
  return { positions, indices };
}

const ease = (t) => 1 - Math.pow(1 - t, 3);
const mix = (a, b, t) => a + (b - a) * t;

/**
 * Start the scene on `canvas`. Returns a controller, or null when WebGL (or
 * the derivatives extension the contour shader needs) is unavailable.
 *
 *   onSlow()  called once if the device cannot hold a usable frame rate even
 *             at 1x resolution — the caller should swap in the static map.
 */
export function createTerrain(canvas, { color = [1, 1, 1], getProgress = () => 0, onSlow, watchdog = true } = {}) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'high-performance' });
  if (!gl || !gl.getExtension('OES_standard_derivatives')) return null;

  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  } catch {
    return null;
  }
  gl.useProgram(program);

  const compact = Math.min(window.innerWidth, window.innerHeight) < 700;
  const { positions, indices } = buildGrid(compact ? GRID_COMPACT : GRID_DESKTOP);
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  const ibo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const U = {};
  ['uViewProj', 'uShift', 'uEye', 'uColor', 'uAlpha', 'uPhase', 'uPx', 'uReveal', 'uTorch'].forEach((name) => {
    U[name] = gl.getUniformLocation(program, name);
  });

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  const state = {
    color,
    dpr: Math.min(window.devicePixelRatio || 1, compact ? 1.5 : 2),
    width: 0,
    height: 0,
    pointer: { x: 0, y: 0, px: -9999, py: -9999, on: 0 },   // targets
    eased: { x: 0, y: 0, px: -9999, py: -9999, on: 0, p: 0 },
    raf: 0,
    last: 0,
    time: 0,
    reveal: 0,
    frames: 0,
    slowSum: 0,
    slowStage: 0,
    destroyed: false,
  };

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    state.width = Math.round(w * state.dpr);
    state.height = Math.round(h * state.dpr);
    if (canvas.width !== state.width || canvas.height !== state.height) {
      canvas.width = state.width;
      canvas.height = state.height;
      gl.viewport(0, 0, state.width, state.height);
    }
  }

  function draw(dt) {
    const e = state.eased;
    const k = 1 - Math.exp(-dt * 4);
    e.x += (state.pointer.x - e.x) * k;
    e.y += (state.pointer.y - e.y) * k;
    e.px += (state.pointer.px - e.px) * Math.min(1, k * 2.5);
    e.py += (state.pointer.py - e.py) * Math.min(1, k * 2.5);
    e.on += (state.pointer.on - e.on) * k;
    e.p += (getProgress() - e.p) * (1 - Math.exp(-dt * 9));
    state.time += dt;
    state.reveal = Math.min(1, state.reveal + dt / 2.6);

    const aspect = state.width / state.height;
    const wide = aspect > 1.1;
    const p = e.p;

    // Camera: low orbit → top-down map as the hero scrolls away.
    const azimuth = 0.62 + state.time * 0.035 + e.x * 0.22;
    const elevation = mix(0.36, 1.25, ease(p)) - e.y * 0.05;
    const distance = mix(wide ? 5.9 : 7.4, wide ? 6.4 : 8.0, p);
    const target = [0, 0.42, 0];
    const eye = [
      target[0] + distance * Math.cos(elevation) * Math.sin(azimuth),
      target[1] + distance * Math.sin(elevation),
      target[2] + distance * Math.cos(elevation) * Math.cos(azimuth),
    ];
    const viewProj = multiply(perspective(FOV, aspect, 0.1, 30), lookAt(eye, target));

    gl.uniformMatrix4fv(U.uViewProj, false, viewProj);
    gl.uniform2f(U.uShift, wide ? mix(0.5, 0.14, p) : 0, wide ? mix(0.06, 0, p) : mix(0.36, 0.1, p));
    gl.uniform3f(U.uEye, eye[0], eye[1], eye[2]);
    gl.uniform3f(U.uColor, state.color[0], state.color[1], state.color[2]);
    gl.uniform1f(U.uAlpha, 1 - Math.min(1, p * 1.15));
    gl.uniform1f(U.uPhase, state.time * 0.055);
    gl.uniform1f(U.uPx, state.dpr);
    gl.uniform1f(U.uReveal, ease(state.reveal));
    gl.uniform3f(U.uTorch, e.px * state.dpr, state.height - e.py * state.dpr, e.on);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // 1) depth only, so the near slopes hide the lines behind them
    gl.colorMask(false, false, false, false);
    gl.depthMask(true);
    gl.depthFunc(gl.LESS);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    // 2) the lines
    gl.colorMask(true, true, true, true);
    gl.depthMask(false);
    gl.depthFunc(gl.LEQUAL);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  }

  // Frame-budget watchdog: drop to 1x, then give up, on devices that can't keep up.
  function watch(ms) {
    state.frames += 1;
    if (state.frames <= 4) return;              // let shader compilation settle
    // Hopeless case first: a few very long frames in a row and we stop at once.
    state.stalls = ms > 120 ? (state.stalls || 0) + 1 : 0;
    if (state.stalls >= 3) { state.slowStage = 2; onSlow?.(); return; }
    state.slowSum += ms;
    if (state.frames < 34) return;
    const average = state.slowSum / 30;
    state.frames = 0;
    state.slowSum = 0;
    if (state.slowStage === 0 && average > 30 && state.dpr > 1) {
      state.slowStage = 1;
      state.dpr = 1;
      resize();
    } else if (average > 42) {
      state.slowStage = 2;
      onSlow?.();
    } else {
      state.slowStage = 3;                       // healthy: stop measuring
    }
  }

  function frame(now) {
    if (state.destroyed) return;
    state.raf = requestAnimationFrame(frame);
    const ms = state.last ? now - state.last : 16.7;
    state.last = now;
    if (ms > 1000) return;                       // tab was in the background
    if (watchdog && state.slowStage < 2) watch(ms);
    if (state.destroyed) return;
    draw(Math.min(ms, 50) / 1000);
  }

  const onPointer = (event) => {
    const rect = canvas.getBoundingClientRect();
    state.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    state.pointer.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    state.pointer.px = event.clientX - rect.left;
    state.pointer.py = event.clientY - rect.top;
    state.pointer.on = 1;
  };
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer) window.addEventListener('pointermove', onPointer, { passive: true });

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  return {
    start() {
      if (state.raf || state.destroyed) return;
      state.last = 0;
      state.raf = requestAnimationFrame(frame);
    },
    stop() {
      cancelAnimationFrame(state.raf);
      state.raf = 0;
    },
    setColor(rgb) { state.color = rgb; },
    destroy() {
      state.destroyed = true;
      cancelAnimationFrame(state.raf);
      observer.disconnect();
      window.removeEventListener('pointermove', onPointer);
      gl.deleteBuffer(vbo);
      gl.deleteBuffer(ibo);
      gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
