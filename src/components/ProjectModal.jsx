import { useEffect, useRef } from 'react';
import { useModalFocus } from '../hooks/useModalFocus';
import Icon from './Icon';

export default function ProjectModal({ project, onClose }) {
  const boxRef = useRef(null);
  useModalFocus(boxRef, !!project);

  useEffect(() => {
    if (!project) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 bg-black/90 z-[500] flex items-center justify-center p-6 sm:p-8 backdrop-blur-md animate-[up_.3s_ease_forwards]"
    >
      <div
        ref={boxRef}
        role="dialog"
        aria-modal="true"
        aria-label={project.name}
        className="bg-bg2 border border-edge rounded-2xl max-w-[700px] w-full max-h-[88vh] overflow-y-auto nice-scroll"
      >
        <div className="p-6 sm:p-8 border-b border-edge flex justify-between items-start gap-4">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {project.tags.map((t) => (
                <span key={t} className="text-[.65rem] tracking-wide uppercase text-accent bg-accent/10 px-2.5 py-0.5 rounded-full font-medium">
                  {t}
                </span>
              ))}
            </div>
            <h3 className="font-disp font-extrabold text-2xl sm:text-3xl tracking-tight leading-tight text-text">
              {project.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 w-9 h-9 grid place-items-center rounded-full border border-edge bg-transparent text-muted cursor-pointer hover:text-accent hover:border-accent transition-colors"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
        <div className="p-6 sm:p-8">
          <div className="relative w-full aspect-video bg-bg3 rounded-xl grid place-items-center text-accent mb-6 overflow-hidden">
            <Icon name={project.icon} size={72} />
            {project.img && (
              <img
                src={`${import.meta.env.BASE_URL}${project.img}`}
                alt={project.name}
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>
          <p className="text-muted leading-[1.85] text-[.93rem] mb-6">{project.full}</p>
          <div className="flex gap-3 flex-wrap">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                GitHub
                <Icon name="arrowUpRight" size={14} />
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-fill"
              >
                Live Demo
                <Icon name="arrowUpRight" size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
