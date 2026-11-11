import { useTheme } from '../hooks/useTheme';

// Sliding pill switch. The knob carries the active icon (sun in light, moon in
// dark) and slides across a track that shows faint hint icons underneath.
// Apple-style minimal switch: neutral track, raised knob.
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
        'group relative inline-flex items-center w-11 h-6 shrink-0 rounded-full',
        'bg-bg3 px-0.5 cursor-pointer',
        'transition-colors duration-300 hover:bg-edge',
        className,
      ].join(' ')}
    >
      {/* hint icons behind the knob */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-[5px] text-muted">
        <SunIcon size={11} />
        <MoonIcon size={11} />
      </span>

      {/* sliding knob */}
      <span
        className={[
          'relative z-10 grid place-items-center w-5 h-5 rounded-full',
          'bg-bg text-text shadow-[0_2px_6px_rgba(0,0,0,.25)]',
          'transition-transform duration-500 ease-apple',
          isDark ? 'translate-x-5' : 'translate-x-0',
        ].join(' ')}
      >
        {/* both icons stacked, cross-fade + rotate on toggle */}
        <span className={`absolute transition-all duration-300 ${isDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}>
          <SunIcon size={12} />
        </span>
        <span className={`absolute transition-all duration-300 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`}>
          <MoonIcon size={12} />
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
