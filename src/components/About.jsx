import Frame from './Frame.jsx';
import { byTitle } from '../data/photos.js';
import { ABOUT, SERVICES, STATS } from '../data/studio.js';
import { useParallax, useReveal } from '../lib/hooks.js';

const PORTRAIT = byTitle('Kanchipuram Red');

export default function About() {
  const head = useReveal();
  const media = useReveal({ threshold: 0.25 });
  const parallax = useParallax(-45);
  const stats = useReveal();
  const list = useReveal();

  return (
    <section className="section about" id="about">
      <div className="about__grid">
        <div className="about__media reveal" ref={media}>
          <div ref={parallax} className="about__media-inner">
            <Frame photo={PORTRAIT} sizes="(max-width: 900px) 88vw, 40vw" widths={[500, 900, 1300]} />
          </div>
          <span className="about__caption">Portrait sitting — Coimbatore</span>
        </div>

        <div className="about__text">
          <header className="reveal" ref={head}>
            <p className="eyebrow">
              <span className="dot" aria-hidden="true" /> The Studio
            </p>
            <h2 className="section__title">
              Stories of love, laughter <em>and happily ever after</em>
            </h2>
            <p className="about__body">{ABOUT.lead}</p>
            <p className="about__body">{ABOUT.experience}</p>
            <p className="about__more">
              <a className="link" href="#/about">
                Read more about the studio
              </a>
            </p>
          </header>

          <ul className="stats reveal" ref={stats}>
            {STATS.map((s, i) => (
              <li key={s.l} style={{ '--i': i }}>
                <span className="stats__n">{s.n}</span>
                <span className="stats__l">{s.l}</span>
              </li>
            ))}
          </ul>

          <ul className="services reveal" ref={list}>
            {SERVICES.map((s, i) => (
              <li key={s.t} style={{ '--i': i }}>
                <h3>{s.t}</h3>
                {s.ta && <p className="services__ta">{s.ta}</p>}
                <p>{s.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
