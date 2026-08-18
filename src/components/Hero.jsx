import { byTitle, srcCrop } from '../data/photos.js';
import { useScrollTo, useScrollY } from '../lib/hooks.js';

const HERO = byTitle('Before the Muhurtham');

/** Each line sits in an overflow-hidden mask and slides up — the standard
 *  editorial reveal, done with two elements and a CSS delay instead of a library. */
function MaskLine({ children, delay = 0, italic = false }) {
  return (
    <span className="mask">
      <span className="mask__inner" style={{ '--d': `${delay}ms` }}>
        {italic ? <em>{children}</em> : children}
      </span>
    </span>
  );
}

export default function Hero() {
  const scrollTo = useScrollTo();
  const y = useScrollY();

  // Hero drifts up at half scroll speed and dims as it leaves — cheap depth,
  // transform + opacity only.
  const vh = typeof window !== 'undefined' ? window.innerHeight : 1000;
  const p = Math.min(y / vh, 1);

  return (
    <section className="hero" id="hero">
      <div
        className="hero__media"
        style={{ transform: `translate3d(0, ${p * 18}%, 0)`, opacity: 1 - p * 0.55 }}
      >
        <img
          src={srcCrop(HERO.id, 2400, '16:9')}
          srcSet={[800, 1400, 2000, 2600]
            .map((w) => `${srcCrop(HERO.id, w, '16:9')} ${w}w`)
            .join(', ')}
          sizes="100vw"
          alt={HERO.alt}
          fetchpriority="high"
          decoding="async"
          draggable="false"
        />
        <div className="hero__scrim" />
      </div>

      <div className="hero__body">
        <p className="eyebrow">
          <MaskLine delay={100}>25+ Years — Coimbatore, Tamil Nadu</MaskLine>
        </p>

        <h1 className="hero__title">
          <MaskLine delay={220}>Where tradition meets</MaskLine>
          <MaskLine delay={330} italic>
            a modern lens
          </MaskLine>
        </h1>

        <div className="hero__meta">
          <p className="hero__lede">
            <MaskLine delay={520}>From the mehendi to the muhurtham to the last</MaskLine>
            <MaskLine delay={580}>send-off. Candid, unhurried, timeless.</MaskLine>
          </p>
          <button className="btn" onClick={() => scrollTo('work')}>
            <span>View Selected Work</span>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M2 8h12M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>
      </div>

      <div className="hero__rail" aria-hidden="true">
        <span className="hero__scroll">Scroll</span>
        <span className="hero__line" />
      </div>
    </section>
  );
}
