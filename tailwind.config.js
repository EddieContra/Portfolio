/** @type {import('tailwindcss').Config} */
const SF_STACK = [
  '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"',
  '"Inter"', '"Helvetica Neue"', 'system-ui', 'sans-serif',
];

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
        disp: SF_STACK,
        sans: SF_STACK,
      },
      letterSpacing: {
        apple: '-0.035em',
        tightish: '-0.015em',
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(.16, 1, .3, 1)',
      },
      keyframes: {
        up:      { '0%': { opacity: '0', transform: 'translateY(24px)', filter: 'blur(10px)' }, '100%': { opacity: '1', transform: 'none', filter: 'blur(0)' } },
        sheet:   { '0%': { opacity: '0', transform: 'translateY(32px) scale(.96)' }, '100%': { opacity: '1', transform: 'none' } },
        fade:    { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        shimmer: { '0%': { backgroundPosition: '0% 50%' }, '100%': { backgroundPosition: '200% 50%' } },
        float:   { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        progress:{ '0%': { transform: 'scaleX(0)' }, '100%': { transform: 'scaleX(1)' } },
      },
      animation: {
        up:      'up 1.1s cubic-bezier(.16,1,.3,1) forwards',
        sheet:   'sheet .55s cubic-bezier(.16,1,.3,1) forwards',
        fade:    'fade .4s ease forwards',
        shimmer: 'shimmer 8s linear infinite',
        float:   'float 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
