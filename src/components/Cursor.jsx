import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../lib/hooks.js';

/**
 * Trailing cursor. Desktop pointers only, and never for reduced-motion users —
 * the real cursor is left visible in both cases, so nothing is lost.
 * Position lives in a ref and is written in one rAF loop; React never re-renders.
 */
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const d = dot.current;
    const r = ring.current;
    if (!d || !r) return;

    document.body.classList.add('has-cursor');

    const target = { x: innerWidth / 2, y: innerHeight / 2 };
    const eased = { ...target };
    let frame;

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const hit = e.target.closest?.('[data-cursor], a, button');
      r.dataset.state = hit?.dataset?.cursor || (hit ? 'link' : '');
    };

    const loop = () => {
      eased.x += (target.x - eased.x) * 0.16;
      eased.y += (target.y - eased.y) * 0.16;
      d.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      r.style.transform = `translate3d(${eased.x}px, ${eased.y}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(loop);
    };
    loop();

    const onLeave = () => { d.style.opacity = r.style.opacity = '0'; };
    const onEnter = () => { d.style.opacity = r.style.opacity = ''; };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerenter', onEnter);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerenter', onEnter);
      document.body.classList.remove('has-cursor');
    };
  }, [reduced]);

  return (
    <div className="cursor" aria-hidden="true">
      <span className="cursor__dot" ref={dot} />
      <span className="cursor__ring" ref={ring}>
        <span className="cursor__label">View</span>
      </span>
    </div>
  );
}
