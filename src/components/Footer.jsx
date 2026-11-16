import { SITE } from '../data/site';
import Icon from './Icon';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-edge">
      <div className="wrap flex flex-col gap-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="m-0 font-disp text-lg font-extrabold italic tracking-tight text-text">
          {SITE.name}<span className="not-italic text-accent" aria-hidden="true">.</span>
        </p>
        <p className="m-0">© {year} {SITE.owner}</p>
        <p className="m-0 font-medium">{SITE.tagline}</p>
        <a href="#hero" className="inline-flex min-h-[2.75rem] items-center gap-2 font-semibold text-text no-underline hover:text-accent-ink">
          Back to top
          <Icon name="arrowRight" size={16} className="-rotate-90" />
        </a>
      </div>
    </footer>
  );
}
