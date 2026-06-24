# CLAUDE.md

Guidance for Claude Code (and humans) working in this repository.

## What this is

Eddie's personal portfolio — a single-page site built with **Vite + React 18 + Tailwind CSS 3**.
Auto-deployed to GitHub Pages via Actions on every push to `main`.
Live: <https://eddiecontra.github.io/Portfolio/>

## Commands

```bash
npm install      # install deps
npm run dev      # dev server → http://localhost:5173/Portfolio/
npm run build    # production build → dist/
npm run preview  # preview the production build
```

There is no test suite or linter configured; "verify" means `npm run build` succeeds and the dev server renders without console errors.

## Architecture

The site is **data-driven**: each section is a presentational component in `src/components/`
that maps over a plain-JS array exported from `src/data/`. To change content, edit the data
file — not the component.

```
src/
├── App.jsx                # composes overlays (Background, Cursor, ScrollProgress, Nav) + sections
├── main.jsx               # React entry, imports index.css
├── index.css              # Tailwind layers + theme tokens (CSS variables) + keyframes
├── components/            # one file per section, plus shared utilities
│   ├── Background.jsx     # site-wide constellation canvas (theme-aware, reduced-motion safe)
│   ├── Icon.jsx           # ALL inline SVG icons (brand + line). Use this, never emojis.
│   ├── ThemeToggle.jsx    # animated sliding light/dark switch
│   ├── Nav.jsx            # sticky nav with scroll-spy active highlighting
│   └── …                  # Hero, About, Skills, Projects, Gallery, etc.
├── data/                  # content modules — edit these to update the site
└── hooks/                 # useTheme, useStuckNav, useScrollReveal, useActiveSection
```

## Conventions

### Theming — use the tokens, never hard-coded colors
All colors are CSS variables defined in `src/index.css` (`:root` = light, `.dark` = dark) and
exposed as Tailwind utilities in `tailwind.config.js`:

| Utility | Meaning |
|---|---|
| `bg-bg` / `bg-bg2` / `bg-bg3` | page / card / raised surfaces |
| `text-text` / `text-muted` | primary / secondary text |
| `text-accent`, `bg-accent` | accent (orange in light, lime in dark) |
| `border-edge` | hairline borders |

Always style with these utilities so light/dark both work. The `.dark` class is toggled on
`<html>` by `useTheme`; a script in `index.html` restores it before first paint (no flash).

### Icons — `Icon.jsx`, not emojis
Icons are inline SVGs in `src/components/Icon.jsx`, rendered as `<Icon name="…" size={n} />`.
They inherit color via `currentColor` (set `text-accent` etc. on a parent). Two families:
- **brand** (filled): `github, linkedin, instagram, whatsapp, pinterest, x`
- **line** (stroked, Lucide-style): `mail, messageCircle, mapPin, download, arrowRight, arrowUpRight,
  code, layers, atom, palette, camera, book, briefcase, search, sparkles, globe, monitor, cpu,
  gamepad, users, image, sunrise, pencil, film, smartphone, leaf, video, fileText, layout`

When content needs a new icon, add a line entry to `LINE_ICONS` and reference it by name from
the data file — do not paste an emoji into JSX or data.

### Animations / motion
Scroll-reveal: add the `rv` class (and optional `rv-d1`..`rv-d4` stagger) — `useScrollReveal`
toggles `.in` on viewport entry. All motion respects `prefers-reduced-motion`.

## Updating content

| What | Where |
|---|---|
| Projects | `src/data/projects.js` |
| Experience tabs | `src/data/experience.js` |
| Gallery items | `src/data/gallery.js` |
| Testimonials | `src/data/testimonials.js` |
| Skill cards | `src/data/skills.js` |
| "Currently" cards & hero role rotator | `src/data/now.js` |
| Email + social links | `src/data/socials.js` (shared by Contact + mobile nav) |
| Contact rows (email/WhatsApp/location) | `src/components/Contact.jsx` |
| CV file | `public/cv.pdf` |

See the `update-portfolio` skill (`.claude/skills/update-portfolio/`) for the exact object
shapes and step-by-step guidance when editing these.

## Git

- Default branch: `main` (pushing there triggers the Pages deploy).
- Do not commit `node_modules/` or `dist/` (already in `.gitignore`).
