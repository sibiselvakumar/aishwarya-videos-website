import Frame from './Frame.jsx';
import { byTitle } from '../data/photos.js';
import { useParallax, useReveal } from '../lib/hooks.js';

// Four across, matching the reference site's featured-weddings row.
const SELECTED = ['Muhurtham', 'Malli Poo', 'Virundhu', 'Kanchipuram Red'].map(byTitle);

function Row({ photo, index, onOpen }) {
  const reveal = useReveal({ threshold: 0.2 });
  // Gentle alternating drift so the row staggers slightly as it scrolls. Small
  // on purpose: ±55px was tuned for full-width rows and looks broken in a grid.
  const parallax = useParallax(index % 2 ? -16 : 16);
  const n = String(index + 1).padStart(2, '0');

  return (
    <article ref={reveal} className={`feat ${index % 2 ? 'feat--flip' : ''} reveal`}>
      <div className="feat__media" ref={parallax}>
        <button className="feat__open" onClick={() => onOpen(photo)} data-cursor="view">
          <Frame
            photo={photo}
            sizes="(max-width: 620px) 92vw, (max-width: 1000px) 46vw, 24vw"
            widths={[400, 700, 1100]}
          />
        </button>
      </div>

      <div className="feat__text">
        <span className="feat__num">{n}</span>
        <h3 className="feat__title">{photo.title}</h3>
        <p className="feat__place">
          {photo.place} <span aria-hidden="true">·</span> {photo.year}
        </p>
        <p className="feat__desc">{photo.alt}.</p>
        <button className="link" onClick={() => onOpen(photo)}>
          Open frame
        </button>
      </div>
    </article>
  );
}

export default function Featured({ onOpen }) {
  const head = useReveal();

  return (
    <section className="section featured" id="work">
      <header className="section__head reveal" ref={head}>
        <p className="eyebrow">
          <span className="dot" aria-hidden="true" /> Selected
        </p>
        <h2 className="section__title">
          Four frames from
          <em> the last season</em>
        </h2>
      </header>

      <div className="featured__rows">
        {SELECTED.map((photo, i) => (
          <Row key={photo.id} photo={photo} index={i} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}
