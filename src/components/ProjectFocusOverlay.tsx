import { Link } from "react-router-dom";
import { ProjectDetail } from "../types/content";
import { formatExternalUrl, getPrimaryProjectLink } from "../utils/projectContent";

interface ProjectFocusOverlayProps {
  project: ProjectDetail;
  onClose: () => void;
}

export function ProjectFocusOverlay({ project, onClose }: ProjectFocusOverlayProps) {
  const primaryLink = getPrimaryProjectLink(project.links);

  return (
    <div className="focus-overlay" role="dialog" aria-modal="true">
      <button className="focus-overlay__backdrop" type="button" onClick={onClose} aria-label="关闭作品简介" />
      <article className="focus-card" data-overlay-panel>
        <button className="focus-card__close ghost-button" type="button" onClick={onClose}>
          关闭
        </button>

        <div className="focus-card__content">
          <div className="focus-card__visual">
            <img src={project.cover.previewUrl} alt={project.title} />
          </div>

          <div className="focus-card__body">
            <div className="focus-card__headline">
              {primaryLink ? (
                <a href={primaryLink.url} target="_blank" rel="noreferrer">
                  作品链接 / {formatExternalUrl(primaryLink.url)}
                </a>
              ) : (
                <span className="eyebrow-link">作品链接 / 待补充</span>
              )}
              <h2>{project.title}</h2>
              <p>{project.description}</p>
            </div>

            <div className="pill-row">
              <span className="pill">{project.period}</span>
              {project.role ? <span className="pill">{project.role}</span> : null}
              <span className={`pill pill--${project.status}`}>{project.status}</span>
            </div>

            {project.highlights?.length ? (
              <div className="tag-list">
                {project.highlights.map((highlight) => (
                  <span key={highlight} className="tag">
                    {highlight}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="focus-card__actions">
              <Link className="button" to={`/works/${project.slug}`}>
                进入详情页
              </Link>
              {primaryLink ? (
                <a className="ghost-button" href={primaryLink.url} target="_blank" rel="noreferrer">
                  打开外链
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
