import { NavLink, Outlet } from "react-router-dom";
import { useBootstrapQuery } from "../hooks/usePortfolioQueries";

export function PublicLayout() {
  const bootstrapQuery = useBootstrapQuery();
  const siteName = bootstrapQuery.data?.profile.name ?? "个人作品网站";

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <NavLink className="brand-mark" to="/">
            <span>{siteName}</span>
            <small>A 版执行中</small>
          </NavLink>
          <nav className="site-nav">
            <NavLink to="/">首页</NavLink>
            <NavLink to="/works">作品</NavLink>
            <NavLink to="/resume">简历</NavLink>
            <NavLink to="/admin/login">后台</NavLink>
          </nav>
        </div>
      </header>
      <main className="page-main">
        <Outlet />
      </main>
    </div>
  );
}
