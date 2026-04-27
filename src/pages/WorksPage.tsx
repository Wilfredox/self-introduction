import { Link } from "react-router-dom";
import { useProjectsQuery } from "../hooks/usePortfolioQueries";
import { getProjectTone } from "../utils/projectContent";

export function WorksPage() {
  const projectsQuery = useProjectsQuery();

  if (projectsQuery.isLoading) {
    return <div className="state-shell">正在读取作品列表...</div>;
  }

  if (projectsQuery.error) {
    return <div className="state-shell">作品列表加载失败：{projectsQuery.error.message}</div>;
  }

  if (!projectsQuery.data?.length) {
    return <div className="state-shell">当前还没有可展示的已发布作品。</div>;
  }

  return (
    <div className="page-shell">
      <section className="page-intro">
        <p className="eyebrow">Works</p>
        <h1>作品列表页</h1>
        <p className="muted">
          这里保持普通网格，不做分类和搜索。招聘方可以直接扫标题、摘要和项目时间，再进入详情页。
        </p>
      </section>

      <section className="works-grid">
        {projectsQuery.data.map((project) => (
          <Link key={project.id} className="work-list-card" to={`/works/${project.slug}`}>
            <div className={`work-list-card__visual work-list-card__visual--${getProjectTone(`${project.id}-${project.sortOrder}`)}`}>
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
