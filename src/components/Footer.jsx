import { CHANNEL_URL } from '../data/films.js';
import { STUDIO } from '../data/studio.js';
import { useScrollTo } from '../lib/hooks.js';

const LINKS = [
  { id: 'work', label: 'Work' },
  { id: 'films', label: 'Films' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'about', label: 'About', page: '/about' },
  { id: 'contact', label: 'Contact' },
];

const SOCIAL = [
  { label: 'YouTube', href: CHANNEL_URL },
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'Facebook', href: 'https://www.facebook.com/' },
];

export default function Footer({ route = '/' }) {
  const scrollTo = useScrollTo();
  const year = new Date().getFullYear();
  const onPage = route !== '/';

  const go = (link) => {
    if (link.page) {
      window.location.hash = link.page;
      return;
    }
    if (onPage) {
      window.location.hash = '';
      requestAnimationFrame(() => requestAnimationFrame(() => scrollTo(link.id)));
      return;
    }
    scrollTo(link.id);
  };

  return (
    <footer className="footer">
      <div className="footer__top">
        <div>
          <p className="footer__mark">Aishwarya</p>
          <p className="footer__tag">{STUDIO.tagline}</p>
        </div>

        <nav className="footer__links" aria-label="Footer">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={l.page ? `#${l.page}` : `#${l.id}`}
              onClick={(e) => {
                e.preventDefault();
                go(l);
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="footer__social">
          {SOCIAL.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer noopener">
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <div className="footer__bottom">
        <span>© {year} {STUDIO.name}, Coimbatore</span>
        <span>
          <a href={STUDIO.phoneHref}>{STUDIO.phone}</a> · <a href={`mailto:${STUDIO.email}`}>{STUDIO.email}</a>
        </span>
        <button
          className="footer__top-btn"
          onClick={() => (onPage ? window.scrollTo({ top: 0, behavior: 'smooth' }) : scrollTo('hero'))}
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
