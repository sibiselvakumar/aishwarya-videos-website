import { useState } from 'react';
import { useInView } from '../lib/hooks.js';
import { src, srcSet } from '../data/photos.js';

/**
 * The one image primitive the whole site uses.
 *
 * - Blur-up: the inline LQIP data URI paints instantly as a background, the real
 *   file fades over it on load. No extra request, no flash of empty box.
 * - `aspect-ratio` on the wrapper reserves the exact space, so CLS stays at 0.
 * - Deferred fetch: `src` is only attached once the frame is within 300px of the
 *   viewport (see useInView for why native lazy loading doesn't work here).
 *   The <img> stays mounted with its alt text throughout, so nothing is hidden
 *   from assistive tech; it's just transparent until the file decodes.
 */
export default function Frame({
  photo,
  sizes = '100vw',
  widths,
  priority = false,
  className = '',
  children,
}) {
  const [loaded, setLoaded] = useState(false);
  const [ref, inView] = useInView();
  const show = priority || inView;

  // If the browser served it from cache, onLoad can fire before React attaches.
  const onImgRef = (node) => {
    if (node?.complete && node.naturalWidth > 0) setLoaded(true);
  };

  return (
    <div
      ref={ref}
      className={`frame ${loaded ? 'is-loaded' : ''} ${className}`}
      style={{
        aspectRatio: photo.ratio,
        backgroundImage: `url(${photo.lqip})`,
      }}
    >
      <img
        ref={onImgRef}
        src={show ? src(photo.id, priority ? 1800 : 1200) : undefined}
        srcSet={show ? srcSet(photo.id, widths) : undefined}
        sizes={sizes}
        alt={photo.alt}
        width={Math.round(photo.ratio * 1000)}
        height={1000}
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        draggable="false"
      />
      {children}
    </div>
  );
}
