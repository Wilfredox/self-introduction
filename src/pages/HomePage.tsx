import { useSearchParams } from "react-router-dom";
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
