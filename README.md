# Portfolio — Eddie

Personal portfolio site built with **Vite + React + Tailwind CSS**.
Live at: <https://eddiecontra.github.io/Portfolio/>

## Stack
- React 18, Vite 6, Tailwind CSS 3 (CSS-variable theming for light/dark modes)
- No animation or 3D libraries: scroll effects use a small in-house helper on native scrolling,
  and the hero's contour-line mountain is a few KB of plain WebGL
- Self-hosted Montserrat (`public/fonts/`)
- Auto-deployed to GitHub Pages via Actions on every push to `main`

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
├── App.jsx          # composes all sections
├── index.css        # fonts, theme tokens, shared classes
├── data/            # ALL content — edit these to update the site
├── components/      # one file per section + shared pieces (Icon, Sheet, ContourArt, …)
├── hooks/           # theme, scroll progress, reveal, tilt, media queries
├── lib/             # scroll helper, contour generator, device capability check, assets
└── webgl/terrain.js # the hero scene
```

`CLAUDE.md` has the full file map and the conventions (tokens, icons, motion, accessibility).

## Updating content

| What | Where |
|---|---|
| Name, nav, hero + about text, stats, section headings | `src/data/site.js` |
| Projects | `src/data/projects.js` |
| Experience timeline | `src/data/experience.js` |
| Gallery items | `src/data/gallery.js` |
| Testimonials | `src/data/testimonials.js` |
| Skill tiles | `src/data/skills.js` |
| "Currently" cards & hero role ticker | `src/data/now.js` |
| Email + socials | `src/data/socials.js` |
| Contact intro + rows | `src/data/contact.js` |

## Images and CV

- Drop your CV at `public/cv.pdf` — the "Download CV" button in the hero links there.
- Project, gallery and testimonial images are optional. Until a file exists under `public/images/`
  (filenames are listed in `public/images/README.md`) the site shows generated contour artwork in
  its place; add the file and rebuild to replace it.

## Theme tokens

All colors live in CSS variables in `src/index.css` and are consumed via Tailwind utilities
(`bg-bg`, `text-text`, `bg-accent`, `text-accent-ink`, `border-edge`, …). Edit the `:root` and
`.dark` blocks to retune the palette.

## Testing the hero scene

The live WebGL scene only runs on devices that pass a capability check; everyone else sees a static
contour map. Add `?scene=on` or `?scene=off` to the URL to force either one.
