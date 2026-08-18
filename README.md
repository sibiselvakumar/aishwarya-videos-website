# Aishwarya Videos

Marketing site for Aishwarya Videos & Photos, a wedding photography and film studio in Coimbatore. React + Vite, static output, no backend.

**Live:** https://smooth-tulip-6hdw.here.now/

## Run it

```bash
npm install
npm run dev      # dev server with HMR
npm run build    # static bundle into dist/
npm run preview  # serve dist/ locally
```

## Pages

| Route | What's on it |
|---|---|
| `/` | Hero, about band, 5x3 photo mosaic, featured shoots, Soul + Cinema video band, films grid, gallery, Our Clients band |
| `/about` | About Us — intro copy, Awards / Works / Clients columns, photo strip |
| `/photography` | Shoot collections (Prabhavathi, Hari and Harsha), 10 photos each with expand-to-all |
| `/films` | Every film, playing in an in-page overlay |
| `/contact` | Address, phone, email and the enquiry form |

Routing is a `window.location.pathname` lookup in `src/App.jsx` — every link is a full page load, so there is no router. **Deploying to a static host needs a rewrite-everything-to-`index.html` rule** (Netlify `_redirects`, Vercel rewrites, nginx `try_files`), otherwise `/about` 404s. Vite handles this in `dev` and `preview`.

## Layout

`src/styles.css` defines four scales on `.page`, so one design pixel maps to a CSS variable and the whole layout scales proportionally:

- `--u` full-bleed design px, tracks the viewport, never caps (hero, mosaic, backgrounds)
- `--c` content design px, tracks the content box which caps at 1405px
- `--cx` the content box's left edge
- `--t` type design px, caps at 1px so font sizes freeze above 1440

Sections marked `.stage` position their children absolutely with `.abs` using measured x/y/w/h values from `src/data.js`. Pages added later (`/about`, `/photography`, `/films`, `/contact`) use normal flow layout under `.doc` instead — there is no measured original to match.

## Content

Everything editable lives in `src/data.js`: copy, image URLs, nav, contact details, film list, page coordinates. Images are served from the WordPress media library at `aishwaryavideos.com/wp-content/uploads`; the `img()` helper treats a leading `/` as a local file in `public/`.

## Known gaps

- The contact form has no backend. Submitting opens the visitor's mail client addressed to info@aishwaryavideos.com with the answers pre-filled. Swap in a form service if submissions need to land in an inbox reliably.
- Film posters come from `img.youtube.com`, so a deleted or private video shows a blank frame.
