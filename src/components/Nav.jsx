import { useState } from 'react';
import { useStuckNav } from '../hooks/useStuckNav';
import { useActiveSection } from '../hooks/useActiveSection';
import { SOCIALS, EMAIL } from '../data/socials';
import { lockScroll } from '../lib/motion';
import ThemeToggle from './ThemeToggle';
import Icon from './Icon';

const LINKS = [
  { href: '#about',      label: 'About' },
  { href: '#experience', label: 'Work' },
  { href: '#projects',   label: 'Projects' },
  { href: '#skills',     label: 'Skills' },
  { href: '#gallery',    label: 'Gallery' },
  { href: '#contact',    label: 'Contact' },
];

const SECTION_IDS = LINKS.map((l) => l.href.slice(1));

// The mobile overlay covers the logo, so it needs its own way back to the top.
const MOBILE_LINKS = [{ href: '#hero', label: 'Home' }, ...LINKS];

export default function Nav() {
  const stuck = useStuckNav();
  const active = useActiveSection(SECTION_IDS);
  const [mob, setMob] = useState(false);

  const closeMob = () => {
    setMob(false);
    lockScroll(false);
  };
  const toggleMob = () => {
    const next = !mob;
    setMob(next);
    lockScroll(next);
  };

  return (
    <>
      <nav
        className={[
          'fixed top-0 left-0 right-0 z-[200] transition-colors duration-500',
          stuck || mob
            ? 'bg-bg/70 backdrop-blur-xl backdrop-saturate-150 border-b border-edge/60'
            : 'bg-transparent border-b border-transparent',
        ].join(' ')}
        style={{ WebkitBackdropFilter: stuck || mob ? 'saturate(180%) blur(20px)' : undefined }}
      >
        <div className="wrap h-12 flex justify-between items-center">
          <a
            href="#hero"
            className="font-disp font-semibold text-[1.05rem] text-text no-underline tracking-tight"
          >
            Eddie<span className="text-accent">.</span>
          </a>

          <div className="flex items-center gap-8 max-[768px]:hidden">
            <ul className="flex gap-8 list-none items-center m-0 p-0">
              {LINKS.map((l) => {
                const isActive = active === l.href.slice(1);
                return (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={[
                        'text-[.78rem] tracking-[.01em] no-underline transition-colors duration-300',
                        isActive ? 'text-text' : 'text-text/60 hover:text-text',
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
              className="flex flex-col gap-[5px] cursor-pointer z-[300] bg-transparent border-none p-2 -mr-2"
            >
              <span className={`w-[18px] h-[1.5px] bg-text block transition-all duration-500 ease-apple ${mob ? 'translate-y-[3.25px] rotate-45' : ''}`} />
              <span className={`w-[18px] h-[1.5px] bg-text block transition-all duration-500 ease-apple ${mob ? '-translate-y-[3.25px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={[
          'fixed inset-0 z-[150] bg-bg/90 backdrop-blur-2xl flex flex-col',
          'transition-[opacity,visibility] duration-500 ease-apple',
          mob ? 'opacity-100 visible' : 'opacity-0 invisible',
        ].join(' ')}
        aria-hidden={!mob}
      >
        <div className="flex flex-col h-full px-8 pt-20 pb-10">
          <nav className="flex flex-col mt-3">
            {MOBILE_LINKS.map((l, i) => {
              const isActive = active === l.href.slice(1);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={closeMob}
                  aria-current={isActive ? 'page' : undefined}
                  style={{ transitionDelay: mob ? `${140 + i * 55}ms` : '0ms' }}
                  className={[
                    'group flex items-center justify-between py-2.5 no-underline transition-all duration-700 ease-apple',
                    mob ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 -translate-y-2 blur-sm',
                  ].join(' ')}
                >
                  <span className="flex items-baseline gap-4">
                    <span
                      className={[
                        'font-disp text-[2rem] font-semibold tracking-apple transition-colors',
                        isActive ? 'text-accent' : 'text-text group-hover:text-accent',
                      ].join(' ')}
                    >
                      {l.label}
                    </span>
                  </span>
                  <Icon
                    name="arrowUpRight"
                    size={20}
                    className={[
                      'transition-all duration-200 group-hover:translate-x-0.5',
                      isActive ? 'text-accent' : 'text-muted group-hover:text-accent',
                    ].join(' ')}
                  />
                </a>
              );
            })}
          </nav>

          <div
            className={`mt-auto pt-8 transition-all duration-700 ease-apple ${mob ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: mob ? `${140 + MOBILE_LINKS.length * 55}ms` : '0ms' }}
          >
            <a
              href={`mailto:${EMAIL}`}
              className="text-sm text-muted hover:text-accent transition-colors no-underline break-all"
            >
              {EMAIL}
            </a>
            <div className="flex items-center gap-2.5 mt-5">
              {SOCIALS.slice(0, 5).map((s) => (
                <a
                  key={s.title}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.title}
                  className="w-10 h-10 grid place-items-center rounded-full bg-bg3 text-muted transition-colors hover:bg-accent hover:text-white"
                >
                  <Icon name={s.icon} size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
