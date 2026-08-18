# CLAUDE.md

Static marketing site for Aishwarya Videos (wedding photography + films, Coimbatore). React 19 + Vite 6, no backend, no router, no state library.

## Commands

```bash
npm run dev      # vite dev server
npm run build    # static bundle into dist/
npm run preview  # serve the built bundle
```

There are no tests and no linter. Verify changes by building and looking at the page.

## Where things live

- `src/data.js` — **all content and all layout coordinates.** Copy, image URLs, nav, films, contact details, and the measured x/y/w/h for every absolutely positioned element. Most content edits are this file only.
- `src/App.jsx` — every component and the route table. One file on purpose.
- `src/styles.css` — the scale system, section styles, responsive rules.
- `src/Reveal.jsx` — IntersectionObserver fade-in wrapper.
- `public/` — local assets. `img()` in `data.js` treats a leading `/` as public, anything else as a WordPress CDN path.

## The scale system

`.page` defines four variables and everything is expressed in them. Do not hardcode px.

- `--u` full-bleed design px, tracks the viewport, never caps
- `--c` content design px, content box caps at 1405px
- `--cx` content box left edge
- `--t` type design px, caps at 1px so type freezes above 1440

In `App.jsx` the helpers `u()`, `c()`, `cx()`, `box()` and `ubox()` convert design-px numbers from `data.js` into these units. The home page sections use `.stage` + `.abs` with measured coordinates; the later pages use flow layout under `.doc`.

## Gotchas

- **Positioning.** `.play::after` is `position: absolute` and needs a positioned ancestor. On `.stage` sections the `.abs` class supplies it; anywhere else the card must set `position: relative` itself.
- **Adding a page.** Add a component in `App.jsx`, register it in the `ROUTES` map, and give the nav entry in `data.js` a root-relative href. A static host needs a rewrite-to-`index.html` rule or the route 404s.
- **Reveal animations** start at `opacity: 0`. When screenshotting or debugging layout, force them visible:
  `document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in'))`
- **Images are remote.** New photos must exist in the aishwaryavideos.com media library — check the URL returns 200 before wiring it in.

## Content rules

Site copy mirrors aishwaryavideos.com. Keep it verbatim; do not invent claims about awards, years of experience, or event counts. Film titles come from the studio's YouTube channel, not from the placeholder labels the live WordPress site shows.
