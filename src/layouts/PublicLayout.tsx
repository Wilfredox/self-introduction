import { NavLink, Outlet } from "react-router-dom";
import { getPortfolioBootstrap } from "../data/portfolioContent";

export function PublicLayout() {
  const siteName = getPortfolioBootstrap().profile.name;

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <NavLink className="brand-mark" to="/">
            <span>{siteName}</span>
            <small>Selected Works</small>
          </NavLink>
          <nav className="site-nav">
            <NavLink to="/">首页</NavLink>
            <NavLink to="/works">作品</NavLink>
            <NavLink to="/resume">简历</NavLink>
          </nav>
        </div>
      </header>
      <main className="page-main">
        <Outlet />
      </main>
    </div>
  );
}
