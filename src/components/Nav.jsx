import { useState } from 'react';
import { useStuckNav } from '../hooks/useStuckNav';
import { useActiveSection } from '../hooks/useActiveSection';
import ThemeToggle from './ThemeToggle';

const LINKS = [
  { href: '#about',      label: 'About' },
  { href: '#experience', label: 'Work' },
  { href: '#projects',   label: 'Projects' },
  { href: '#gallery',    label: 'Gallery' },
  { href: '#contact',    label: 'Contact' },
];

const SECTION_IDS = LINKS.map((l) => l.href.slice(1));

export default function Nav() {
  const stuck = useStuckNav();
  const active = useActiveSection(SECTION_IDS);
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
          'fixed top-0 left-0 right-0 z-[200] transition-all duration-300',
          stuck ? 'bg-bg/85 backdrop-blur-md border-b border-edge shadow-[0_1px_20px_-12px_rgba(0,0,0,0.45)]' : '',
        ].join(' ')}
      >
        <div className={[
          'wrap flex justify-between items-center transition-all duration-300',
          stuck ? 'py-3' : 'py-5',
        ].join(' ')}>
          <a
            href="#hero"
            className="font-disp font-extrabold text-xl text-text no-underline tracking-tight italic"
          >
            Eddie<span className="text-accent not-italic">.</span>
          </a>

          <div className="flex items-center gap-7 max-[768px]:hidden">
            <ul className="flex gap-7 list-none items-center m-0 p-0">
              {LINKS.map((l) => {
                const isActive = active === l.href.slice(1);
                return (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={[
                        'relative text-sm no-underline transition-colors duration-200',
                        'after:absolute after:left-0 after:-bottom-1.5 after:h-[2px] after:rounded-full',
                        'after:bg-accent after:transition-all after:duration-300',
                        isActive
                          ? 'text-text after:w-full'
                          : 'text-muted hover:text-text after:w-0 hover:after:w-full',
                      ].join(' ')}
                    >
                      {l.label}
                    </a>
                  </li>
                );
              })}
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
              <span className={`w-[24px] h-[2px] bg-text block transition-all duration-300 ${mob ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`w-[24px] h-[2px] bg-text block transition-all duration-300 ${mob ? 'opacity-0' : ''}`} />
              <span className={`w-[24px] h-[2px] bg-text block transition-all duration-300 ${mob ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={[
          'fixed inset-0 bg-bg z-[250] flex flex-col justify-center items-center gap-8',
          'transition-transform duration-500 ease-[cubic-bezier(.77,0,.175,1)]',
          mob ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {LINKS.map((l, i) => {
          const isActive = active === l.href.slice(1);
          return (
            <a
              key={l.href}
              href={l.href}
              onClick={closeMob}
              style={{ transitionDelay: mob ? `${120 + i * 60}ms` : '0ms' }}
              className={[
                'font-disp text-4xl font-extrabold no-underline italic transition-all duration-500',
                mob ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                isActive ? 'text-accent' : 'text-text hover:text-accent',
              ].join(' ')}
            >
              {l.label}
            </a>
          );
        })}
      </div>
    </>
  );
}
