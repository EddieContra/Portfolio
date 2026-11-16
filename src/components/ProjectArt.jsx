import { asset } from '../lib/assets';
import ContourArt from './ContourArt';
import Icon from './Icon';

/**
 * Cover for a project: its image when the file exists under public/, otherwise
 * generated contour artwork (unique per project) with the project's number and
 * icon. Everything is drawn from theme tokens.
 */
export default function ProjectArt({ project, index, large = false }) {
  const src = asset(project.img);
  const number = String(index + 1).padStart(2, '0');

  if (src) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-bg3" aria-hidden="true">
      <ContourArt
        seed={index + 3}
        eager={large}
        className="absolute inset-0 h-full w-full text-accent opacity-70 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-bg3 via-bg3/40 to-transparent" />
      <span className={`absolute left-5 top-4 font-disp font-extrabold italic leading-none tracking-display text-text/90 ${large ? 'text-6xl sm:text-7xl' : 'text-5xl'}`}>
        {number}
      </span>
      <span className={`absolute bottom-5 right-5 grid place-items-center rounded-2xl bg-accent text-accent-on shadow-lg shadow-black/20 ${large ? 'h-16 w-16' : 'h-12 w-12'}`}>
        <Icon name={project.icon} size={large ? 30 : 23} />
      </span>
    </div>
  );
}
