import Clock from './Clock';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t-2 border-text">
      <div className="wrap py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <a
            href="#hero"
            className="font-disp text-3xl sm:text-4xl text-text no-underline uppercase tracking-tight"
          >
            Eddie<span aria-hidden="true">.</span>
          </a>

          <div className="text-xs text-text uppercase tracking-[.18em] font-medium md:text-center">
            © {year} Emmanuel Edmund Kiishweko · Built in Tanzania
          </div>

          <div className="md:justify-self-end">
            <Clock />
          </div>
        </div>

        <div className="mt-10 pt-6 border-t-2 border-text flex flex-wrap gap-4 justify-between items-center">
          <p className="text-[.65rem] tracking-[.22em] uppercase font-bold text-muted">
            Full Stack · Design · Education
          </p>
          <p className="text-[.65rem] tracking-[.22em] uppercase font-bold text-muted">
            Open to opportunities
          </p>
        </div>
      </div>
    </footer>
  );
}
