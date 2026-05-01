import { useScrollReveal } from './hooks/useScrollReveal';

import Cursor         from './components/Cursor';
import ScrollProgress from './components/ScrollProgress';
import Nav            from './components/Nav';
import Marquee        from './components/Marquee';
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
import BackToTop      from './components/BackToTop';

const TOP_MARQUEE = [
  'Available for hire',
  'Based in Arusha, Tanzania',
  'Open to ML / AI internships',
  'Full Stack · Design · Education',
  "Let's build something",
];

const MID_MARQUEE = [
  'Selected work',
  'Tools I love',
  'Things I make',
  "What I'm learning",
  'Ideas in progress',
];

export default function App() {
  useScrollReveal();

  return (
    <>
      <Cursor />
      <ScrollProgress />
      <Nav />
      <Marquee items={TOP_MARQUEE} />

      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
      </main>

      <Marquee items={MID_MARQUEE} speed={42} />

      <main>
        <Currently />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
    </>
  );
}
