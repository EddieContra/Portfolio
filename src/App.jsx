import { useScrollReveal } from './hooks/useScrollReveal';

import Background     from './components/Background';
import ScrollProgress from './components/ScrollProgress';
import Nav            from './components/Nav';
import Hero           from './components/Hero';
import About          from './components/About';
import Experience     from './components/Experience';
import Projects       from './components/Projects';
import Skills         from './components/Skills';
import Currently      from './components/Currently';
import Gallery        from './components/Gallery';
import Testimonials   from './components/Testimonials';
import Contact        from './components/Contact';
import Footer         from './components/Footer';

export default function App() {
  useScrollReveal();

  return (
    <>
      <Background />
      <ScrollProgress />
      <Nav />

      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Currently />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
