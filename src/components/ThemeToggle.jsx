import { useTheme } from '../hooks/useTheme';
import Icon from './Icon';

/** Round light/dark switch (44px target). Sun and moon swap with a turn. */
export default function ThemeToggle({ className = '' }) {
  const { isDark, toggle } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark theme"
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggle}
      className={`relative grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full text-text transition-colors duration-200 hover:bg-text/10 ${className}`}
    >
      <Icon
        name="sun"
        size={19}
        className={`absolute transition-all duration-500 ease-out ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
      />
      <Icon
        name="moon"
        size={19}
        className={`absolute transition-all duration-500 ease-out ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`}
      />
    </button>
  );
}
