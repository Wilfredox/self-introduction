import { Link, useSearchParams } from "react-router-dom";
import { CollageStage } from "../components/CollageStage";
import { getPortfolioBootstrap, getPortfolioProject } from "../data/portfolioContent";

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSlug = searchParams.get("project") ?? undefined;
  const activeProject = getPortfolioProject(activeSlug);
  const { profile, featuredProjects } = getPortfolioBootstrap();

  return (
    <div className="page-shell page-shell--wide">
      <section className="home-hero">
        <div className="home-hero__name">
          <p className="eyebrow">Selected Works / Portfolio Snapshot</p>
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
          <p className="eyebrow">阅读路线</p>
          <p className="muted">
            先快速认识我，再浏览代表作品；如果某个项目值得继续看，就直接进入详情页或简历页，不让阅读路径拐弯。
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
        activeProject={activeProject}
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
