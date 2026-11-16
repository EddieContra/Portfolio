// Decides whether this device should run the live WebGL hero scene.
// Everyone else gets the static contour map, which is the same artwork drawn
// as SVG. Add ?scene=on or ?scene=off to the URL to override while testing.

function override() {
  try {
    return new URLSearchParams(window.location.search).get('scene');
  } catch {
    return null;
  }
}

function hasCapableGpu() {
  try {
    const canvas = document.createElement('canvas');
    // failIfMajorPerformanceCaveat: no context on software / blocklisted GPUs.
    const gl = canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true });
    if (!gl) return false;
    // Some browsers still hand out a software context; check the renderer name too.
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    const software = /swiftshader|llvmpipe|software|basic render/i.test(renderer);
    const ok = !software && !!gl.getExtension('OES_standard_derivatives');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return ok;
  } catch {
    return false;
  }
}

export function canRunScene() {
  const forced = override();
  if (forced === 'off') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (forced === 'on') return true;

  const nav = navigator;
  const net = nav.connection;
  if (net?.saveData) return false;                       // visitor asked to save data
  if (net?.effectiveType && /2g/.test(net.effectiveType)) return false;
  if (nav.deviceMemory && nav.deviceMemory < 4) return false;       // low-memory phones
  if (nav.hardwareConcurrency && nav.hardwareConcurrency < 4) return false;
  return hasCapableGpu();
}

/** True when ?scene=on is forcing the scene (skips the GPU caveat check). */
export function sceneForced() {
  return override() === 'on';
}
