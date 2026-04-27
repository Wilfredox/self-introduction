import { Link, useSearchParams } from "react-router-dom";
import { CollageStage } from "../components/CollageStage";
import { useBootstrapQuery, useProjectDetailQuery } from "../hooks/usePortfolioQueries";

export function HomePage() {
  const bootstrapQuery = useBootstrapQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSlug = searchParams.get("project") ?? undefined;
  const activeProjectQuery = useProjectDetailQuery(activeSlug);

  if (bootstrapQuery.isLoading) {
    return <div className="state-shell">正在载入首页内容...</div>;
  }

  if (bootstrapQuery.error) {
    return <div className="state-shell">首页内容加载失败：{bootstrapQuery.error.message}</div>;
  }

  if (!bootstrapQuery.data) {
    return <div className="state-shell">首页内容暂时不可用。</div>;
  }

  const { profile, featuredProjects } = bootstrapQuery.data;

  return (
    <div className="page-shell page-shell--wide">
      <section className="home-hero">
        <div className="home-hero__name">
          <p className="eyebrow">A 版首页 / 横排题头 + 自由拼贴台面</p>
          <h1>{profile.name}</h1>
        </div>

        <div className="home-hero__tagline">
          <p>{profile.tagline}</p>
        </div>

        <div className="home-hero__contacts">
          {profile.contacts.map((contact) => (
            <a key={contact.id} href={contact.href} target="_blank" rel="noreferrer">
              <span>{contact.label}</span>
              <strong>{contact.value}</strong>
            </a>
          ))}
        </div>
      </section>

      <section className="home-summary">
        <div>
          <p className="eyebrow">首页目标</p>
          <p className="muted">
            让招聘方先快速知道你是谁、做什么、能不能点进真实项目。首页交互负责制造记忆点，但不牺牲入口清晰度。
          </p>
        </div>
        <div className="home-summary__actions">
          <Link className="button" to="/works">
            查看全部作品
          </Link>
          <Link className="ghost-button" to="/resume">
            进入简历页
          </Link>
        </div>
      </section>

      <CollageStage
        projects={featuredProjects}
        activeProject={activeProjectQuery.data ?? null}
        onOpenProject={(slug) => {
          const next = new URLSearchParams(searchParams);
          next.set("project", slug);
          setSearchParams(next, { replace: true });
        }}
        onCloseProject={() => {
          const next = new URLSearchParams(searchParams);
          next.delete("project");
          setSearchParams(next, { replace: true });
        }}
      />
    </div>
  );
}
