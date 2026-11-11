import Icon from './Icon';

// Decorative artwork palettes for project "screens" — used only when a project
// has no image. Each is a [from, via, to] trio layered over the theme surface.
const ART = [
  ['#0a84ff', '#5e5ce6', '#1d1d1f'],
  ['#5e5ce6', '#bf5af2', '#1d1d1f'],
  ['#30d158', '#0a84ff', '#1d1d1f'],
  ['#ff9f0a', '#ff375f', '#1d1d1f'],
  ['#64d2ff', '#0a84ff', '#1d1d1f'],
  ['#bf5af2', '#ff375f', '#1d1d1f'],
  ['#0a84ff', '#30d158', '#1d1d1f'],
  ['#ff375f', '#5e5ce6', '#1d1d1f'],
];

/**
 * A generated "app screen" for a project: mesh gradient, grid, window chrome
 * and a floating glass icon tile. Layers shift with the parent's --mx/--my
 * (set by useTilt) for a parallax depth effect.
 */
export default function ProjectArt({ project, index = 0, size = 'card' }) {
  const [a, b, c] = ART[index % ART.length];
  const big = size === 'modal';

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background: `radial-gradient(120% 90% at 15% 10%, ${a} 0%, transparent 55%), radial-gradient(90% 80% at 90% 90%, ${b} 0%, transparent 60%), ${c}`,
      }}
    >
      {/* fine grid */}
      <div
        className="absolute inset-[-10%] opacity-[.18]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(70% 70% at 50% 50%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(70% 70% at 50% 50%, black, transparent)',
          transform: 'translate(calc((var(--mx, 50%) - 50%) * -0.06), calc((var(--my, 50%) - 50%) * -0.06))',
          transition: 'transform .3s ease-out',
        }}
      />

      {/* window chrome */}
      <div
        className="absolute left-[8%] right-[8%] top-[12%] bottom-[-6%] rounded-t-[18px] border border-white/15 bg-white/[.06] backdrop-blur-md shadow-2xl"
        style={{
          transform: 'translate(calc((var(--mx, 50%) - 50%) * 0.04), calc((var(--my, 50%) - 50%) * 0.04))',
          transition: 'transform .3s ease-out',
        }}
      >
        <div className="flex gap-1.5 p-3.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
        </div>
        <div className="px-5 space-y-2.5 opacity-60">
          <div className="h-2 w-1/3 rounded-full bg-white/40" />
          <div className="h-2 w-2/3 rounded-full bg-white/20" />
          <div className="h-2 w-1/2 rounded-full bg-white/20" />
        </div>
      </div>

      {/* floating icon */}
      <div
        className="absolute inset-0 grid place-items-center"
        style={{
          transform: 'translate(calc((var(--mx, 50%) - 50%) * 0.12), calc((var(--my, 50%) - 50%) * 0.12))',
          transition: 'transform .3s ease-out',
        }}
      >
        <div className={`grid place-items-center rounded-[28%] bg-white/15 border border-white/30 backdrop-blur-xl text-white shadow-[0_20px_60px_-10px_rgba(0,0,0,.6)] ${big ? 'w-32 h-32' : 'w-24 h-24 sm:w-28 sm:h-28'}`}>
          <Icon name={project.icon} size={big ? 60 : 48} />
        </div>
      </div>

      {project.img && (
        <img
          src={`${import.meta.env.BASE_URL}${project.img}`}
          alt=""
          loading="lazy"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
}
