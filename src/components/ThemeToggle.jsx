import { useTheme } from '../hooks/useTheme';

// Sliding pill switch. The knob carries the active icon (sun in light, moon in
// dark) and slides across a track that shows faint hint icons underneath.
// Contrast: knob is bg-bg with an accent ring so the accent icon reads in both
// themes; track border (edge) keeps it visible over the translucent stuck-nav.
export default function ThemeToggle({ className = '' }) {
  const { isDark, toggle } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={[
        'group relative inline-flex items-center w-14 h-7 shrink-0 rounded-full',
        'border border-edge bg-bg3 dark:bg-bg2 px-1 cursor-pointer',
        'transition-colors duration-300 hover:border-accent',
        className,
      ].join(' ')}
    >
      {/* hint icons behind the knob */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-1.5 text-muted">
        <SunIcon size={12} />
        <MoonIcon size={12} />
      </span>

      {/* sliding knob */}
      <span
        className={[
          'relative z-10 grid place-items-center w-5 h-5 rounded-full',
          'bg-bg text-accent shadow-sm ring-1 ring-accent/60',
          'transition-transform duration-300 ease-[cubic-bezier(.5,1.6,.5,1)]',
          isDark ? 'translate-x-7' : 'translate-x-0',
        ].join(' ')}
      >
        {/* both icons stacked, cross-fade + rotate on toggle */}
        <span className={`absolute transition-all duration-300 ${isDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}>
          <SunIcon size={13} />
        </span>
        <span className={`absolute transition-all duration-300 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`}>
          <MoonIcon size={13} />
        </span>
      </span>
    </button>
  );
}

function SunIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}
