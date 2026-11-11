# CLAUDE.md

Guidance for Claude Code (and humans) working in this repository.

## What this is

Eddie's personal portfolio — a cinematic, Apple-styled single-page site built with **Vite + React 18 +
Tailwind CSS 3**, with **GSAP ScrollTrigger + Lenis** for scroll choreography and **Three.js (React Three
Fiber)** for the 3D hero.
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
├── App.jsx                # inits smooth scroll; composes ScrollProgress, Nav + chapters
├── main.jsx               # React entry, imports index.css
├── index.css              # Tailwind layers + theme tokens (CSS variables) + Apple utilities
├── lib/motion.js          # GSAP/ScrollTrigger registration, Lenis smooth scroll, scrollTo, lockScroll, MQ
├── components/
│   ├── three/HeroScene.jsx    # R3F chrome torus-knot scene (lazy chunk); supportsWebGL.js gate
│   ├── Hero.jsx           # 3D stage + headline; static CSS orb fallback (reduced motion / no WebGL)
│   ├── About.jsx          # manifesto (RevealText) + portrait + stats + "Right now" cards (NOW_CARDS)
│   ├── Experience.jsx     # sticky timeline, rail fills on scroll
│   ├── Projects.jsx       # pinned horizontal showcase (desktop) / stack (mobile) + ProjectModal sheet
│   ├── ProjectArt.jsx     # generated "app screen" artwork used when a project has no image
│   ├── Skills.jsx         # bento grid (featured / wide tiles)
│   ├── Gallery.jsx        # segmented filter + grid + lightbox
│   ├── RevealText.jsx     # word-by-word "highlight as you read" paragraph
│   ├── Icon.jsx           # ALL inline SVG icons (brand + line). Use this, never emojis.
│   └── …                  # Nav, ThemeToggle, Testimonials, Contact, Footer, ScrollProgress
├── data/                  # content modules — edit these to update the site
└── hooks/                 # useTheme, useTilt, useReducedMotion, useScrollReveal, useActiveSection, …
```

## Conventions

### Theming — use the tokens, never hard-coded colors
All colors are CSS variables defined in `src/index.css` (`:root` = light, `.dark` = dark) and
exposed as Tailwind utilities in `tailwind.config.js`:

| Utility | Meaning |
|---|---|
| `bg-bg` / `bg-bg2` / `bg-bg3` | page / tile / raised surfaces (black · #161617 · #1d1d1f in dark) |
| `text-text` / `text-muted` | primary / secondary text |
| `text-accent`, `bg-accent` | Apple blue (#0071e3 light, #2997ff dark) |
| `border-edge` | hairline borders |

Always style with these utilities so light/dark both work. **Dark is the default**; the `.dark`
class is toggled on `<html>` by `useTheme`, and a script in `index.html` restores it before first
paint (no flash). Typography uses the system SF stack with Inter as the web fallback.

Shared component classes in `index.css`: `.sec-label` / `.sec-title` (eyebrow + headline), `.lede`,
`.btn-fill` (blue pill), `.btn-ghost` (outline pill), `.btn-link` ("Learn more ›"), `.tile`, `.glass`,
`.spotlight` (cursor glow, driven by `useTilt`), `.text-gradient`, `.text-chrome`. Decorative artwork
(the `ProjectArt` palettes, the featured Skills tile, gallery category tints) intentionally uses fixed
colors; everything else uses tokens.

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
- Scroll-reveal: add `rv` (optional `rv-d1`..`rv-d4` stagger) — fades/lifts/un-blurs on viewport entry.
  Don't put `rv` on an element that also has its own transform/transition; wrap it instead.
- Scroll-driven effects use `useGSAP` + `gsap.matchMedia()` with `MQ.motion` / `MQ.desktop` from
  `src/lib/motion.js`, so they're skipped under `prefers-reduced-motion` and reverted on unmount.
- 3D tilt + spotlight on cards: `const ref = useTilt()` on an element with `spotlight`.
- Modals/menus lock scroll with `lockScroll(true|false)` (pauses Lenis too); scrollable overlays need
  `data-lenis-prevent`.
- Three.js is only imported by `three/HeroScene.jsx`, which is `React.lazy`-loaded — keep it that way.

## Updating content

| What | Where |
|---|---|
| Projects | `src/data/projects.js` |
| Experience tabs | `src/data/experience.js` |
| Gallery items | `src/data/gallery.js` |
| Testimonials | `src/data/testimonials.js` |
| Skill cards | `src/data/skills.js` |
| "Right now" cards (in About) & hero role rotator | `src/data/now.js` |
| Email + social links | `src/data/socials.js` (shared by Contact + mobile nav) |
| Contact rows (email/WhatsApp/location) | `src/components/Contact.jsx` |
| CV file | `public/cv.pdf` |

See the `update-portfolio` skill (`.claude/skills/update-portfolio/`) for the exact object
shapes and step-by-step guidance when editing these.

## Git

- Default branch: `main` (pushing there triggers the Pages deploy).
- Do not commit `node_modules/` or `dist/` (already in `.gitignore`).
