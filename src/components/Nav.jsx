import { useEffect, useState } from 'react';
import { useActiveSection, useScrollLock, useScrollTo, useScrollY, useTheme } from '../lib/hooks.js';

// `page: true` navigates to its own route; the rest scroll within the one-pager.
const LINKS = [
  { id: 'work', label: 'Work' },
  { id: 'films', label: 'Films' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'about', label: 'About', page: '/about' },
  { id: 'contact', label: 'Contact' },
];

const SECTIONS = ['hero', 'work', 'films', 'gallery', 'about', 'contact'];

export default function Nav({ route = '/' }) {
  const [open, setOpen] = useState(false);
  const y = useScrollY();
  const activeSection = useActiveSection(SECTIONS);
  const scrollTo = useScrollTo();
  const [theme, toggleTheme] = useTheme();
  useScrollLock(open);

  const onPage = route !== '/';

  // Esc closes the mobile sheet.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (link) => {
    setOpen(false);

    if (link.page) {
      window.location.hash = link.page;
      return;
    }

    // Coming from a sub-page, go home first, then scroll once it has rendered.
    if (onPage) {
      window.location.hash = '';
      requestAnimationFrame(() => requestAnimationFrame(() => scrollTo(link.id)));
      return;
    }
    requestAnimationFrame(() => scrollTo(link.id));
  };

  const goHome = () => {
    setOpen(false);
    if (onPage) window.location.hash = '';
    else scrollTo('hero');
  };

  const isActive = (link) =>
    link.page ? route === link.page : !onPage && activeSection === link.id;

  return (
    <>
      <header className={`nav ${y > 40 || onPage ? 'is-stuck' : ''} ${open ? 'is-open' : ''}`}>
        <a
          className="nav__mark"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            goHome();
          }}
        >
          <span className="nav__mark-name">Aishwarya</span>
          <span className="nav__mark-sub">Videos &amp; Photos</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={l.page ? `#${l.page}` : `#${l.id}`}
              className={`nav__link ${isActive(l) ? 'is-active' : ''}`}
              aria-current={isActive(l) ? 'true' : undefined}
              onClick={(e) => {
                e.preventDefault();
                go(l);
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          className="nav__cta"
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            go({ id: 'contact' });
          }}
        >
          Enquire
        </a>

        <button
          className="nav__theme"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="12" cy="12" r="4.2" />
              <path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M20 14.2A8.2 8.2 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2Z" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <button
          className="nav__burger"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span /><span />
        </button>
      </header>

      <div id="mobile-menu" className={`sheet ${open ? 'is-open' : ''}`} hidden={!open}>
        <nav aria-label="Mobile">
          {LINKS.map((l, i) => (
            <a
              key={l.id}
              href={l.page ? `#${l.page}` : `#${l.id}`}
              style={{ '--i': i }}
              onClick={(e) => {
                e.preventDefault();
                go(l);
              }}
            >
              <em>{String(i + 1).padStart(2, '0')}</em>
              {l.label}
            </a>
          ))}
        </nav>
        <p className="sheet__foot">info@aishwaryavideos.com</p>
      </div>
    </>
  );
}
