import Frame from './Frame.jsx';
import { byTitle } from '../data/photos.js';
import { ABOUT, SERVICES, STATS, STUDIO } from '../data/studio.js';
import { useParallax, useReveal } from '../lib/hooks.js';

const LEAD = byTitle('After the Vows');
const SIDE = byTitle('Manjal');
const TAIL = byTitle('Flower Sellers');

export default function AboutPage() {
  const head = useReveal();
  const body = useReveal();
  const media = useReveal({ threshold: 0.2 });
  const stats = useReveal();
  const works = useReveal();
  const award = useReveal();
  const visit = useReveal();
  const parallax = useParallax(-40);

  // There's no #contact on this page — go home first, then scroll once it renders.
  const toContact = (e) => {
    e.preventDefault();
    window.location.hash = '';
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
      )
    );
  };

  return (
    <main className="page" id="main">
      <header className="page__head">
        <div className="reveal" ref={head}>
          <p className="eyebrow">
            <span className="dot" aria-hidden="true" /> About Us
          </p>
          <h1 className="page__title">
            Stories of Love, Laughter
            <em> and happily ever after</em>
          </h1>
        </div>

        <div className="page__hero reveal" ref={media}>
          <Frame photo={LEAD} priority sizes="100vw" widths={[800, 1400, 2000]} />
        </div>
      </header>

      <section className="page__intro reveal" ref={body}>
        <p className="page__lead">{ABOUT.lead}</p>
        <p className="page__body">{ABOUT.experience}</p>
      </section>

      <ul className="page__stats reveal" ref={stats}>
        {STATS.map((s, i) => (
          <li key={s.l} style={{ '--i': i }}>
            <span className="stats__n">{s.n}</span>
            <span className="stats__l">{s.l}</span>
          </li>
        ))}
      </ul>

      <section className="page__works">
        <div className="page__works-media" ref={parallax}>
          <Frame photo={SIDE} sizes="(max-width: 900px) 90vw, 42vw" widths={[600, 1000, 1400]} />
        </div>

        <div className="page__works-text reveal" ref={works}>
          <p className="eyebrow">
            <span className="dot" aria-hidden="true" /> Our Works
          </p>
          <h2 className="section__title">
            Cultures and <em>traditions</em>
          </h2>
          <ul className="services">
            {SERVICES.map((s, i) => (
              <li key={s.t} style={{ '--i': i }}>
                <h3>{s.t}</h3>
                {s.ta && <p className="services__ta">{s.ta}</p>}
                <p>{s.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="award reveal" ref={award}>
        <p className="eyebrow">
          <span className="dot" aria-hidden="true" /> Our Awards
        </p>
        <p className="award__name">{ABOUT.award}</p>
      </section>

      <section className="page__visit reveal" ref={visit}>
        <div>
          <h2 className="section__title">
            Come and <em>say hello</em>
          </h2>
          <address className="page__address">
            {STUDIO.address.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <p className="page__contact">
            <a href={STUDIO.phoneHref}>{STUDIO.phone}</a>
            <a href={`mailto:${STUDIO.email}`}>{STUDIO.email}</a>
          </p>
          <p className="page__note">{STUDIO.replyWindow}</p>
          <a className="btn" href="#contact" onClick={toContact}>
            <span>Start an enquiry</span>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M2 8h12M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </a>
        </div>

        <div className="page__visit-media">
          <Frame photo={TAIL} sizes="(max-width: 900px) 90vw, 44vw" widths={[600, 1000, 1400]} />
        </div>
      </section>
    </main>
  );
}
