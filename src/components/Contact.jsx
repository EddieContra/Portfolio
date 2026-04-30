import { useState } from 'react';

const SOCIALS = [
  { label: 'GH', title: 'GitHub',     href: 'https://github.com/EddieContra' },
  { label: 'LI', title: 'LinkedIn',   href: '#' },
  { label: 'IG', title: 'Instagram',  href: '#' },
  { label: '𝕏',  title: 'Twitter/X',  href: '#' },
];

export default function Contact() {
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      e.target.reset();
    }, 3500);
  };

  return (
    <section
      id="contact"
      className="bg-bg2 py-32 px-10 max-[1100px]:px-10 max-[768px]:!px-6 max-[480px]:!py-20"
    >
      <div className="grid grid-cols-[1fr_1.1fr] gap-28 items-start max-[1100px]:grid-cols-1 max-[1100px]:gap-12">
        <div>
          <span className="sec-label">Get In Touch</span>
          <h2 className="sec-title rv">LET'S<br />WORK<br />TOGETHER.</h2>
          <p className="text-muted leading-[1.95] text-base mb-7 rv">
            Have a project in mind, want to collaborate, or just want to say hello? I'd love to hear from you.
          </p>

          <InfoRow icon="📍" label="Location"     value="Arusha, Tanzania" />
          <InfoRow icon="✉️" label="Email"        value="emmanueledmund00@gmail.com" />
          <InfoRow icon="📱" label="Availability" value="Open to Remote &amp; Local Roles" />

          <div className="flex gap-3 mt-8 rv">
            {SOCIALS.map((s) => (
              <a
                key={s.title}
                href={s.href}
                title={s.title}
                aria-label={s.title}
                className="w-11 h-11 grid place-items-center border border-edge no-underline text-muted text-[.7rem] font-bold tracking-wider transition-colors duration-200 hover:bg-accent hover:text-bg hover:border-accent"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-5 rv">
          <Field label="Your Name"    type="text"  placeholder="Jane Doe"                  required />
          <Field label="Email Address" type="email" placeholder="jane@example.com"          required />
          <Field label="Subject"       type="text"  placeholder="Project Inquiry / Collaboration" />
          <Field label="Message" textarea           placeholder="Tell me about your idea or project…" required />
          <button
            type="submit"
            disabled={sent}
            className={[
              'btn-fill self-start transition-all',
              sent ? '!bg-[#22c55e] !text-bg pointer-events-none' : '',
            ].join(' ')}
          >
            {sent ? '✓ Message Sent!' : 'Send Message →'}
          </button>
        </form>
      </div>
    </section>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 mb-5 rv">
      <div className="w-[42px] h-[42px] bg-bg3 border border-edge grid place-items-center text-sm shrink-0">
        {icon}
      </div>
      <div>
        <strong className="block text-sm mb-0.5 text-text">{label}</strong>
        <span className="text-muted text-[.82rem]" dangerouslySetInnerHTML={{ __html: value }} />
      </div>
    </div>
  );
}

function Field({ label, type = 'text', placeholder, required, textarea }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[.65rem] tracking-[2px] uppercase text-muted">{label}</label>
      {textarea ? (
        <textarea
          placeholder={placeholder}
          required={required}
          className="bg-bg3 border border-edge text-text px-4 py-3 font-sans text-[.88rem] outline-none transition-colors duration-200 focus:border-accent w-full min-h-[120px] resize-y"
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          required={required}
          className="bg-bg3 border border-edge text-text px-4 py-3 font-sans text-[.88rem] outline-none transition-colors duration-200 focus:border-accent w-full"
        />
      )}
    </div>
  );
}
