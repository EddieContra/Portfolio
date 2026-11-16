import { useEffect, useRef, useState } from 'react';
import { NAV_LINKS, SECTIONS, SITE } from '../data/site';
import { SOCIALS, EMAIL } from '../data/socials';
import { useStuckNav } from '../hooks/useStuckNav';
import { useActiveSection } from '../hooks/useActiveSection';
import { trackPageProgress } from '../lib/scroll';
import ThemeToggle from './ThemeToggle';
import Sheet from './Sheet';
import Icon from './Icon';

// Every section is observed, so no link is highlighted while the visitor is
// in a section that has no nav entry (hero, skills, testimonials…).
const SECTION_IDS = ['hero', ...Object.keys(SECTIONS)];

function Wordmark({ className = '' }) {
  return (
    <a
      href="#hero"
      aria-label={`${SITE.name}, back to top`}
      className={`font-disp text-xl font-extrabold italic tracking-tight text-text no-underline ${className}`}
    >
      {SITE.name}<span className="not-italic text-accent">.</span>
    </a>
  );
}

/** Floating pill navigation with scroll-spy and a page-progress hairline. */
export default function Nav() {
  const stuck = useStuckNav(24);
  const active = useActiveSection(SECTION_IDS);
  const [menuOpen, setMenuOpen] = useState(false);
  const progressRef = useRef(null);

  useEffect(() => trackPageProgress((p) => {
    if (progressRef.current) progressRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
  }), []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-[max(.75rem,env(safe-area-inset-top))]">
      <div className="wrap">
        <nav
          aria-label="Primary"
          className={[
            'pointer-events-auto relative flex h-14 items-center justify-between overflow-hidden rounded-full border pl-5 pr-1.5',
            'transition-[background-color,border-color,box-shadow] duration-500 ease-out',
            stuck
              ? 'border-edge bg-bg2/85 shadow-lg shadow-black/10 backdrop-blur-md'
              : 'border-transparent bg-transparent',
          ].join(' ')}
        >
          <Wordmark />

          <ul className="m-0 hidden list-none items-center gap-1 p-0 md:flex">
            {NAV_LINKS.map((link) => {
              const current = active === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={current ? 'true' : undefined}
                    className={[
                      'relative flex h-11 items-center rounded-full px-4 text-sm font-medium no-underline transition-colors duration-200',
                      current ? 'text-text' : 'text-muted hover:text-text',
                    ].join(' ')}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent transition-opacity duration-300 ${current ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-full text-text transition-colors hover:bg-text/10 md:hidden"
            >
              <Icon name="menu" size={22} />
            </button>
          </div>

          <span
            ref={progressRef}
            aria-hidden="true"
            className={`absolute inset-x-5 bottom-0 h-px origin-left bg-accent transition-opacity duration-500 ${stuck ? 'opacity-100' : 'opacity-0'}`}
            style={{ transform: 'scaleX(0)' }}
          />
        </nav>
      </div>

      {menuOpen && <MobileMenu active={active} onClose={() => setMenuOpen(false)} />}
    </header>
  );
}

function MobileMenu({ active, onClose }) {
  const links = [{ id: 'hero', label: 'Home' }, ...NAV_LINKS];

  return (
    <Sheet variant="full" label="Menu" closeLabel="Close menu" onClose={onClose} className="pointer-events-auto">
      <div className="flex h-full flex-col overflow-y-auto overscroll-contain px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.6rem,env(safe-area-inset-top))]">
        <Wordmark className="self-start" />

        <nav aria-label="Menu" className="mt-10 flex flex-col">
          {links.map((link, i) => {
            const current = active === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={onClose}
                aria-current={current ? 'true' : undefined}
                style={{ animationDelay: `${80 + i * 45}ms` }}
                className="group flex min-h-[3.75rem] items-center justify-between border-b border-edge no-underline animate-fade-up"
              >
                <span className="flex items-baseline gap-4">
                  <span className="w-6 text-xs font-semibold tabular-nums text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <span className={`font-disp text-[1.9rem] font-extrabold tracking-display ${current ? 'text-accent-ink' : 'text-text'}`}>
                    {link.label}
                  </span>
                </span>
                <Icon name="arrowUpRight" size={20} className={current ? 'text-accent-ink' : 'text-muted'} />
              </a>
            );
          })}
        </nav>

        <div className="mt-auto pt-10">
          <a href={`mailto:${EMAIL}`} className="inline-flex min-h-[2.75rem] items-center break-all text-sm text-muted no-underline">
            {EMAIL}
          </a>
          <ul className="m-0 mt-3 flex list-none flex-wrap gap-2.5 p-0">
            {SOCIALS.map((social) => (
              <li key={social.title}>
                <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={`${social.title} (opens in a new tab)`} className="icon-btn">
                  <Icon name={social.icon} size={17} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Sheet>
  );
}
