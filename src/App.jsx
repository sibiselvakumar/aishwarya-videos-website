import { Fragment, useEffect, useRef, useState } from 'react'
import Reveal from './Reveal.jsx'
import {
  brand, nav, navMore, social, cta, hero, about, portfolio,
  featured, cinema, films, gallery, promo, footer,
  aboutPage, photographyPage, filmsPage, contactPage,
} from './data.js'

const STAGGER = 90 // ms between siblings — matches the site's "detailed" animation complexity

/* Three scales, matching the live site:
   u()  full-bleed design px — tracks the viewport, never caps
   c()  content design px    — tracks the content box, which caps at 1405px
   cx() content x            — measured at 1440, where the content box starts at 55.5 */
const u = (n) => `calc(${n} * var(--u))`
const c = (n) => `calc(${n} * var(--c))`
const cx = (n) => `calc(var(--cx) + ${n - 55.5} * var(--c))`
const box = (x, y, w, h) => ({ left: cx(x), top: c(y), width: c(w), ...(h != null ? { height: c(h) } : {}) })
const ubox = (x, y, w, h) => ({ left: u(x), top: u(y), width: u(w), ...(h != null ? { height: u(h) } : {}) })

/* Squarespace's section dividers, lifted verbatim from the live page. Three
   chevron teeth spanning -100.6%..200.6% of the box, so one full tooth lands
   inside the viewport. */
function Dividers() {
  return (
    <svg className="defs" aria-hidden="true">
      <defs>
        <clipPath id="hoc-chevron" clipPathUnits="objectBoundingBox">
          <path d="M-1.006,0.815 L-1.006,0.815 l0,0 l0.75,0.185 l0.25,-0.185 l0,0 l0.75,0.185 l0.25,-0.185 l0,0 l0.75,0.185 l0.25,-0.185 L2.006,-1 L-1.006,-1 z" />
        </clipPath>
        {/* vertical mirror of the same tooth, for the band's lower edge */}
        <clipPath id="hoc-chevron-up" clipPathUnits="objectBoundingBox">
          <path d="M-1.006,0.185 l0.75,-0.185 l0.25,0.185 l0,0 l0.75,-0.185 l0.25,0.185 l0,0 l0.75,-0.185 l0.25,0.185 L2.006,2 L-1.006,2 z" />
        </clipPath>
      </defs>
    </svg>
  )
}

const Icon = ({ name }) => {
  const d = {
    Instagram: 'M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.2A6.6 6.6 0 1 0 12 18.6 6.6 6.6 0 0 0 12 5.4zm0 10.9a4.3 4.3 0 1 1 0-8.6 4.3 4.3 0 0 1 0 8.6zm6.9-11.1a1.55 1.55 0 1 1-3.1 0 1.55 1.55 0 0 1 3.1 0z',
    Facebook: 'M13.4 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.2v3.2H10V21h3.4z',
    Youtube: 'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15.1V8.9l5.2 3.1-5.2 3.1z',
    Linkedin: 'M6.9 21H3.4V9.5h3.5V21zM5.1 8a2 2 0 1 1 0-4.1 2 2 0 0 1 0 4.1zM21 21h-3.5v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H10V9.5h3.3v1.6h.1a3.7 3.7 0 0 1 3.3-1.8c3.5 0 4.2 2.3 4.2 5.3V21z',
  }[name]
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={d} />
    </svg>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const [more, setMore] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <header className="hdr">
      <a className="hdr-logo" href="/" style={{ left: u(58), top: u(1) }}>
        <img src={brand.logo} alt={brand.name} />
      </a>

      <div className="hdr-right" style={{ top: u(58), right: u(58) }}>
        <nav className="hdr-nav" aria-label="Primary">
          {nav.map((n) => (
            <a key={n.label} href={n.href}>{n.label}</a>
          ))}
          {navMore.length > 0 && (
            <span
              className="hdr-folder"
              onMouseEnter={() => setMore(true)}
              onMouseLeave={() => setMore(false)}
            >
              <button type="button" aria-expanded={more}>More</button>
              <span className={`hdr-folder-menu${more ? ' is-open' : ''}`}>
                {navMore.map((n) => (
                  <a key={n.label} href={n.href}>{n.label}</a>
                ))}
              </span>
            </span>
          )}
        </nav>

        <div className="hdr-social">
          {social.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
              <Icon name={s.label} />
            </a>
          ))}
        </div>

        <a className="btn btn--gold hdr-cta" href={cta.href}>{cta.label}</a>
      </div>

      <button
        className={`hdr-burger${open ? ' is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <span /><span />
      </button>

      <div className={`hdr-overlay${open ? ' is-open' : ''}`}>
        {[...nav, ...navMore].map((n) => (
          <a key={n.label} href={n.href} onClick={() => setOpen(false)}>{n.label}</a>
        ))}
        <a className="btn btn--dark" href={cta.href}>{cta.label}</a>
        <div className="hdr-overlay-social">
          {social.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
              <Icon name={s.label} />
            </a>
          ))}
        </div>
      </div>
    </header>
  )
}

const Hero = () => (
  <section className="hero stage">
    <img src={hero.src} alt="" />
  </section>
)

const About = () => (
  <section className="stage" style={{ height: c(about.h) }}>
    {about.items.map((it, i) => (
      <Reveal key={it.src} delay={i * STAGGER} className={`abs${it.plain ? '' : ' frame'}`} style={box(it.x, it.y, it.w, it.h)}>
        <img src={it.src} alt={it.alt || ''} />
      </Reveal>
    ))}
    {about.copy.map((c, i) => (
      <Reveal as="p" key={i} delay={i * STAGGER} className="abs body" style={box(c.x, c.y, c.w)}>
        {c.text}
      </Reveal>
    ))}
  </section>
)

const Portfolio = () => (
  <section className="mosaic">
    {portfolio.tiles.map((t, i) => (
      <Reveal key={t.src} delay={(i % portfolio.cols) * STAGGER} className="frame frame--hover">
        <img src={t.src} alt={t.alt} loading="lazy" />
      </Reveal>
    ))}
  </section>
)

const Featured = () => (
  <section className="featured stage" style={{ height: c(featured.h) }}>
    <div className="chevron" aria-hidden="true" />
    {/* image and meta stay adjacent: desktop reads the measured coords, mobile
        drops to flow order and the pairs have to survive it */}
    {featured.cards.map((c, i) => (
      <Fragment key={c.title}>
        <Reveal delay={i * STAGGER} className="abs card" style={box(c.x, featured.imgY, featured.imgW, featured.imgH)}>
          <a className="frame frame--hover" href={c.href}>
            <img src={c.src} alt={c.title} loading="lazy" />
          </a>
        </Reveal>
        <Reveal delay={i * STAGGER} className="abs card-meta" style={box(c.x, featured.titleY, featured.textW)}>
          <a className="card-title" href={c.href}>{c.title}</a>
          <span className="card-date">{c.date}</span>
        </Reveal>
      </Fragment>
    ))}
    <Reveal className="abs" style={box(featured.button.x, featured.button.y, featured.button.w, featured.button.h)}>
      <a className="btn btn--gold btn--fill" href={featured.button.href}>{featured.button.label}</a>
    </Reveal>
  </section>
)

const Cinema = () => (
  <section className="cinema stage" style={{ height: c(cinema.h), marginTop: c(-(featured.h - cinema.overlap)) }}>
    <video
      className="cinema-bg"
      src={cinema.video}
      poster={cinema.poster}
      autoPlay
      muted
      loop
      playsInline
    />
    <div className="cinema-veil" />
    <Reveal as="h2" className="abs display display--light center" style={box(cinema.title.x, cinema.title.y, cinema.title.w)}>
      {cinema.title.text}
    </Reveal>
    <Reveal as="p" delay={STAGGER} className="abs body body--light center" style={box(cinema.copy.x, cinema.copy.y, cinema.copy.w)}>
      {cinema.copy.text}
    </Reveal>
  </section>
)

/* Films play in an overlay. The anchors keep their real YouTube href so
   middle-click and "open in new tab" still work — the click is what we take
   over. Inside the overlay there is a link out to the YouTube page. */
function VideoOverlay({ film, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label={film.title}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close video">&times;</button>
      <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <iframe
          src={`https://www.youtube.com/embed/${film.id}?autoplay=1&rel=0`}
          title={film.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          /* the host serves Referrer-Policy: no-referrer, and the YouTube player
             refuses to start without one (error 153) — override it per element */
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
        <div className="lightbox-bar">
          <span className="film-title">{film.title}</span>
          <a className="small" href={film.href} target="_blank" rel="noreferrer">Watch on YouTube ↗</a>
        </div>
      </div>
    </div>
  )
}

// returns [play(film), the overlay to render]
function useVideoOverlay() {
  const [film, setFilm] = useState(null)
  const open = (f) => (e) => {
    e.preventDefault()
    setFilm(f)
  }
  return [open, film && <VideoOverlay film={film} onClose={() => setFilm(null)} />]
}

const Films = () => {
  const [play, overlay] = useVideoOverlay()
  return (
    <section className="films stage" style={{ height: c(films.h) }}>
      {/* the cream of this section is what forms the band's lower edge */}
      <div className="chevron chevron--up" aria-hidden="true" />
      <Reveal as="h2" className="abs display center" style={box(films.heading.x, films.heading.y, films.heading.w)}>
        {films.heading.text}
      </Reveal>
      <Reveal as="p" delay={STAGGER} className="abs body center" style={box(films.note.x, films.note.y, films.note.w)}>
        {films.note.text}
      </Reveal>
      {films.items.map((f, i) => (
        <Fragment key={f.title}>
          <Reveal delay={(i % 2) * STAGGER} className="abs frame frame--hover play" style={box(f.x, f.y, f.w, films.posterH)}>
            <a href={f.href} onClick={play(f)}>
              <img src={f.poster} alt={f.title} loading="lazy" />
            </a>
          </Reveal>
          <Reveal delay={(i % 2) * STAGGER} className="abs" style={box(f.tx, f.ty, f.tw)}>
            <a className="film-title" href={f.href} onClick={play(f)}>{f.title}</a>
          </Reveal>
        </Fragment>
      ))}
      <Reveal className="abs" style={box(films.button.x, films.button.y, films.button.w, films.button.h)}>
        <a className="btn btn--gold btn--fill" href={films.button.href}>{films.button.label}</a>
      </Reveal>
      {overlay}
    </section>
  )
}

const Gallery = () => (
  <section className="stage" style={{ height: c(gallery.h) }}>
    {gallery.copy.map((c, i) => (
      <Reveal as="p" key={i} delay={i * STAGGER} className="abs body center" style={box(c.x, c.y, c.w)}>
        {c.text}
      </Reveal>
    ))}
    {gallery.cards.map((c, i) => (
      <Reveal key={c.src} delay={(i % 2) * STAGGER} className="abs frame frame--hover" style={box(c.x, c.y, c.w, c.h)}>
        <img src={c.src} alt="Selected wedding" loading="lazy" />
      </Reveal>
    ))}
  </section>
)

const Promo = () => (
  <section className="promo stage" style={{ height: c(promo.h) }}>
    <img className="promo-bg" src={promo.background} alt="" loading="lazy" />
    <div className="promo-veil" />
    <Reveal as="h2" className="abs display display--light" style={box(promo.title.x, promo.title.y, promo.title.w)}>
      {promo.title.text}
    </Reveal>
    <Reveal as="p" delay={STAGGER} className="abs body" style={box(promo.copy.x, promo.copy.y, promo.copy.w)}>
      {promo.copy.text}
    </Reveal>
    <Reveal className="abs" delay={STAGGER * 2} style={box(promo.button.x, promo.button.y, promo.button.w, promo.button.h)}>
      <a className="btn btn--gold btn--fill" href={promo.button.href}>
        {promo.button.label}
      </a>
    </Reveal>
  </section>
)

const Footer = () => (
  <footer className="stage" style={{ height: c(footer.h) }}>
    <div className="abs" style={box(footer.logo.x, footer.logo.y, footer.logo.w, footer.logo.h)}>
      <img src={brand.stackedLogo} alt={brand.name} loading="lazy" />
    </div>
    {footer.cols.map((c, i) => (
      <div key={i} className="abs body" style={box(c.x, c.y, c.w)}>
        {c.lines.map((l) =>
          typeof l === 'string'
            ? <p key={l}>{l}</p>
            : <p key={l.text}><a href={l.href}>{l.text}</a></p>
        )}
      </div>
    ))}
    <div className="abs foot-social" style={{ left: cx(footer.socialX), top: c(footer.socialY) }}>
      {social.map((s) => (
        <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
          <Icon name={s.label} />
        </a>
      ))}
    </div>
  </footer>
)

const PageHero = ({ src, title }) => (
  <section className="page-hero">
    <img src={src} alt="" />
    <h1 className="display display--light">{title}</h1>
  </section>
)

const AboutPage = () => (
  <>
    <PageHero src={aboutPage.hero} title={aboutPage.title} />
    <section className="doc">
      {aboutPage.intro.map((p, i) => (
        <Reveal as="p" key={i} delay={i * STAGGER} className="body doc-lead">{p}</Reveal>
      ))}
      <div className="doc-grid">
        {aboutPage.facts.map((f, i) => (
          <Reveal key={f.title} delay={i * STAGGER} className="doc-fact">
            <h2 className="doc-h">{f.title}</h2>
            {f.lines.map((l) => <p className="body" key={l}>{l}</p>)}
          </Reveal>
        ))}
      </div>
      <div className="doc-gallery">
        {aboutPage.gallery.map((src, i) => (
          <Reveal key={src} delay={i * STAGGER} className="frame frame--hover">
            <img src={src} alt="" loading="lazy" />
          </Reveal>
        ))}
      </div>
      <a className="btn btn--gold doc-cta" href={aboutPage.cta.href}>{aboutPage.cta.label}</a>
    </section>
  </>
)

const PREVIEW_COUNT = 10

function Collection({ col }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const photos = open ? col.photos : col.photos.slice(0, PREVIEW_COUNT)
  const hidden = col.photos.length - PREVIEW_COUNT

  const toggle = () => {
    // collapsing from the bottom of a long set would strand the reader
    if (open) ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setOpen(!open)
  }

  return (
    <div ref={ref} id={col.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="collection">
      <h2 className="doc-h">{col.title}</h2>
      <p className="small">{col.date} · {col.tag} · {col.photos.length} photos</p>
      <div className="masonry">
        {photos.map((src) => (
          <img key={src} className="masonry-item" src={src} alt={col.title} loading="lazy" />
        ))}
      </div>
      {hidden > 0 && (
        <button className="btn btn--gold collection-more" type="button" onClick={toggle} aria-expanded={open}>
          {open ? 'Show less' : `View all ${col.photos.length} photos`}
        </button>
      )}
    </div>
  )
}

const PhotographyPage = () => (
  <>
    <PageHero src={photographyPage.hero} title={photographyPage.title} />
    <section className="doc doc--wide">
      <p className="body doc-lead">{photographyPage.intro}</p>
      {photographyPage.collections.map((col) => (
        <Collection key={col.title} col={col} />
      ))}
    </section>
  </>
)

const FilmsPage = () => {
  const [play, overlay] = useVideoOverlay()
  return (
    <>
      <PageHero src={filmsPage.hero} title={filmsPage.title} />
      <section className="doc doc--wide">
        <p className="body doc-lead">{filmsPage.intro}</p>
        <div className="video-grid">
          {filmsPage.films.map((f) => (
            <a key={f.id} className="video-card" href={f.href} onClick={play(f)}>
              <span className="frame frame--hover play">
                <img src={f.poster} alt={f.title} loading="lazy" />
              </span>
              <span className="film-title">{f.title}</span>
            </a>
          ))}
        </div>
        <a className="btn btn--gold doc-cta" href={filmsPage.channel.href} target="_blank" rel="noreferrer">
          {filmsPage.channel.label}
        </a>
      </section>
      {overlay}
    </>
  )
}

const ContactPage = () => {
  // no backend here — hand the filled-in enquiry to the visitor's mail client
  const onSubmit = (e) => {
    e.preventDefault()
    const body = [...new FormData(e.currentTarget).entries()]
      .filter(([, v]) => String(v).trim())
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n')
    window.location.href =
      `mailto:${contactPage.mailto}?subject=${encodeURIComponent('Wedding enquiry')}&body=${encodeURIComponent(body)}`
  }

  return (
    <>
      <PageHero src={contactPage.hero} title={contactPage.title} />
      <section className="doc">
        {contactPage.intro.map((p, i) => (
          <p key={i} className="body doc-lead">{p}</p>
        ))}
        <div className="doc-grid">
          {contactPage.details.map((d) => (
            <div key={d.title} className="doc-fact">
              <h2 className="doc-h">{d.title}</h2>
              {d.lines.map((l) =>
                typeof l === 'string'
                  ? <p className="body" key={l}>{l}</p>
                  : <p className="body" key={l.text}><a href={l.href}>{l.text}</a></p>
              )}
            </div>
          ))}
        </div>

        <form className="form" onSubmit={onSubmit}>
          {contactPage.fields.map((f) => (
            <label key={f.name} className="form-row">
              <span className="small">{f.name}{f.required ? ' (required)' : ''}</span>
              {f.type === 'textarea'
                ? <textarea name={f.name} rows={5} required={f.required} />
                : <input name={f.name} type={f.type} required={f.required} />}
            </label>
          ))}
          <fieldset className="form-row">
            <legend className="small">What services are you looking for ?</legend>
            <div className="form-checks">
              {contactPage.services.map((s) => (
                <label key={s} className="body">
                  <input type="checkbox" name="Services" value={s} /> {s}
                </label>
              ))}
            </div>
          </fieldset>
          <button className="btn btn--gold" type="submit">{contactPage.submit}</button>
        </form>
      </section>
    </>
  )
}

const HomePage = () => (
  <>
    <Hero />
    <About />
    <Portfolio />
    <Featured />
    <Cinema />
    <Films />
    <Gallery />
    <Promo />
  </>
)

const ROUTES = {
  '/about': AboutPage,
  '/photography': PhotographyPage,
  '/films': FilmsPage,
  '/contact': ContactPage,
}

export default function App() {
  // every link is a full page load, so a pathname lookup beats a router
  const path = window.location.pathname.replace(/\/+$/, '')
  const Page = ROUTES[path] || HomePage
  return (
    <div className="page">
      <Dividers />
      <Header />
      <main><Page /></main>
      <Footer />
    </div>
  )
}
