import { useCallback, useEffect, useRef } from 'react';
import { PHOTOS, src, srcSet } from '../data/photos.js';

/**
 * Native <dialog> + showModal() gives focus trapping, Esc-to-close, inert
 * background and top-layer stacking for free. No focus-trap library, no portal.
 */
export default function Lightbox({ photo, onClose, onSelect }) {
  const ref = useRef(null);
  const index = photo ? PHOTOS.findIndex((p) => p.id === photo.id) : -1;

  const step = useCallback(
    (dir) => {
      if (index < 0) return;
      onSelect(PHOTOS[(index + dir + PHOTOS.length) % PHOTOS.length]);
    },
    [index, onSelect]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (photo && !el.open) el.showModal();
    if (!photo && el.open) el.close();
  }, [photo]);

  useEffect(() => {
    if (!photo) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [photo, step]);

  // Warm the neighbours so arrowing through feels instant.
  useEffect(() => {
    if (index < 0) return;
    for (const d of [1, -1]) {
      const n = PHOTOS[(index + d + PHOTOS.length) % PHOTOS.length];
      const img = new Image();
      img.src = src(n.id, 1400);
    }
  }, [index]);

  return (
    <dialog
      ref={ref}
      className="lb"
      onClose={onClose}
      onClick={(e) => {
        // Backdrop clicks land on the dialog itself, not its children.
        if (e.target === ref.current) onClose();
      }}
      aria-label={photo ? `${photo.title}, ${photo.place}` : 'Image viewer'}
    >
      {photo && (
        <div className="lb__inner">
          <button className="lb__close" onClick={onClose} aria-label="Close viewer">
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.3" fill="none" />
            </svg>
          </button>

          <button className="lb__nav lb__nav--prev" onClick={() => step(-1)} aria-label="Previous frame">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </button>

          <figure className="lb__figure" key={photo.id}>
            <img
              src={src(photo.id, 1600)}
              srcSet={srcSet(photo.id, [800, 1400, 2000])}
              sizes="(max-width: 900px) 94vw, 78vw"
              alt={photo.alt}
              decoding="async"
              draggable="false"
              style={{ aspectRatio: photo.ratio, background: `url(${photo.lqip}) center/cover` }}
            />
            <figcaption className="lb__cap">
              <span className="lb__title">{photo.title}</span>
              <span className="lb__meta">
                {photo.place} <span aria-hidden="true">·</span> {photo.year} <span aria-hidden="true">·</span>{' '}
                {String(index + 1).padStart(2, '0')} / {PHOTOS.length}
              </span>
            </figcaption>
          </figure>

          <button className="lb__nav lb__nav--next" onClick={() => step(1)} aria-label="Next frame">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </button>
        </div>
      )}
    </dialog>
  );
}
