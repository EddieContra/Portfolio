export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="py-10 border-t border-edge">
      <div className="wrap flex justify-between items-center text-xs text-muted gap-4 flex-wrap">
        <a
          href="#hero"
          className="font-disp font-extrabold italic text-text no-underline transition-colors hover:text-accent"
        >
          Eddie<span className="text-accent not-italic">.</span>
        </a>
        <p>© {year} Emmanuel Edmund · Built in Tanzania 🇹🇿</p>
        <p className="font-medium">CS · Design · Education</p>
      </div>
    </footer>
  );
}
