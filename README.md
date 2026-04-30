# Portfolio — Eddie

Personal portfolio site built with **Vite + React + Tailwind CSS**.
Live at: <https://eddiecontra.github.io/Portfolio/>

## Stack
- ⚛️  React 18
- ⚡ Vite 6
- 🎨 Tailwind CSS 3 (with CSS-variable theming for light/dark modes)
- 🚀 Auto-deployed to GitHub Pages via Actions on every push to `main`

## Getting started

```bash
npm install
npm run dev      # local dev server at http://localhost:5173/Portfolio/
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

## Project structure

```
src/
├── App.jsx                 # composes all sections
├── main.jsx                # React entry
├── index.css               # Tailwind + theme tokens
├── components/             # one file per section + utilities
│   ├── Cursor.jsx          # custom cursor + ring follower
│   ├── ScrollProgress.jsx
│   ├── ThemeToggle.jsx     # light/dark switcher
│   ├── ProjectModal.jsx
│   ├── Nav.jsx
│   ├── Hero.jsx
│   ├── About.jsx
│   ├── Skills.jsx
│   ├── Projects.jsx
│   ├── Experience.jsx
│   ├── Gallery.jsx
│   ├── Testimonials.jsx
│   ├── Currently.jsx
│   ├── Contact.jsx
│   └── Footer.jsx
├── data/                   # plain JS modules — swap copy / projects / etc. here
│   ├── projects.js
│   ├── experience.js
│   ├── skills.js
│   ├── gallery.js
│   ├── testimonials.js
│   └── now.js
└── hooks/
    ├── useScrollReveal.js
    ├── useTheme.js
    └── useStuckNav.js
```

## Updating content

| What | Where |
|---|---|
| Projects | `src/data/projects.js` |
| Experience tabs | `src/data/experience.js` |
| Gallery items | `src/data/gallery.js` |
| Testimonials | `src/data/testimonials.js` |
| Skill cards | `src/data/skills.js` |
| "Currently" cards & hero role rotator | `src/data/now.js` |
| Email + socials | `src/components/Contact.jsx` |

## Adding your CV

Drop your CV as `public/cv.pdf` — the "Download CV" button in the hero links there.

## Theme tokens

All colors live in CSS variables in `src/index.css` and are consumed via Tailwind utilities (`bg-bg`, `text-accent`, `border-edge`, etc.). Edit the `:root` and `.dark` blocks to retune the palette.
