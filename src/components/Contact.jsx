import Icon from './Icon';

const SOCIALS = [
  { icon: 'github',    title: 'GitHub',     href: 'https://github.com/EddieContra' },
  { icon: 'linkedin',  title: 'LinkedIn',   href: 'https://linkedin.com/in/whoiseddiee' },
  { icon: 'instagram', title: 'Instagram',  href: 'https://instagram.com/whoiseddiee' },
  { icon: 'whatsapp',  title: 'WhatsApp',   href: 'https://wa.me/255745225985' },
  { icon: 'pinterest', title: 'Pinterest',  href: 'https://pinterest.com/whoiseddiee' },
  { icon: 'x',         title: 'Twitter / X', href: 'https://x.com/whoiseddiee' },
];

const CONTACTS = [
  { icon: 'mail',          label: 'Email',    value: 'emmanueledmund00@gmail.com', href: 'mailto:emmanueledmund00@gmail.com' },
  { icon: 'messageCircle', label: 'WhatsApp', value: '+255 745 225 985',           href: 'https://wa.me/255745225985' },
  { icon: 'mapPin',        label: 'Location', value: 'Arusha, Tanzania' },
];

export default function Contact() {
  return (
    <section id="contact" className="py-20 sm:py-28 div-thick">
      <div className="wrap">
        <span className="sec-label">Get in touch</span>
        <h2 className="sec-title rv">Let's work together</h2>

        <p className="text-lg text-text leading-relaxed mb-10 max-w-xl rv">
          Have a project in mind, want to collaborate, or just want to say hi?
          The fastest way to reach me is email or WhatsApp.
        </p>

        <div className="border-2 border-text mb-10">
          {CONTACTS.map((c, i) => (
            <ContactRow
              key={c.label}
              index={i}
              isLast={i === CONTACTS.length - 1}
              {...c}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-0 rv border-2 border-text w-fit">
          {SOCIALS.map((s, i) => (
            <a
              key={s.title}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              title={s.title}
              aria-label={s.title}
              className={[
                'w-12 h-12 grid place-items-center text-text bg-bg transition-colors',
                'hover:bg-text hover:text-bg',
                i < SOCIALS.length - 1 ? 'border-r-2 border-text' : '',
              ].join(' ')}
            >
              <Icon name={s.icon} size={18} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon, label, value, href, index, isLast }) {
  const cls = [
    'group flex items-center gap-4 p-4 sm:p-5 transition-colors',
    'hover:bg-text hover:text-bg',
    !isLast ? 'border-b-2 border-text' : '',
    `rv rv-d${(index % 4) + 1}`,
  ].join(' ');

  const inner = (
    <>
      <span className="shrink-0 w-10 h-10 grid place-items-center border-2 border-text">
        <Icon name={icon} size={18} />
      </span>
      <div>
        <div className="text-[.6rem] tracking-[.2em] uppercase font-bold opacity-70">{label}</div>
        <div className="text-sm font-bold uppercase tracking-wide">{value}</div>
      </div>
    </>
  );

  if (href) {
    const isExternal = href.startsWith('http');
    return (
      <a
        href={href}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={`${cls} no-underline`}
      >
        {inner}
      </a>
    );
  }
  return <div className={cls}>{inner}</div>;
}
