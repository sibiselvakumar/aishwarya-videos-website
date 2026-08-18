# Aishwarya — Photography Studio

A photography portfolio built fresh: React + Vite, no animation libraries.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build && npm run preview   # production build
```

## What's here

```
src/
  App.jsx                 section order + lightbox state
  styles.css              design tokens, layout, every animation
  data/photos.js          AUTO-GENERATED — 38 frames + inline LQIP placeholders
  data/films.js           8 real YouTube films from the Aishwarya Videos channel
  data/studio.js          real studio facts, verbatim from aishwaryavideos.com
  lib/hooks.js            reveal, in-view, parallax, scroll lock, active section
  components/
    Frame.jsx             the one image primitive (blur-up + deferred fetch)
    Nav.jsx  Hero.jsx  Marquee.jsx  Featured.jsx  Films.jsx  Gallery.jsx
    Lightbox.jsx  About.jsx  AboutPage.jsx  Contact.jsx  Footer.jsx
    Cursor.jsx  Progress.jsx
```

## Routing

Two views, no router dependency. `useHashRoute` in `lib/hooks.js` treats **only**
hashes starting with `#/` as routes, so the in-page anchors (`#work`, `#gallery`)
keep scrolling as before:

- `/` — the one-pager
- `#/about` — the full About page

Cross-route links (About → Films) clear the hash, then scroll after two frames,
once the home view has actually rendered.

## Studio content

`src/data/studio.js` holds the real name, tagline, phone, email, address, award
and services, copied verbatim from aishwaryavideos.com. The About page, the home
About section, Contact and the Footer all read from it, so those facts cannot
drift apart between sections. Edit them in one place.

Known conflict in the source material: their About page says both "over 25+ years
of experience" and "22 years of solid experience". This build uses 25+.

## Films section

Pulls from the real channel (`UCXmJWgjJC0nC4mGx8S5HwVw`). Every id in
`src/data/films.js` was verified live through YouTube's oEmbed endpoint.

The embeds are **lite**: the poster is a plain `<img>` from
`i.ytimg.com/vi/<id>/maxresdefault.jpg`, and the player iframe is only injected
when someone presses play. Eight eager YouTube iframes would each pull roughly a
megabyte of player JS — more than the entire rest of the page combined.

To add a film, take the id from its `watch?v=` URL and confirm
`https://i.ytimg.com/vi/<id>/maxresdefault.jpg` returns a real image (YouTube
serves a grey placeholder for some older uploads).

## Gallery

Shows 10 frames, then a "See all N frames" button reveals the rest. Change
`INITIAL` at the top of `src/components/Gallery.jsx`. Switching category filters
collapses back to 10 on purpose — otherwise flipping filters while expanded
dumps all 17 landscapes on screen with no way back.

## Dependencies

`react`, `react-dom`, `vite`, `@vitejs/plugin-react`. That's the whole list.

Everything that usually pulls a library is native here:

| Need | Used instead of |
|---|---|
| `IntersectionObserver` | GSAP ScrollTrigger / AOS |
| CSS `clip-path` + `transform` | Framer Motion |
| `scroll-behavior: smooth` | Lenis / Locomotive |
| `<dialog>` + `showModal()` | a lightbox package + focus-trap |
| CSS `columns` | Masonry.js / react-masonry |

## Images

Placeholders are hotlinked from the Unsplash CDN (`images.unsplash.com`), which
accepts imgix transform params — `w`, `q`, `fm=webp`, `fit`, `ar`. Note that
`source.unsplash.com` has been dead since 2021; don't reach for it.

To swap in real photographs, replace the entries in `src/data/photos.js` and
regenerate the `lqip` values (16px blurred JPEG data URIs). Any 16px-wide blurred
export works; the field just needs to be a data URI.

## Two things worth knowing before you edit

**`Frame` gates `src` on intersection rather than trusting `loading="lazy"`.**
React inserts all 38 gallery images in a single commit, before layout has given
them Y positions. Chrome evaluates lazy-loading eligibility at insertion time,
sees every image at y≈0, and fetches the lot. Measured on this page: 43/43 images
loaded with the deepest tile 9093px below the fold. The `useInView` gate brings
that to 1 image at first paint. If you refactor `Frame`, keep the gate.

**`useParallax` takes pixels, not a fraction.** `useParallax(55)` means ±55px of
travel. The transform is applied to the media *wrapper*, not the frame inside it,
because the frame is clipped and would show a gap at whichever edge it drifts from.

## Contact form

Validates client-side; there is no endpoint. Point `onSubmit` in
`src/components/Contact.jsx` at your form service.

## Accessibility

Skip link, visible focus rings, `aria-current` nav state, labelled form fields with
`aria-invalid` + `aria-describedby` errors, native dialog focus trapping, and a
`prefers-reduced-motion` block that resolves every animation to its end state. The
custom cursor only activates for fine pointers and never for reduced-motion users.
