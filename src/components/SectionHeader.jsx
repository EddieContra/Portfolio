import { SECTIONS } from '../data/site';

const ORDER = Object.keys(SECTIONS);

/** Id of a section's heading, for `aria-labelledby` on the <section>. */
export const headingId = (id) => `${id}-title`;

/**
 * Numbered eyebrow + heading for a section, read from SECTIONS in data/site.js.
 * `children` render to the right of the title on wide screens (controls etc.).
 */
export default function SectionHeader({ id, className = '', children }) {
  const { label, title } = SECTIONS[id];
  const number = String(ORDER.indexOf(id) + 1).padStart(2, '0');

  return (
    <header className={`mb-12 sm:mb-16 flex flex-wrap items-end justify-between gap-x-10 gap-y-6 ${className}`}>
      <div className="rv">
        <p className="sec-label">
          <b aria-hidden="true">{number}</b>
          <i aria-hidden="true" />
          {label}
        </p>
        <h2 id={headingId(id)} className="sec-title">
          {title}
          <span className="text-accent" aria-hidden="true">.</span>
        </h2>
      </div>
      {children}
    </header>
  );
}
