---
name: update-portfolio
description: Update content on Eddie's React/Vite/Tailwind portfolio — add or edit projects, skills, gallery items, experience, testimonials, "Currently" cards, the hero role ticker, hero/about text, section headings, or contact/social links. Use whenever the user asks to change what the site says or shows. Enforces the project's data-driven conventions (edit data/ files, use Icon names not emojis, use theme tokens).
---

# Update Portfolio Content

This portfolio is **data-driven**: each section renders from a plain-JS array in `src/data/`.
To change content, edit the matching data file — the components rarely need touching.

## Golden rules

1. **Edit `src/data/*.js`, not the components**, unless you're changing layout/behavior.
2. **Never use emojis.** Icons come from `src/components/Icon.jsx`, referenced by name string.
   If no existing icon fits, add a stroked path to `LINE_ICONS` in `Icon.jsx` first, then use its name.
3. **Use theme tokens** (`bg-bg`, `text-text`, `text-muted`, `border-edge`, `bg-accent` for fills,
   `text-accent-ink` for accent-colored text, `text-accent-on` for text on an accent fill) for any
   markup so light and dark modes both work. Never hard-code hex colors.
4. **Keep the CV wording.** Text in `src/data/` mirrors Eddie's CV; change it only when he asks.
5. **Images are optional.** An `img` path may point at a file that is not there yet; the site shows
   generated contour artwork until the file is added under `public/`. Never add `<img>` tags by hand —
   components resolve paths with `asset()` from `src/lib/assets.js`.
6. After editing, run `npm run build` to confirm nothing broke.

## Where each thing lives

| Content | File | Key fields |
|---|---|---|
| Name, nav, hero + about text, stats, section headings | `src/data/site.js` | `SITE`, `NAV_LINKS`, `HERO`, `ABOUT`, `SECTIONS` |
| Projects | `src/data/projects.js` | `icon, img, tags[], name, brief, full, github, live` |
| Skill groups | `src/data/skills.js` | `icon, title, tags[]` (`wide` = full-row tile, `featured` = large accent tile) |
| Gallery items | `src/data/gallery.js` | `icon, img, label, cat` (+ `GALLERY_FILTERS`) |
| Experience timeline | `src/data/experience.js` | `role, company, date, points[]` |
| Testimonials | `src/data/testimonials.js` | `quote, name, role, avatar` (2-letter initials), `img` |
| "Currently" cards | `src/data/now.js` | `icon, label, title, sub` |
| Hero role ticker | `src/data/now.js` | `HERO_ROLES` — array of strings |
| Email + social links | `src/data/socials.js` | `EMAIL` string, `SOCIALS[]` (`icon` names) — shared by Contact + mobile nav |
| Contact intro + rows | `src/data/contact.js` | `CONTACT_INTRO`, `CONTACTS[]` (`icon, label, value, href?`) |
| CV download | drop file at `public/cv.pdf` | linked from the Hero button |

## Object shapes (copy these)

**Project** (`projects.js`) — `github`/`live` use `'#'` as placeholder or `null` to hide the button:
```js
{
  icon: 'atom',                       // an Icon name (see list below)
  tags: ['React', 'JavaScript'],
  name: 'React.js Dashboard',
  brief: 'One-line summary shown on the card.',
  full: 'Longer description shown in the modal.',
  github: '#',
  live: '#',
}
```

**Skill group** (`skills.js`):
```js
{ icon: 'code', title: 'Programming Languages', tags: ['Python', 'JavaScript'] }
```

**Gallery item** (`gallery.js`) — `cat` must match a key in `GALLERY_FILTERS`:
```js
{ icon: 'camera', label: 'Landscape', cat: 'photo' }
```

**Currently card** (`now.js`):
```js
{ icon: 'sparkles', label: 'Learning', title: 'ML & AI Engineering', sub: 'Short description.' }
```

**Experience entry** (`experience.js`), newest first:
```js
{ role: 'SW Eng Intern', company: 'Tech Co', date: 'Jan 2025 – Present', points: ['…','…'] }
```

**Emphasis in `site.js` copy** — wrap a phrase in double brackets to highlight it:
```js
"I'm [[Eddie]], a Computer Science graduate …"
```

**Section heading** (`SECTIONS` in `site.js`) — the key is the section id; order sets the number shown:
```js
about: { label: 'About', title: 'A bit about me' }
```

**Testimonial** (`testimonials.js`):
```js
{ quote: '…', name: 'Programme Lead', role: 'JA Africa', avatar: 'JA' }
```

## Available icon names

Pass any of these to an item's `icon` field (rendered via `<Icon name={…} />`):

- **Line/content:** `code, layers, atom, palette, camera, book, briefcase, search, sparkles,
  globe, monitor, cpu, gamepad, users, image, sunrise, pencil, film, smartphone, leaf, video,
  fileText, layout, mail, messageCircle, mapPin`
- **UI (used by components):** `download, arrowRight, arrowLeft, arrowDown, arrowUpRight, close, plus,
  menu, play, pause, sun, moon, quote`
- **Brand (social marks):** `github, linkedin, instagram, whatsapp, pinterest, x`

**Adding a new icon:** open `src/components/Icon.jsx`, add an entry to `LINE_ICONS` (a stroked,
24×24, Lucide-style SVG using `currentColor`, no explicit `fill` except small dots), then update
`CLAUDE.md`'s icon list and reference the new name from your data file.

## Verify

```bash
npm run dev     # check the section renders, icons show, light/dark both look right
npm run build   # must succeed before committing
```
