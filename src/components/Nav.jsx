import { useState } from 'react';
import { useStuckNav } from '../hooks/useStuckNav';
import ThemeToggle from './ThemeToggle';

const LINKS = [
  { href: '#about',      label: 'About' },
  { href: '#skills',     label: 'Skills' },
  { href: '#projects',   label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#gallery',    label: 'Gallery' },
  { href: '#currently',  label: 'Now' },
];

export default function Nav() {
  const stuck = useStuckNav();
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
      <nav
        className={[
          'fixed top-0 left-0 right-0 z-[200] flex justify-between items-center transition-all duration-300',
          stuck
            ? 'py-4 px-10 bg-bg/95 backdrop-blur-xl border-b border-edge'
            : 'py-7 px-10',
          'max-[1100px]:px-10 max-[768px]:!px-6',
        ].join(' ')}
      >
        <a href="#hero" className="font-disp text-[2.2rem] text-accent no-underline tracking-[3px]">E.</a>

        <div className="flex items-center gap-6 max-[768px]:hidden">
          <ul className="flex gap-10 list-none items-center">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-muted no-underline text-[.75rem] tracking-[2px] uppercase font-medium transition-colors hover:text-accent"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                className="bg-accent text-bg px-5 py-2 font-bold text-[.75rem] tracking-[2px] uppercase no-underline"
              >
                Hire Me
              </a>
            </li>
          </ul>
          <ThemeToggle />
        </div>

        <div className="hidden max-[768px]:flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={toggleMob}
            aria-label="Menu"
            aria-expanded={mob}
            className="flex flex-col gap-[5px] cursor-pointer z-[300] bg-transparent border-none p-0"
          >
            <span className={`w-[26px] h-[2px] bg-text block transition-all duration-300 ${mob ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`w-[26px] h-[2px] bg-text block transition-all duration-300 ${mob ? 'opacity-0' : ''}`} />
            <span className={`w-[26px] h-[2px] bg-text block transition-all duration-300 ${mob ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      <div
        className={[
          'fixed inset-0 bg-bg z-[250] flex flex-col justify-center items-center gap-10',
          'transition-transform duration-500 ease-[cubic-bezier(.77,0,.175,1)]',
          mob ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {[...LINKS, { href: '#contact', label: 'Contact' }].map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={closeMob}
            className="font-disp text-6xl text-text no-underline tracking-[4px] hover:text-accent transition-colors"
          >
            {l.label}
          </a>
        ))}
      </div>
    </>
  );
}
