import { useState } from 'react';
import { useStuckNav } from '../hooks/useStuckNav';
import { useActiveSection } from '../hooks/useActiveSection';
import { SOCIALS, EMAIL } from '../data/socials';
import ThemeToggle from './ThemeToggle';
import Icon from './Icon';

const LINKS = [
  { href: '#about',      label: 'About' },
  { href: '#experience', label: 'Work' },
  { href: '#projects',   label: 'Projects' },
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
          'fixed inset-0 z-[250] bg-bg/95 backdrop-blur-xl flex flex-col',
          'transition-transform duration-500 ease-[cubic-bezier(.77,0,.175,1)]',
          mob ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        aria-hidden={!mob}
      >
        <div className="flex flex-col h-full px-8 pt-24 pb-10">
          <span className="sec-label">Navigation</span>

          <nav className="flex flex-col mt-3 divide-y divide-edge">
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
                    'group flex items-center justify-between py-4 no-underline transition-all duration-500',
                    mob ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6',
                  ].join(' ')}
                >
                  <span className="flex items-baseline gap-4">
                    <span className="text-xs font-mono text-muted w-6">{`0${i + 1}`}</span>
                    <span
                      className={[
                        'font-disp text-3xl font-extrabold italic tracking-tight transition-colors',
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
            className="mt-auto pt-8 transition-all duration-500"
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
                  className="w-9 h-9 grid place-items-center border border-edge rounded-full text-muted transition-colors hover:bg-text hover:text-bg hover:border-text"
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
