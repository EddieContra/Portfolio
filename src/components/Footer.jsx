export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="py-10 border-t border-edge">
      <div className="wrap flex flex-col items-center text-center gap-3 sm:flex-row sm:justify-between sm:text-left sm:gap-4 text-xs text-muted">
        <a
          href="#hero"
          className="font-disp font-extrabold italic text-text no-underline transition-colors hover:text-accent"
        >
          Eddie<span className="text-accent not-italic">.</span>
        </a>
        <p>© {year} Emmanuel Edmund</p>
        <p className="font-medium">CS · Design · Education</p>
      </div>
    </footer>
  );
}
