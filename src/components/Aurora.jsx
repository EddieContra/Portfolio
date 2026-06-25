// Page-wide liquid aurora — three soft colour washes that slowly drift behind
// the whole site. Styles + theme colours live in index.css (.aurora / .aura-*).
// Sits behind the constellation canvas (mounted before it in App).
export default function Aurora() {
  return (
    <div className="aurora -z-10" aria-hidden="true">
      <span className="aura-blob aura-1" />
      <span className="aura-blob aura-2" />
      <span className="aura-blob aura-3" />
    </div>
  );
}
