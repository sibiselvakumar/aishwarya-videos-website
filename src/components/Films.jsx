import { useState } from 'react';
import { CHANNEL_URL, FILMS, embed, thumb, watch } from '../data/films.js';
import { useInView, useReveal } from '../lib/hooks.js';

/**
 * Lite YouTube embed: the poster is just an <img>, and the ~1MB player iframe is
 * only injected once someone presses play. Six eager iframes would cost more
 * than the entire rest of the page, so this is the whole reason not to drop
 * <iframe> straight into the markup.
 */
function Film({ film, featured = false }) {
  const [playing, setPlaying] = useState(false);
  const [ref, inView] = useInView();
  const label = `${film.kind} — ${film.title}, ${film.place} ${film.year}`;

  return (
    <article ref={ref} className={`film ${featured ? 'film--lead' : ''}`}>
      <div className="film__stage">
        {playing ? (
          <iframe
            className="film__player"
            src={embed(film.id)}
            title={label}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button className="film__play" onClick={() => setPlaying(true)} aria-label={`Play ${label}`}>
            {inView && (
              <img
                src={thumb(film.id)}
                alt=""
                loading="lazy"
                decoding="async"
                width="1280"
                height="720"
                draggable="false"
              />
            )}
            <span className="film__scrim" />
            <span className="film__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
              </svg>
            </span>
          </button>
        )}
      </div>

      <div className="film__meta">
        <h3 className="film__title">{film.title}</h3>
        <p className="film__sub">
          {film.kind} <span aria-hidden="true">·</span> {film.place} <span aria-hidden="true">·</span>{' '}
          {film.year}
        </p>
        <a className="film__yt" href={watch(film.id)} target="_blank" rel="noreferrer noopener">
          Watch on YouTube ↗
        </a>
      </div>
    </article>
  );
}

export default function Films() {
  const head = useReveal();
  const grid = useReveal({ threshold: 0.05 });
  const [lead, ...rest] = FILMS;

  return (
    <section className="section films" id="films">
      <header className="section__head films__head reveal" ref={head}>
        <div>
          <p className="eyebrow">
            <span className="dot" aria-hidden="true" /> Films
          </p>
          <h2 className="section__title">
            The day, <em>in motion</em>
          </h2>
        </div>
        <a className="btn" href={CHANNEL_URL} target="_blank" rel="noreferrer noopener">
          <span>Our YouTube channel</span>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2 8h12M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </a>
      </header>

      <Film film={lead} featured />

      <div className="films__grid reveal" ref={grid}>
        {rest.map((f, i) => (
          <div key={f.id} style={{ '--i': Math.min(i, 6) }}>
            <Film film={f} />
          </div>
        ))}
      </div>
    </section>
  );
}
