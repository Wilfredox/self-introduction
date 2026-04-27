import { Link } from "react-router-dom";
import { getPortfolioProjects } from "../data/portfolioContent";
import { getProjectTone } from "../utils/projectContent";

export function WorksPage() {
  const projects = getPortfolioProjects();

  if (!projects.length) {
    return <div className="state-shell">当前还没有可展示的已发布作品。</div>;
  }

  return (
    <div className="page-shell">
      <section className="page-intro">
        <p className="eyebrow">Selected Works</p>
        <h1>作品列表</h1>
        <p className="muted">按时间整理课程项目、建模实践与开发成果，便于快速浏览与重点比较。</p>
      </section>

      <section className="works-grid">
        {projects.map((project) => (
          <Link key={project.id} className="work-list-card" to={`/works/${project.slug}`}>
            <div className={`work-list-card__visual work-list-card__visual--${getProjectTone(project.slug)}`}>
              <img src={project.cover.previewUrl} alt={project.title} />
            </div>
            <div className="work-list-card__body">
              <div className="work-list-card__meta">
                <strong>{project.title}</strong>
                <span>{project.period}</span>
              </div>
              <p>{project.excerpt}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
