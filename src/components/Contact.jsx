import Icon from './Icon';
import { SOCIALS, EMAIL } from '../data/socials';

const CONTACTS = [
  { icon: 'mail',          label: 'Email',    value: EMAIL,             href: `mailto:${EMAIL}` },
  { icon: 'messageCircle', label: 'WhatsApp', value: '+255 745 225 985', href: 'https://wa.me/255745225985' },
  { icon: 'mapPin',        label: 'Location', value: 'Arusha, Tanzania' },
];

export default function Contact() {
  return (
    <section id="contact" className="py-20 sm:py-28 border-t border-edge">
      <div className="wrap">
        <span className="sec-label">Get in touch</span>
        <h2 className="sec-title rv">Let's work together</h2>

        <p className="text-lg text-muted leading-relaxed mb-10 max-w-xl rv">
          Have a project in mind, want to collaborate, or just want to say hi?
          The fastest way to reach me is email or WhatsApp.
        </p>

        <div className="space-y-3 mb-12">
          {CONTACTS.map((c, i) => (
            <ContactRow key={c.label} index={i} {...c} />
          ))}
        </div>

        <div className="flex flex-wrap gap-2 rv">
          {SOCIALS.map((s) => (
            <a
              key={s.title}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              title={s.title}
              aria-label={s.title}
              className="w-10 h-10 grid place-items-center border border-edge rounded-full text-muted transition-colors hover:bg-text hover:text-bg hover:border-text"
            >
              <Icon name={s.icon} size={16} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon, label, value, href, index }) {
  const cls = `flex items-center gap-4 rv rv-d${(index % 4) + 1}`;
  const inner = (
    <>
      <span
        className="shrink-0 w-10 h-10 grid place-items-center bg-bg2 border border-edge rounded-full text-muted transition-colors group-hover:border-accent group-hover:text-accent"
      >
        <Icon name={icon} size={18} />
      </span>
      <div>
        <div className="text-[.65rem] tracking-wide uppercase text-muted">{label}</div>
        <div className="text-text text-sm font-medium transition-colors group-hover:text-accent">
          {value}
        </div>
      </div>
    </>
  );

  if (href) {
    const isExternal = href.startsWith('http');
    return (
      <a
        href={href}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={`${cls} group no-underline`}
      >
        {inner}
      </a>
    );
  }
  return <div className={cls}>{inner}</div>;
}
