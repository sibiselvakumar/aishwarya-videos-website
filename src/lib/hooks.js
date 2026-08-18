import { useCallback, useEffect, useRef, useState } from 'react';

/** True when the user has asked the OS to reduce motion. Every animation respects this. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/**
 * Scroll reveal. Adds `is-in` to the element once it enters the viewport, then
 * unobserves it — reveals never replay, so there's no scroll-linked work after
 * the first pass. IntersectionObserver keeps this off the main thread.
 */
export function useReveal({ threshold = 0.15, rootMargin = '0px 0px -10% 0px' } = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-in');
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in');
          io.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);
  return ref;
}

/**
 * Latches true the first time the element comes near the viewport, then stops
 * observing.
 *
 * Why this exists instead of relying on `loading="lazy"`: React inserts every
 * gallery node in one commit, before layout has assigned any of them a Y
 * position. Chrome decides lazy eligibility at insertion time, sees everything
 * at y≈0, and fetches all 38 images at once. Measured: 43/43 loaded with the
 * deep tile 9093px below the fold. Gating `src` ourselves is the only thing
 * that actually defers the fetch in a client-rendered gallery.
 */
export function useInView(rootMargin = '300px 0px') {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, inView]);

  return [ref, inView];
}

/**
 * Parallax driven by a CSS custom property. rAF-throttled and transform-only,
 * so it composites on the GPU and stays at 60fps.
 *
 * `strength` is the maximum travel in PIXELS at the edges of the viewport.
 * Negative values move the element against the scroll direction.
 */
export function useParallax(strength = 40) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let frame = 0;
    let visible = false;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      // -1 (below viewport) .. 1 (above viewport), clamped so an element taller
      // than the viewport can't push the offset past `strength`.
      const raw = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      const progress = Math.max(-1, Math.min(1, raw));
      el.style.setProperty('--parallax', `${(progress * strength).toFixed(2)}px`);
    };

    const onScroll = () => {
      if (!visible || frame) return;
      frame = requestAnimationFrame(update);
    };

    // Only listen while the element is actually on screen.
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) update();
    });
    io.observe(el);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [strength, reduced]);

  return ref;
}

/** Locks body scroll without the layout jump from a disappearing scrollbar. */
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;
    const { body } = document;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const prev = { overflow: body.style.overflow, pad: body.style.paddingRight };
    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = prev.overflow;
      body.style.paddingRight = prev.pad;
    };
  }, [locked]);
}

/** Current scroll offset in px, rAF-throttled. Used for nav state + progress bar. */
export function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setY(window.scrollY);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return y;
}

/** Tracks which section is currently in view, for the nav's active state. */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top) setActive(top.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/**
 * Minimal hash router. Only hashes that start with `#/` count as routes, so the
 * existing in-page anchors (`#work`, `#gallery`) keep scrolling instead of
 * navigating. Returns '/' or '/about'. Twelve lines beats a router dependency
 * for two views.
 */
export function readRoute() {
  const h = window.location.hash;
  return h.startsWith('#/') ? h.slice(1) : '/';
}

export function useHashRoute() {
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const on = () => setRoute(readRoute());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

/** Smooth scroll to a section, honouring reduced-motion. */
export function useScrollTo() {
  const reduced = useReducedMotion();
  return useCallback(
    (id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    },
    [reduced]
  );
}

/**
 * Theme toggle. The attribute is already on <html> from the inline script in
 * index.html (which runs before paint, so there is no flash) — this only keeps
 * React in sync with it and writes the choice back.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))];
}
