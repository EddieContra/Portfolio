# CLAUDE.md

Guidance for Claude Code (and humans) working in this repository.

## What this is

Eddie's personal portfolio — a single-page site built with **Vite + React 18 + Tailwind CSS 3**
and nothing else at runtime: scroll effects run on a tiny in-house helper over native scrolling,
and the 3D hero is a few KB of plain WebGL.
Auto-deployed to GitHub Pages via Actions on every push to `main`.
Live: <https://eddiecontra.github.io/Portfolio/>

## Commands

```bash
npm install      # install deps
npm run dev      # dev server → http://localhost:5173/Portfolio/
npm run build    # production build → dist/
npm run preview  # preview the production build
```

There is no test suite or linter configured; "verify" means `npm run build` succeeds and the page
renders with no console errors or warnings in both themes.

**Budgets:** initial JS ≤ 100 KB gzipped (currently ~72 KB). Do not add an animation, smooth-scroll
or 3D library; see "Motion" below for what to use instead.

## Architecture

The site is **data-driven**: each section is a presentational component in `src/components/`
that renders from plain-JS modules in `src/data/`. To change content, edit the data file — not
the component. Wording in `src/data/` is synced with Eddie's CV; do not rephrase it.

```
src/
├── App.jsx                # skip link, Nav, the sections in order, Footer
├── main.jsx               # React entry, imports index.css
├── index.css              # @font-face, theme tokens, component classes, reveal + reduced-motion rules
├── data/                  # ALL content (see "Updating content")
├── lib/
│   ├── scroll.js          # trackProgress / trackPageProgress — one scroll listener + rAF for every effect
│   ├── contours.js        # seeded contour-map generator (marching squares → SVG paths)
│   ├── capability.js      # canRunScene(): which devices get the live WebGL hero
│   ├── assets.js          # asset(path): URL of an optional image, or null if the file is missing
│   └── rich.jsx           # [[emphasis]] markup for copy in data files
├── webgl/terrain.js       # the hero scene (plain WebGL, lazy-loaded, no dependencies)
├── hooks/                 # useTheme, useScrollProgress, useScrollReveal, useInView, useTilt,
│                          # useMediaQuery (+ useReducedMotion, useFinePointer), useActiveSection,
│                          # useStuckNav, useCountUp
└── components/
    ├── Nav.jsx            # floating pill nav, scroll-spy, page-progress line, mobile menu
    ├── Hero.jsx           # name, role ticker, intro, actions
    ├── HeroBackdrop.jsx   # static contour map → cross-fades to the WebGL scene when allowed
    ├── About.jsx          # word-by-word lead statement, portrait, bio, stats
    ├── Currently.jsx      # "Right now" cards
    ├── Experience.jsx     # timeline; the rail fills as you scroll
    ├── Projects.jsx       # showcase: pinned sideways scroll (desktop mouse) or swipe row (everything else)
    ├── ProjectArt.jsx     # project cover: real image if present, else generated contour art
    ├── ProjectSheet.jsx   # project details modal
    ├── Skills.jsx         # bento grid (`featured` / `wide` tiles)
    ├── Gallery.jsx        # filter chips + grid;  Lightbox.jsx — full-screen viewer
    ├── Testimonials.jsx   # carousel with pause control
    ├── Contact.jsx, Footer.jsx
    ├── SectionHeader.jsx  # numbered eyebrow + <h2>, text from SECTIONS in data/site.js
    ├── Sheet.jsx          # modal built on the native <dialog>
    ├── ContourArt.jsx     # the contour-map motif as an SVG (currentColor)
    ├── ThemeToggle.jsx
    └── Icon.jsx           # ALL inline SVG icons. Use this, never emojis.
```

`vite.config.js` defines two small plugins: `virtual:public-images` (the list of image files that
exist under `public/`, used by `asset()`) and Person JSON-LD generated from the data modules.

## Conventions

### Theming — use the tokens, never hard-coded colors
All colors are CSS variables in `src/index.css` (`:root` = light, `.dark` = dark) exposed as
Tailwind utilities in `tailwind.config.js`:

| Utility | Meaning |
|---|---|
| `bg-bg` / `bg-bg2` / `bg-bg3` | page / cards / recessed chips and icon tiles |
| `text-text` / `text-muted` | primary / secondary text (both pass AA on all three surfaces) |
| `bg-accent`, `text-accent` | accent for **fills and graphics**: orange in light, lime in dark |
| `text-accent-ink` | accent-colored **text** (a darker orange in light so it passes AA) |
| `text-accent-on` | text/icons placed **on** an accent fill |
| `border-edge` | hairline borders |

Rules of thumb: accent text → `text-accent-ink`; anything sitting on `bg-accent` → `text-accent-on`;
never `text-accent` for readable text in light mode (2.6:1). There are no hex colors in components.

**Dark is the default.** The `.dark` class on `<html>` is the source of truth: a script in
`index.html` sets it before first paint, `useTheme` toggles it (and updates the `theme-color` meta).
If you change `--c-bg`, update the two hex values in `index.html` and `useTheme.js` too.

Type is self-hosted Montserrat (`public/fonts/`, see the README there): one variable upright file
(400–800) and ExtraBold Italic for the "Eddie." wordmark, hero name and contact headline.

Shared classes in `index.css`: `.wrap`, `.section`, `.sec-label`, `.sec-title`, `.lede`, `.btn-fill`,
`.btn-ghost`, `.btn-link`, `.icon-btn` (44px round button), `.card`, `.tag-pill`, `.kicker`,
`.spotlight`. Interactive targets are at least 44×44px.

### Icons — `Icon.jsx`, not emojis
Icons are inline SVGs in `src/components/Icon.jsx`, rendered as `<Icon name="…" size={n} />`.
They inherit color via `currentColor`. Two families:
- **brand** (filled): `github, linkedin, instagram, whatsapp, pinterest, x`
- **line** (stroked, Lucide-style):
  - content: `mail, messageCircle, mapPin, code, layers, atom, palette, camera, book, briefcase,
    search, sparkles, globe, monitor, cpu, gamepad, users, image, sunrise, pencil, film, smartphone,
    leaf, video, fileText, layout`
  - UI: `download, arrowRight, arrowLeft, arrowDown, arrowUpRight, close, plus, menu, play, pause,
    sun, moon, quote`

When content needs a new icon, add a line entry to `LINE_ICONS` and reference it by name from the
data file — no emojis, no one-off SVGs in components, no text characters standing in for icons.

### Images are optional
Data files may point at images that do not exist yet (`img: 'images/projects/…'`). Always resolve
them with `asset(path)` from `src/lib/assets.js` and render the `<img>` only when it returns a URL;
otherwise show the generated artwork (`ContourArt` / `ProjectArt`). This is what keeps the console
free of 404s. Drop a file into `public/images/…` and it replaces the artwork on the next build.

### Motion
Everything runs on **native scrolling**. No GSAP, no Lenis, no scroll-jacking.

- **Reveal on scroll:** add `rv` (optional `rv-d1`..`rv-d4` stagger). Opacity + a short lift, no blur.
  Never put `rv` on an element that has its own transform or is tilted by `useTilt` — wrap it.
- **Scroll-linked effects:** `useScrollProgress(ref, { start, end })` writes `--p` (0..1) on the
  element; CSS does the rest (`transform: scaleY(var(--p))` etc.). Used by the hero exit, the About
  lead statement, the timeline rail, the pinned Projects track and the Contact headline.
- **Tilt + cursor glow on cards:** `const ref = useTilt()` on an element with the `spotlight` class
  (mouse/trackpad only).
- **Modals:** use `<Sheet>` (native `<dialog>`: focus trap, Escape, focus return, inert page).
  Render it only while open.
- **Reduced motion:** a global rule in `index.css` neutralises CSS animations and transitions; JS
  effects check `useReducedMotion()` and pass `enabled: false`, which pins `--p` at its end state.
  The Projects showcase becomes a normal swipe/scroll row and the WebGL scene is not loaded.
- Every effect should earn its place. If it does not explain structure or give feedback, leave it out.

### The WebGL hero
`HeroBackdrop` always renders the static SVG contour map first. After the page is idle it asks
`canRunScene()` (`src/lib/capability.js`): no reduced motion, no data-saver / 2G, at least 4 GB and
4 cores where the browser reports them, and a real GPU (`failIfMajorPerformanceCaveat`). Only then
is `src/webgl/terrain.js` imported. A frame-time watchdog drops resolution, then falls back to the
static map, on devices that cannot keep up. The loop pauses off screen and in background tabs.
Test overrides: `?scene=on` (force, also needed in headless browsers) and `?scene=off`.

### Accessibility
Each `<section>` is labelled by its `<h2>` (`SectionHeader`); heading levels go h1 → h2 → h3.
Keep the skip link, visible focus (global `:focus-visible`), `aria-pressed` on filter chips, the
pause button on the testimonial carousel, and "(opens in a new tab)" on external links.

## Updating content

| What | Where |
|---|---|
| Name, nav links, hero text, about text + stats, section headings | `src/data/site.js` |
| Projects | `src/data/projects.js` |
| Experience timeline | `src/data/experience.js` |
| Gallery items + filters | `src/data/gallery.js` |
| Testimonials | `src/data/testimonials.js` |
| Skill tiles | `src/data/skills.js` |
| "Currently" cards & hero role ticker | `src/data/now.js` |
| Email + social links | `src/data/socials.js` |
| Contact intro + rows (email / phone / WhatsApp / location) | `src/data/contact.js` |
| Images | `public/images/…` (see `public/images/README.md`), portrait `public/me.jpg` |
| CV file | `public/cv.pdf` |

See the `update-portfolio` skill (`.claude/skills/update-portfolio/`) for the exact object shapes.

## Git

- Default branch: `main` (pushing there triggers the Pages deploy).
- Do not commit `node_modules/` or `dist/` (already in `.gitignore`).
