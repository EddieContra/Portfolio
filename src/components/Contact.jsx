import { useRef } from 'react';
import { CONTACTS, CONTACT_INTRO } from '../data/contact';
import { SOCIALS, EMAIL } from '../data/socials';
import { SECTIONS } from '../data/site';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useReducedMotion } from '../hooks/useMediaQuery';
import { headingId } from './SectionHeader';
import ContourArt from './ContourArt';
import Icon from './Icon';

const ORDER = Object.keys(SECTIONS);

export default function Contact() {
  const sectionRef = useRef(null);
  const reduced = useReducedMotion();
  const { label, title } = SECTIONS.contact;
  const number = String(ORDER.indexOf('contact') + 1).padStart(2, '0');

  // --p eases the headline up to full size as the section arrives.
  useScrollProgress(sectionRef, { start: 1, end: 1, enabled: !reduced });

  return (
    <section id="contact" ref={sectionRef} aria-labelledby={headingId('contact')} className="section relative overflow-clip">
      <ContourArt
        seed={5}
        width={1200}
        height={700}
        cols={48}
        levels={12}
        className="absolute inset-0 h-full w-full text-accent opacity-[.22] [mask-image:radial-gradient(70%_70%_at_50%_100%,black,transparent)]"
      />

      <div className="wrap relative">
        <p className="sec-label rv">
          <b aria-hidden="true">{number}</b>
          <i aria-hidden="true" />
          {label}
        </p>

        <h2
          id={headingId('contact')}
          className="origin-left font-disp text-[clamp(2.75rem,10.5vw,8.5rem)] font-extrabold italic leading-[.9] tracking-[-0.05em] text-text motion-safe:will-change-transform"
          style={reduced ? undefined : {
            transform: 'scale(calc(.82 + .18 * var(--p, 1)))',
            opacity: 'calc(.35 + .65 * var(--p, 1))',
          }}
        >
          {title}<span className="not-italic text-accent" aria-hidden="true">.</span>
        </h2>

        <p className="lede rv mt-8 max-w-xl">{CONTACT_INTRO}</p>

        <a
          href={`mailto:${EMAIL}`}
          className="rv group mt-10 inline-flex max-w-full items-center gap-3 font-disp text-[clamp(.9rem,3.9vw,2.4rem)] font-bold tracking-tight text-text no-underline sm:gap-4"
        >
          <span className="min-w-0 break-all underline decoration-accent decoration-2 underline-offset-[.25em]">{EMAIL}</span>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-accent-on transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:translate-x-1 sm:h-14 sm:w-14">
            <Icon name="arrowUpRight" size={22} />
          </span>
        </a>

        <ul className="m-0 mt-14 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACTS.map((row, i) => (
            <li key={row.label} className={`rv rv-d${(i % 4) + 1}`}>
              <ContactRow {...row} />
            </li>
          ))}
        </ul>

        <ul className="rv m-0 mt-8 flex list-none flex-wrap gap-2.5 p-0">
          {SOCIALS.map((social) => (
            <li key={social.title}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                title={social.title}
                aria-label={`${social.title} (opens in a new tab)`}
                className="icon-btn hover:bg-text hover:text-bg"
              >
                <Icon name={social.icon} size={17} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ContactRow({ icon, label, value, href }) {
  const body = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-bg3 text-accent-ink">
        <Icon name={icon} size={19} />
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-muted">{label}</span>
        <span className="block text-[.84rem] font-semibold text-text [overflow-wrap:anywhere] sm:text-[.92rem]">{value}</span>
      </span>
    </>
  );
  const className = 'card flex h-full items-center gap-4 p-4';

  if (!href) return <div className={className}>{body}</div>;
  const external = href.startsWith('http');
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`${className} no-underline transition-colors duration-200 hover:border-text`}
    >
      {body}
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  );
}
