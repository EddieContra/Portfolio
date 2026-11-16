import existing from 'virtual:public-images';

const present = new Set(existing);

/**
 * URL for an optional image under public/, or null when the file is not there.
 * Render the <img> only when this returns a URL; otherwise show the fallback.
 */
export function asset(path) {
  return path && present.has(path) ? `${import.meta.env.BASE_URL}${path}` : null;
}

/** URL for a file that always exists under public/ (CV, portrait). */
export function publicUrl(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}
