/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg:     'rgb(var(--c-bg)      / <alpha-value>)',
        bg2:    'rgb(var(--c-bg2)     / <alpha-value>)',
        bg3:    'rgb(var(--c-bg3)     / <alpha-value>)',
        accent: 'rgb(var(--c-accent)  / <alpha-value>)',
        text:   'rgb(var(--c-text)    / <alpha-value>)',
        muted:  'rgb(var(--c-muted)   / <alpha-value>)',
        edge:   'rgb(var(--c-border)  / <alpha-value>)',
      },
      fontFamily: {
        disp: ['"Fraunces"', 'Georgia', 'ui-serif', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        up:    { '0%': { opacity: '0', transform: 'translateY(28px)' }, '100%': { opacity: '1', transform: 'none' } },
        slide: { '0%': { left: '-100%' }, '50%, 100%': { left: '100%' } },
      },
      animation: {
        up:    'up .85s ease forwards',
        slide: 'slide 2.2s 2s infinite',
      },
    },
  },
  plugins: [],
};
