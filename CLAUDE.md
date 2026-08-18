# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev                    # Vite dev server, http://localhost:5173 (auto-opens)
npm run build                  # production build to dist/
npm run preview                # serve the built dist/
```

There is no test runner and no linter configured. `npm run build` is the only
automated check — it catches JSX/syntax errors and nothing else. Verify changes by
loading the page and looking at it.

Headless check, if you have gstack's browse daemon (`~/.claude/skills/gstack/browse/dist/browse`):

```bash
B=~/.claude/skills/gstack/browse/dist/browse
$B viewport 1440x900 && $B goto http://localhost:5173/
$B js "document.getElementById('gallery').scrollIntoView({behavior:'instant'}); 'ok'"
$B js "new Promise(r=>setTimeout(()=>r('x'),2000))"   # let deferred images fetch
$B screenshot --viewport /tmp/shot.png
$B console --errors
```

Two gotchas: a **full-page** `screenshot` shows most photographs unloaded, because
`Frame` gates `src` on `useInView` — scroll to a section and shoot `--viewport`
instead. And `console` is not cleared by navigation, so run `$B console --clear`
before a reload or you will re-read errors from an earlier HMR state (this already
cost one false alarm).

## Deployment

Live at **https://presto-clover-4r7t.here.now** — hosted on here.now, permanent,
owned by the `kovan.techno@gmail.com` account, access mode `anyone_with_link`.

Always rebuild first, then publish to the **existing slug** so the URL is preserved:

```bash
npm run build
bash ~/.agents/skills/here-now/scripts/publish.sh dist --slug presto-clover-4r7t --client claude-code
```

Omitting `--slug` mints a brand-new random URL — there is no custom-slug field on
create. A chosen subdomain would need a here.now workspace or a custom domain.

The API key lives in `~/.herenow/credentials` (chmod 600); never commit it or
`.herenow/state.json`. Publishing is a three-step create → upload → finalize, and a
network failure between steps leaves a **pending, unfinalized** site. It happened
once here (transient DNS failure on the Cloudflare R2 upload host). Don't publish
again without `--slug` — check `GET /api/v1/publishes` for `status=pending` and
republish into that slug to recover it.

No SPA config is needed: the site uses hash routing, so the host only ever serves
`/`. Do not switch to path-based routes without enabling `spaMode`.

## What this is

A wedding film and photography portfolio for **Aishwarya Videos**, a real studio in
Coimbatore, Tamil Nadu. It is a single Vite + React app with two views.

Note the wider directory: this project lives in `UI design/`, alongside `frontend/`
and a legacy folder at the repo root. They are unrelated to this build — do not pull
code or conventions from them.

## Dependencies: react, react-dom, vite, @vitejs/plugin-react

That is the entire list, and it is deliberate. Everything that normally pulls a
library is native here:

| Need | Deliberately NOT used |
|---|---|
| `IntersectionObserver` | GSAP ScrollTrigger, AOS |
| CSS `clip-path` + `transform` | Framer Motion |
| `scroll-behavior: smooth` | Lenis, Locomotive |
| `<dialog>` + `showModal()` | lightbox packages, focus-trap |
| CSS `columns` | Masonry.js, react-masonry |
| hash matching in `lib/hooks.js` | react-router |

Before adding a dependency, check whether a platform feature covers it. Adding an
animation or routing library would undo the main design decision of this codebase.

## Architecture

**Two views, no router.** `useHashRoute` treats **only** hashes beginning with `#/`
as routes; everything else (`#work`, `#gallery`) stays an in-page scroll anchor.
`App.jsx` switches between the one-pager and `AboutPage`. Cross-route links clear
the hash, then scroll after two `requestAnimationFrame`s so the home view has
actually rendered before `scrollIntoView` runs.

**Data is separated from components.** Three files in `src/data/`:

- `photos.js` — **auto-generated**, 38 frames. Each carries a `ratio` (true aspect
  ratio, so `aspect-ratio` reserves exact space and CLS stays 0) and a `lqip`
  (16px blurred JPEG data URI, inline, so the blur-up placeholder costs no request).
  Also exports the Unsplash CDN URL builders (`src`, `srcCrop`, `srcSet`) and
  `byTitle(t)`. Components pick their hero/featured/about frames **by title** —
  use `byTitle`, which throws, never `PHOTOS.find(...)`, which hands the component
  `undefined` and blows up somewhere less obvious after the set is regenerated.
  Categories are wedding-shaped, not genre-shaped: `weddings` (Muhurtham),
  `portraits`, `rituals` (Mehendi & Haldi), `celebration`.
- `films.js` — 8 YouTube ids from the studio's real channel, each verified live via
  YouTube's oEmbed endpoint.
- `studio.js` — real name, tagline, phone, email, address, award, services, copied
  verbatim from aishwaryavideos.com. **The About page, home About section, Contact
  and Footer all read from here.** Change a contact detail in this one file, never
  in a component, or the sections will contradict each other. Two edits since:
  `SERVICES` gained a **Mehendi & Haldi** entry that is not on the real site, and an
  optional `ta` field (the local name for the ceremony — Muhurtham, Nichayathartham,
  Manjal Neeratu Vizha) rendered as `.services__ta` under the English title.

**One image primitive.** Every photograph on the site goes through `Frame.jsx`.
It owns the blur-up, the aspect-ratio box and the deferred fetch. Section-specific
cropping is CSS on the wrapper (`.feat__media .frame`, `.page__hero .frame`), not
new component props.

**All styling is one file**, `src/styles.css` — tokens at the top, then sections in
page order. There is no CSS-in-JS and no utility framework. Animations use only
`transform`, `opacity` and `clip-path` so they composite off the main thread, and
`prefers-reduced-motion` resolves every one of them to its end state.

**Two themes, one token block.** `:root[data-theme='light']` in `styles.css` redefines
the palette and nothing else; `useTheme` (in `lib/hooks.js`) writes the attribute and
`localStorage`, and an inline script in `index.html` sets it before first paint so a
stored light theme never flashes dark. Dark is the default.

Anything that paints *on a photograph* must not follow the theme — the scrims under it
are dark in both. Those containers (`.hero__body`, `.hero__rail`, `.tile__cap`,
`.film__icon`, `.lb`, `.nav:not(.is-stuck)`) re-declare the dark ink tokens in one
`:is()` block; add new on-photo surfaces to that list rather than hardcoding colours in
their own rules. The photo scrim gradients themselves stay literal `rgba(11, 11, 12, …)`
on purpose. The theme-aware ones are `--panel` (nav/marquee/films/about bands), `--scrim`
(`body::after`), `--backdrop-opacity` and `--on-accent` (text on a gold fill).

**The page is not flat black — it sits on a photographic backdrop.** `body::before`
holds one dimmed, blurred, desaturated frame (the "Malli Poo" id, `w=1400&q=40`) and
`body::after` is the scrim over it, at `z-index: -3` and `-2`. Deliberately *not*
`background-attachment: fixed`, which stutters on iOS. Two consequences:

- `.marquee`, `.films` and `.about` use `rgba(16, 16, 18, 0.72)` rather than
  `var(--bg-2)`. Swapping those back to the opaque token hides the backdrop under
  three solid bands.
- Anything painting below the content needs `z-index: -1` or higher, or it lands
  under the scrim. `.contact::before` (the kolam dot grid) is the existing example.

**Indian design cues, all cheap and all easy to strip by accident**: `--marigold`
and `--kumkum` tokens; the marigold `.dot` and `.marquee__sep`; the pulli kolam dot
grid on `.contact::before` (a `radial-gradient`, no asset); `.services__ta` for the
ceremony's local name; and gold italics on the featured/films/gallery headings via
`:is(.featured, .films, .gallery) .section__title em`.

## Traps that cost real debugging time

**`loading="lazy"` does not work in this app — do not "simplify" `Frame` back to it.**
React inserts all 38 gallery images in one commit, before layout has assigned them Y
positions. Chrome evaluates lazy eligibility at insertion, sees everything at y≈0 and
fetches the lot. Measured: 43/43 images loaded with the deepest tile 9093px below the
fold. `Frame` gates `src` on `useInView` instead, which brings first paint to 1 image.
An isolated static page defers correctly, so the bug reproduces only under client-side
rendering.

**The hero title's font size is tied to the length of the slogan.** Each line lives
in a `.mask` whose child slides up, so a line that wraps ruins the reveal. The
current copy ("Where tradition meets" / "a modern lens", 21 characters at the
longest) needs `clamp(1.9rem, 8vw, 7rem)`; the older three-word slogan ran at
`15vw`. Change the words, re-check both lines at 375px and 1440px.

**`useParallax` takes pixels, not a 0–1 fraction.** `useParallax(55)` means ±55px of
travel. Passing a fraction gives an invisibly small drift; the reverse mistake once
translated featured images ±1400px off-screen.

**Apply the parallax transform to the media wrapper, not the frame inside it.** The
frame is clipped, so transforming it leaves a gap at whichever edge it drifts from.

**Clamped portrait frames need `object-position: center top`.** A `max-height` clamp
on a 2:3 photo center-crops straight through people's faces.

**YouTube embeds must stay lite.** The poster is a plain `<img>`; the player iframe is
only injected on play. Eight eager iframes would each pull roughly a megabyte of
player JS — more than the rest of the page combined.

**React is 18.3, so image priority is lowercase `fetchpriority`.** The camelCase
spelling logs a console warning.

**Nothing can be layered on top of the open lightbox.** `showModal()` puts the
`<dialog>` in the browser's top layer, which paints above *every* z-index — so the
custom cursor at `z-index: 300` was drawn underneath it while `cursor: none` still
hid the real pointer, leaving no cursor at all over an open photo. The fix is a
`body.has-cursor:has(dialog[open])` block that hands the real cursor back and hides
the custom one. Raising a z-index cannot solve this class of bug; either restore
native behaviour while the dialog is open, or render the element inside the dialog.

## Content status

The films, studio name, contact details, address and About copy are real. The
**photographs are Unsplash placeholders** and their titles and captions (Madurai,
Chettinad, Kanchipuram) are invented — treat any location string in `photos.js` as
fake. Section headlines and the hero slogan ("Where tradition meets a modern lens")
are written for this build, not taken from the studio. The contact form validates
but has no endpoint; wire `onSubmit` in `Contact.jsx`.

The frames are curated **Tamil Nadu / South Indian**: silk sarees, thaali, malli
poo, manjal, temple and virundhu. Unsplash's "indian wedding" search skews heavily
North Indian (sherwani, turban, lehenga, Rajasthan) — those frames are wrong for a
Coimbatore studio and were deliberately dropped. Search `tamil wedding`,
`south indian bride saree`, `kerala hindu wedding couple`, `jasmine flowers hair`
instead when adding more.

Source conflict to be aware of: the studio's own About page claims both "over 25+
years" and "22 years of solid experience". This build uses 25+.

## Regenerating photos.js

`tools/gen_photos.py` (needs Pillow) holds the curated `META` table and emits the
file. It fetches each `w=150` thumbnail into `tools/thumbs/` on first run and caches
it there, writes a 16px blurred base64 JPEG per image, and measures each true aspect
ratio, so adding a frame is: edit `META`, rerun.

```bash
python tools/gen_photos.py src/data/photos.js
```

The `thumbs/` cache is disposable — `rm -rf tools/thumbs` to force a refetch. Only
free `images.unsplash.com/photo-<id>` ids work: `plus.unsplash.com/premium_photo-`
(Unsplash+) and `flagged/photo-` ids 404 through the CDN builders. A dead id fails
the run with `HTTP Error 404`, so check ids before a long fetch. Editing `photos.js`
by hand is fine too — just keep the shape: `ratio` must be the true aspect ratio,
`lqip` any 16px-wide blurred data URI.

Unsplash's CDN accepts imgix params (`w`, `q`, `fm=webp`, `fit`, `ar`).
`source.unsplash.com` has been dead since 2021; don't reach for it.
