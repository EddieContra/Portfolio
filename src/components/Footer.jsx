export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-bg2/60 border-t border-edge/60">
      <div className="wrap py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-muted">
        <a href="#hero" className="font-semibold text-text no-underline tracking-tight text-sm hover:text-accent transition-colors">
          Eddie<span className="text-accent">.</span>
        </a>
        <p>Copyright © {year} Emmanuel Edmund. All rights reserved.</p>
        <p>Designed &amp; built in Arusha, Tanzania.</p>
      </div>
    </footer>
  );
}
