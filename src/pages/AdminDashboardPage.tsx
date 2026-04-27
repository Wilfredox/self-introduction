import { useAdminProjectsQuery, useAdminSiteQuery } from "../hooks/usePortfolioQueries";

export function AdminDashboardPage() {
  const siteQuery = useAdminSiteQuery();
  const projectsQuery = useAdminProjectsQuery();

  if (siteQuery.isLoading || projectsQuery.isLoading) {
    return <div className="state-shell">正在载入后台总览...</div>;
  }

  if (siteQuery.error) {
    return <div className="state-shell">读取后台站点资料失败：{siteQuery.error.message}</div>;
  }

  if (projectsQuery.error) {
    return <div className="state-shell">读取作品列表失败：{projectsQuery.error.message}</div>;
  }

  const publishedCount = projectsQuery.data?.filter((project) => project.status === "published").length ?? 0;
  const draftCount = projectsQuery.data?.filter((project) => project.status === "draft").length ?? 0;

  return (
    <div className="admin-page-grid">
      <section className="admin-page-head">
        <p className="eyebrow">后台总览</p>
        <h1>第三轮执行面板</h1>
        <p className="muted">这里确认真实接口、后台上传、排序保存和公开页读取是否已经接通，后续再继续压视觉细节。</p>
      </section>

      <div className="stats-grid">
        <article className="stat-card">
          <span className="eyebrow">Site Profile</span>
          <strong>{siteQuery.data?.name}</strong>
          <p>{siteQuery.data?.tagline}</p>
        </article>
        <article className="stat-card">
          <span className="eyebrow">Projects</span>
          <strong>{projectsQuery.data?.length ?? 0} 个项目</strong>
          <p>已发布 {publishedCount} / 草稿 {draftCount}</p>
        </article>
        <article className="stat-card">
          <span className="eyebrow">Resume</span>
          <strong>{siteQuery.data?.resume?.fileName ?? "尚未上传简历"}</strong>
          <p>{siteQuery.data?.resume ? "已接入真实预览与下载文件" : "等待上传 PDF 文件"}</p>
        </article>
      </div>

      <section className="detail-panel">
        <p className="eyebrow">本轮重点</p>
        <ul className="bullet-list">
          <li>公开页和后台页都已切到真实 API，而不是本地 mock 数据。</li>
          <li>后台登录、站点资料保存、作品排序和文件上传都按后端既有口径联调。</li>
          <li>公开页保留 role、highlights、notes 的空值容错，避免后端返回空内容时崩掉。</li>
        </ul>
      </section>
    </div>
  );
}
