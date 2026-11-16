import Sheet from './Sheet';
import ProjectArt from './ProjectArt';
import Icon from './Icon';

/** Project details in a modal sheet. */
export default function ProjectSheet({ project, index, onClose }) {
  const titleId = 'project-sheet-title';

  return (
    <Sheet labelledBy={titleId} onClose={onClose} closeLabel="Close project details">
      <div className="relative aspect-[16/9] w-full">
        <ProjectArt project={project} index={index} large />
      </div>

      <div className="p-6 pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:p-10">
        <ul className="m-0 mb-3 flex list-none flex-wrap gap-x-4 gap-y-1 p-0">
          {project.tags.map((tag) => <li key={tag} className="kicker">{tag}</li>)}
        </ul>
        <h2 id={titleId} className="mb-5 font-disp text-[clamp(1.7rem,4vw,2.5rem)] font-extrabold leading-[1.08] tracking-display text-text">
          {project.name}
        </h2>
        <p className="text-[1.02rem] leading-[1.75] text-muted">{project.full}</p>

        {(project.live || project.github) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn-fill">
                Live demo
                <Icon name="arrowUpRight" size={16} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <Icon name="github" size={17} />
                View on GitHub
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>
        )}
      </div>
    </Sheet>
  );
}
