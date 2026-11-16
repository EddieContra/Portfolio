// Tiny inline markup for copy in src/data: [[phrase]] is emphasised.
const MARK = /\[\[(.+?)\]\]/g;

/** Split "a [[b]] c" into [{ text: 'a ' }, { text: 'b', strong: true }, { text: ' c' }]. */
export function parseRich(source) {
  const parts = [];
  let last = 0;
  for (const match of source.matchAll(MARK)) {
    if (match.index > last) parts.push({ text: source.slice(last, match.index) });
    parts.push({ text: match[1], strong: true });
    last = match.index + match[0].length;
  }
  if (last < source.length) parts.push({ text: source.slice(last) });
  return parts;
}

/** Render rich copy; emphasised phrases get `strongClass`. */
export function Rich({ text, strongClass = 'text-text font-medium' }) {
  return parseRich(text).map((part, i) =>
    part.strong
      ? <span key={i} className={strongClass}>{part.text}</span>
      : part.text
  );
}
