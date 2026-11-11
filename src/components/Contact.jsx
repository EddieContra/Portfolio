import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, MQ } from '../lib/motion';
import Icon from './Icon';
import { SOCIALS, EMAIL } from '../data/socials';

const CONTACTS = [
  { icon: 'mail',          label: 'Email',    value: EMAIL,              href: `mailto:${EMAIL}` },
  { icon: 'smartphone',    label: 'Phone',    value: '+255 742 165 407', href: 'tel:+255742165407' },
  { icon: 'messageCircle', label: 'WhatsApp', value: '+255 745 225 985', href: 'https://wa.me/255745225985' },
  { icon: 'mapPin',        label: 'Location', value: 'Arusha, Tanzania' },
];

export default function Contact() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  // Finale: the headline scales up and sharpens as it scrolls into place.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.fromTo(
        titleRef.current,
        { scale: 0.72, opacity: 0.15, filter: 'blur(12px)' },
        {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 90%', end: 'top 25%', scrub: 0.6 },
        }
      );
    });
    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section id="contact" ref={sectionRef} className="relative py-32 sm:py-48 overflow-hidden">
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(60%_60%_at_50%_100%,rgb(var(--c-accent)/.22),transparent_70%)]" />

      <div className="wrap relative text-center">
        <span className="sec-label rv">Get in touch</span>
        <h2
          ref={titleRef}
          className="font-disp font-bold tracking-[-0.05em] leading-[.95] text-[clamp(3.2rem,11vw,8.5rem)] text-gradient will-change-transform"
        >
          Let's build
          <br />
          something.
        </h2>

        <p className="lede max-w-xl mx-auto mt-8 rv">
          Have a project in mind, want to collaborate, or just want to say hi?
          The fastest way to reach me is email or WhatsApp.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-4 mt-10 rv rv-d1">
          <a href={`mailto:${EMAIL}`} className="btn-fill text-base px-8 py-3.5">Say hello</a>
          <a href="https://wa.me/255745225985" target="_blank" rel="noopener noreferrer" className="btn-link">
            Message on WhatsApp ›
          </a>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
          {CONTACTS.map((c, i) => <ContactRow key={c.label} index={i} {...c} />)}
        </div>

        <div className="flex flex-wrap justify-center gap-2.5 mt-12 rv">
          {SOCIALS.map((s) => (
            <a
              key={s.title}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              title={s.title}
              aria-label={s.title}
              className="w-11 h-11 grid place-items-center rounded-full bg-bg3/80 text-muted transition-all duration-300 ease-apple hover:bg-accent hover:text-white hover:scale-110"
            >
              <Icon name={s.icon} size={17} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon, label, value, href, index }) {
  const cls = `glass flex items-center gap-4 p-4 sm:p-5 !rounded-[22px] rv rv-d${(index % 4) + 1}`;
  const inner = (
    <>
      <span className="shrink-0 w-11 h-11 grid place-items-center rounded-full bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
        <Icon name={icon} size={19} />
      </span>
      <div className="min-w-0">
        <div className="text-xs text-muted">{label}</div>
        <div className="text-text text-[.92rem] font-medium truncate transition-colors group-hover:text-accent">{value}</div>
      </div>
    </>
  );

  if (href) {
    const isExternal = href.startsWith('http');
    return (
      <a href={href} {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className={`${cls} group no-underline`}>
        {inner}
      </a>
    );
  }
  return <div className={cls}>{inner}</div>;
}
