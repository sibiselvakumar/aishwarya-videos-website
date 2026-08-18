import { useMemo, useState } from 'react';
import Frame from './Frame.jsx';
import { CATEGORIES, PHOTOS } from '../data/photos.js';
import { useReveal } from '../lib/hooks.js';

/** Frames on screen before "see more" — three full rows of the 5-across grid. */
const INITIAL = 15;

function Tile({ photo, index, onOpen }) {
  // Stagger caps at 8 so a long column never waits a full second to appear.
  const ref = useReveal({ threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

  return (
    <li
      ref={ref}
      className="tile reveal"
      style={{ '--i': Math.min(index, 8) }}
    >
      <button className="tile__btn" onClick={() => onOpen(photo)} data-cursor="view">
        <Frame
          photo={photo}
          className="tile__frame"
          sizes="(max-width: 620px) 50vw, (max-width: 1100px) 33vw, 20vw"
          widths={[300, 500, 800]}
        />
        <span className="tile__cap">
          <span className="tile__name">{photo.title}</span>
          <span className="tile__place">{photo.place}</span>
        </span>
      </button>
    </li>
  );
}

export default function Gallery({ onOpen }) {
  const [cat, setCat] = useState('all');
  const [expanded, setExpanded] = useState(false);
  const head = useReveal();

  const matching = useMemo(
    () => (cat === 'all' ? PHOTOS : PHOTOS.filter((p) => p.cat === cat)),
    [cat]
  );

  const shown = expanded ? matching : matching.slice(0, INITIAL);
  const hidden = matching.length - shown.length;

  const pick = (id) => {
    setCat(id);
    // A new category starts collapsed again, otherwise switching filters while
    // expanded dumps the whole category on screen with no way back.
    setExpanded(false);
  };

  const collapseOrExpand = () => {
    setExpanded((was) => !was);
    // Collapsing from the bottom of 38 tiles would leave the viewport parked in
    // whatever section follows, so send it back to the top of the gallery.
    if (expanded) document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

  const counts = useMemo(() => {
    const c = { all: PHOTOS.length };
    for (const p of PHOTOS) c[p.cat] = (c[p.cat] || 0) + 1;
    return c;
  }, []);

  return (
    <section className="section gallery" id="gallery">
      <header className="section__head gallery__head reveal" ref={head}>
        <div>
          <p className="eyebrow">
            <span className="dot" aria-hidden="true" /> Archive
          </p>
          <h2 className="section__title">
            The full <em>index</em>
          </h2>
        </div>

        <div className="filters" role="tablist" aria-label="Filter by category">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={cat === c.id}
              className={`filter ${cat === c.id ? 'is-active' : ''}`}
              onClick={() => pick(c.id)}
            >
              {c.label}
              <sup>{counts[c.id] ?? 0}</sup>
            </button>
          ))}
        </div>
      </header>

      {/* key on the category restarts the reveal stagger when the filter changes */}
      <ul className="grid" key={cat}>
        {shown.map((photo, i) => (
          <Tile
            key={photo.id}
            photo={photo}
            // Newly revealed frames stagger from 0 again rather than continuing
            // the count, so "see more" doesn't wait on a long delay chain.
            index={expanded ? i - INITIAL : i}
            onOpen={onOpen}
          />
        ))}
      </ul>

      <div className="gallery__foot">
        <p className="gallery__count" aria-live="polite">
          Showing {shown.length} of {matching.length}
        </p>
        {(hidden > 0 || expanded) && (
          <button className="btn" onClick={collapseOrExpand}>
            <span>{expanded ? `Show first ${INITIAL}` : `See all ${matching.length} frames`}</span>
            <svg viewBox="0 0 16 16" aria-hidden="true" className={expanded ? 'is-flipped' : ''}>
              <path d="M8 2v12M3 9l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}
