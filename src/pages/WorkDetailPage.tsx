import { Link, useParams } from "react-router-dom";
import { PdfPreview } from "../components/PdfPreview";
import { getPortfolioProject } from "../data/portfolioContent";
import { formatExternalUrl, getPrimaryProjectLink, getProjectTone } from "../utils/projectContent";

export function WorkDetailPage() {
  const { slug } = useParams();
  const project = getPortfolioProject(slug);

  if (!project) {
    return <div className="state-shell">未找到对应作品，可能还未发布。</div>;
  }

  const primaryLink = getPrimaryProjectLink(project.links);
  const tone = getProjectTone(project.slug);

  return (
    <div className="page-shell">
      <section className="page-intro">
        {primaryLink ? (
          <a className="eyebrow-link" href={primaryLink.url} target="_blank" rel="noreferrer">
            作品链接 / {formatExternalUrl(primaryLink.url)}
          </a>
        ) : (
          <span className="eyebrow-link">作品链接 / 待补充</span>
        )}
        <h1>{project.title}</h1>
        <p className="muted">{project.excerpt}</p>
      </section>

      <div className="detail-layout">
        <article className="detail-main">
          <div className={`detail-hero detail-hero--${tone}`}>
            <img src={project.cover.previewUrl} alt={project.title} />
          </div>

          <section className="detail-section">
            <h2>项目简介</h2>
            <p>{project.description}</p>
          </section>

          {project.images.length ? (
            <section className="detail-section">
              <h2>关键截图说明</h2>
              <div className="detail-media-grid">
                {project.images.map((image) => (
                  <figure key={image.id} className="detail-media-card">
                    <div className="detail-media-card__visual">
                      <img src={image.previewUrl} alt={image.caption} />
                    </div>
                    <figcaption>{image.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          ) : null}

          {project.highlights?.length ? (
            <section className="detail-section">
              <h2>项目亮点</h2>
              <div className="tag-list">
                {project.highlights.map((highlight) => (
                  <span key={highlight} className="tag">
                    {highlight}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          <section className="detail-section">
            <h2>PDF 页面内预览</h2>
            <PdfPreview asset={project.pdf} title={`${project.title} PDF`} minHeight={460} />
          </section>
        </article>

        <aside className="detail-sidebar">
          <section className="detail-panel">
            <p className="eyebrow">项目时间</p>
            <strong>{project.period}</strong>
          </section>

          {project.role ? (
            <section className="detail-panel">
              <p className="eyebrow">项目角色</p>
              <strong>{project.role}</strong>
            </section>
          ) : null}

          <section className="detail-panel">
            <p className="eyebrow">多个外链</p>
            <div className="stack-links">
              {project.links.map((link) => (
                <a key={link.id} className="ghost-button ghost-button--full" href={link.url} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          </section>

          {project.notes?.length ? (
            <section className="detail-panel">
              <p className="eyebrow">补充说明</p>
              <ul className="bullet-list">
                {project.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <Link className="ghost-button ghost-button--full" to="/works">
            返回作品列表
          </Link>
        </aside>
      </div>
    </div>
  );
}
