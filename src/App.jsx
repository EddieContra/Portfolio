import { useEffect } from 'react';
import { useScrollReveal } from './hooks/useScrollReveal';
import { initSmoothScroll, ScrollTrigger } from './lib/motion';

import ScrollProgress from './components/ScrollProgress';
import Nav            from './components/Nav';
import Hero           from './components/Hero';
import About          from './components/About';
import Experience     from './components/Experience';
import Projects       from './components/Projects';
import Skills         from './components/Skills';
import Gallery        from './components/Gallery';
import Testimonials   from './components/Testimonials';
import Contact        from './components/Contact';
import Footer         from './components/Footer';

export default function App() {
  useScrollReveal();

  useEffect(() => {
    const destroy = initSmoothScroll();
    // Recalculate pin/scrub positions once fonts & images have settled.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);
    return () => {
      window.removeEventListener('load', refresh);
      destroy();
    };
  }, []);

  return (
    <>
      <ScrollProgress />
      <Nav />

      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
