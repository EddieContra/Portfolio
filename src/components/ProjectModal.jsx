import { useEffect } from 'react';

export default function ProjectModal({ project, onClose }) {
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
      className="fixed inset-0 bg-black/90 z-[500] flex items-center justify-center p-8 backdrop-blur-md animate-[up_.3s_ease_forwards]"
    >
      <div className="bg-bg2 border border-edge max-w-[700px] w-full max-h-[88vh] overflow-y-auto nice-scroll">
        <div className="p-8 border-b border-edge flex justify-between items-start gap-4">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {project.tags.map((t) => (
                <span key={t} className="text-[.6rem] tracking-[1.5px] uppercase text-accent bg-accent/10 px-2.5 py-0.5">
                  {t}
                </span>
              ))}
            </div>
            <h3 className="font-disp text-[2.6rem] tracking-wider leading-none">{project.name}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="bg-transparent border-none text-muted text-2xl leading-none cursor-pointer hover:text-accent transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-8">
          <div className="w-full aspect-video bg-bg3 grid place-items-center text-7xl mb-6">
            {project.emoji}
          </div>
          <p className="text-muted leading-[1.85] text-[.93rem] mb-6">{project.full}</p>
          <div className="flex gap-4 flex-wrap">
            {project.github && (
              <a href={project.github} className="btn-ghost !text-[.78rem] !px-5 !py-2.5">
                GitHub →
              </a>
            )}
            {project.live && (
              <a href={project.live} className="btn-fill !text-[.78rem] !px-5 !py-2.5">
                Live Demo →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
