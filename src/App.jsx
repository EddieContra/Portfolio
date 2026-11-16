import { useScrollReveal } from './hooks/useScrollReveal';

import Nav          from './components/Nav';
import Hero         from './components/Hero';
import About        from './components/About';
import Currently    from './components/Currently';
import Experience   from './components/Experience';
import Projects     from './components/Projects';
import Skills       from './components/Skills';
import Gallery      from './components/Gallery';
import Testimonials from './components/Testimonials';
import Contact      from './components/Contact';
import Footer       from './components/Footer';

export default function App() {
  useScrollReveal();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:font-semibold focus:text-accent-on"
      >
        Skip to content
      </a>
      <Nav />

      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Currently />
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
