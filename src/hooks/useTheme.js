import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'theme';
// Keep in sync with --c-bg in index.css and the boot script in index.html.
const CHROME = { dark: '#0a0a0b', light: '#f4f3ee' };

const read = () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light');

function apply(theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', CHROME[theme]);
  try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* private mode */ }
}

/**
 * Light/dark theme. The `.dark` class on <html> is the source of truth (set
 * before first paint by index.html); every component using this hook stays in
 * sync through a MutationObserver, so several toggles can be mounted at once.
 */
export function useTheme() {
  const [theme, setTheme] = useState(read);

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(read()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const toggle = useCallback(() => {
    const next = read() === 'dark' ? 'light' : 'dark';
    const swap = () => apply(next);
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Cross-fade the whole page where the View Transitions API exists.
    if (document.startViewTransition && !calm) document.startViewTransition(swap);
    else swap();
  }, []);

  return { theme, toggle, isDark: theme === 'dark' };
}
