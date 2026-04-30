import { useScrollReveal } from './hooks/useScrollReveal';

import Cursor         from './components/Cursor';
import ScrollProgress from './components/ScrollProgress';
import Nav            from './components/Nav';
import Hero           from './components/Hero';
import About          from './components/About';
import Skills         from './components/Skills';
import Projects       from './components/Projects';
import Experience     from './components/Experience';
import Gallery        from './components/Gallery';
import Testimonials   from './components/Testimonials';
import Currently      from './components/Currently';
import Contact        from './components/Contact';
import Footer         from './components/Footer';

export default function App() {
  useScrollReveal();

  return (
    <>
      <Cursor />
      <ScrollProgress />
      <Nav />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Gallery />
        <Testimonials />
        <Currently />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
