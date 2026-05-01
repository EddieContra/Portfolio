import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import Clock from './Clock';

const LINKS = [
  { href: '#about',      label: 'About' },
  { href: '#experience', label: 'Work' },
  { href: '#projects',   label: 'Projects' },
  { href: '#gallery',    label: 'Gallery' },
  { href: '#contact',    label: 'Contact' },
];

export default function Nav() {
  const [mob, setMob] = useState(false);

  const closeMob = () => {
    setMob(false);
    document.body.style.overflow = '';
  };
  const toggleMob = () => {
    const next = !mob;
    setMob(next);
    document.body.style.overflow = next ? 'hidden' : '';
  };

  return (
    <>
      <nav className="sticky top-0 left-0 right-0 z-[200] bg-bg border-b-2 border-text">
        <div className="wrap flex justify-between items-center py-4 sm:py-5 gap-6">
          <a
            href="#hero"
            className="font-disp text-xl sm:text-2xl text-text no-underline tracking-tight uppercase shrink-0"
          >
            Eddie<span aria-hidden="true">.</span>
          </a>

          <ul className="hidden lg:flex gap-7 list-none items-center m-0 p-0">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-text no-underline text-xs font-bold uppercase tracking-[.15em] transition-colors hover-arrow"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-5 shrink-0">
            <Clock className="hidden lg:flex" />
            <ThemeToggle />
          </div>

          <div className="flex md:hidden items-center gap-3 shrink-0">
            <ThemeToggle />
            <button
              type="button"
              onClick={toggleMob}
              aria-label="Menu"
              aria-expanded={mob}
              className="flex flex-col gap-[5px] cursor-pointer z-[300] bg-transparent border-2 border-text p-2"
            >
              <span className={`w-[20px] h-[2px] bg-text block transition-all duration-300 ${mob ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`w-[20px] h-[2px] bg-text block transition-all duration-300 ${mob ? 'opacity-0' : ''}`} />
              <span className={`w-[20px] h-[2px] bg-text block transition-all duration-300 ${mob ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={[
          'fixed inset-0 bg-bg z-[250] flex flex-col justify-center items-center gap-6 px-6',
          'transition-transform duration-500 ease-[cubic-bezier(.77,0,.175,1)]',
          mob ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={closeMob}
            className="font-disp text-4xl sm:text-5xl text-text no-underline uppercase tracking-tight transition-colors hover:underline"
          >
            {l.label}
          </a>
        ))}
        <div className="mt-8 pt-8 border-t-2 border-text w-full max-w-xs">
          <Clock className="justify-center" />
        </div>
      </div>
    </>
  );
}
