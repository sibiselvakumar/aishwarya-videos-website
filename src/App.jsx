import { useCallback, useEffect, useState } from 'react';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Marquee from './components/Marquee.jsx';
import Featured from './components/Featured.jsx';
import Films from './components/Films.jsx';
import Gallery from './components/Gallery.jsx';
import About from './components/About.jsx';
import AboutPage from './components/AboutPage.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import Lightbox from './components/Lightbox.jsx';
import Cursor from './components/Cursor.jsx';
import Progress from './components/Progress.jsx';
import { useHashRoute, useScrollLock } from './lib/hooks.js';

export default function App() {
  const [active, setActive] = useState(null);
  const route = useHashRoute();
  useScrollLock(!!active);

  const open = useCallback((photo) => setActive(photo), []);
  const close = useCallback(() => setActive(null), []);

  // A route change should land at the top, the way a real page load would.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  const isAbout = route === '/about';

  return (
    <>
      <a className="skip" href={isAbout ? '#main' : '#work'}>
        Skip to content
      </a>
      <Progress />
      <Cursor />
      <Nav route={route} />

      {isAbout ? (
        <AboutPage />
      ) : (
        <main>
          <Hero />
          <Marquee />
          <Featured onOpen={open} />
          <Films />
          <Gallery onOpen={open} />
          <About />
          <Contact />
        </main>
      )}

      <Footer route={route} />
      <Lightbox photo={active} onClose={close} onSelect={setActive} />
    </>
  );
}
