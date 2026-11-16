/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;
const MONTSERRAT = ['"Montserrat"', '"Montserrat Fallback"', 'ui-sans-serif', 'system-ui', 'sans-serif'];

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg:     token('bg'),      // page
        bg2:    token('bg2'),     // cards / raised surfaces
        bg3:    token('bg3'),     // recessed chips, icon tiles
        text:   token('text'),
        muted:  token('muted'),
        edge:   token('border'),
        accent: {
          DEFAULT: token('accent'),     // fills + graphics (orange in light, lime in dark)
          ink:     token('accent-ink'), // accent-coloured TEXT that passes AA on every surface
          on:      token('on-accent'),  // text/icons placed on an accent fill
        },
      },
      fontFamily: { disp: MONTSERRAT, sans: MONTSERRAT },
      letterSpacing: { display: '-0.035em', label: '0.16em' },
      borderRadius: { card: '1.5rem' },
      transitionTimingFunction: {
        out: 'cubic-bezier(.22, 1, .36, 1)',
        'in-out': 'cubic-bezier(.65, 0, .35, 1)',
      },
      keyframes: {
        'fade-up':  { from: { opacity: '0', transform: 'translate3d(0, 20px, 0)' }, to: { opacity: '1', transform: 'none' } },
        'fade-in':  { from: { opacity: '0' }, to: { opacity: '1' } },
        'rise':     { from: { transform: 'translate3d(0, 105%, 0)' }, to: { transform: 'none' } },
        'sheet-up': { from: { opacity: '0', transform: 'translate3d(0, 28px, 0) scale(.98)' }, to: { opacity: '1', transform: 'none' } },
        'fill-x':   { from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } },
        'pulse-ring': { '0%': { transform: 'scale(1)', opacity: '.7' }, '100%': { transform: 'scale(2.6)', opacity: '0' } },
      },
      animation: {
        'fade-up':  'fade-up .8s cubic-bezier(.22,1,.36,1) both',
        'fade-in':  'fade-in .5s ease both',
        'rise':     'rise .95s cubic-bezier(.22,1,.36,1) both',
        'sheet-up': 'sheet-up .45s cubic-bezier(.22,1,.36,1) both',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(.22,1,.36,1) infinite',
        'fill-x':   'fill-x 8s linear both',
      },
    },
  },
  plugins: [],
};
