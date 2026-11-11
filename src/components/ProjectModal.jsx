import { useEffect, useRef } from 'react';
import { useModalFocus } from '../hooks/useModalFocus';
import { lockScroll } from '../lib/motion';
import ProjectArt from './ProjectArt';
import Icon from './Icon';

// Apple-style sheet: scales up from below over a blurred backdrop.
export default function ProjectModal({ project, index = 0, onClose }) {
  const boxRef = useRef(null);
  useModalFocus(boxRef, !!project);

  useEffect(() => {
    if (!project) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    lockScroll(true);
    return () => {
      document.removeEventListener('keydown', onKey);
      lockScroll(false);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-2xl flex items-end sm:items-center justify-center sm:p-8 animate-fade"
    >
      <div
        ref={boxRef}
        role="dialog"
        aria-modal="true"
        aria-label={project.name}
        data-lenis-prevent
        className="relative bg-bg2 rounded-t-[28px] sm:rounded-[32px] max-w-[820px] w-full max-h-[92vh] overflow-y-auto nice-scroll shadow-[0_40px_120px_-20px_rgba(0,0,0,.6)] opacity-0 animate-sheet"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-9 h-9 grid place-items-center rounded-full bg-black/40 backdrop-blur text-white cursor-pointer hover:bg-black/60 transition-colors"
        >
          <Icon name="close" size={16} />
        </button>

        <div className="relative aspect-[16/9]">
          <ProjectArt project={project} index={index} size="modal" />
        </div>

        <div className="p-7 sm:p-10">
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm font-medium text-accent mb-3">
            {project.tags.map((t) => <span key={t}>{t}</span>)}
          </div>
          <h3 className="font-disp font-bold text-[clamp(1.8rem,4vw,2.6rem)] tracking-apple leading-[1.08] text-text mb-5">
            {project.name}
          </h3>
          <p className="text-muted leading-[1.7] text-[1.05rem] mb-8">{project.full}</p>
          <div className="flex gap-3 flex-wrap">
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn-fill">
                Live demo
                <Icon name="arrowUpRight" size={14} />
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <Icon name="github" size={15} />
                View on GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
