import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminSessionQuery } from "../../hooks/usePortfolioQueries";
import { ApiError } from "../../data/realApi";

export function RequireAdminAuth() {
  const location = useLocation();
  const sessionQuery = useAdminSessionQuery();

  if (sessionQuery.isLoading) {
    return <div className="state-shell">正在检查登录状态...</div>;
  }

  if (sessionQuery.error) {
    if (sessionQuery.error instanceof ApiError && sessionQuery.error.status === 401) {
      return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
    }

    return <div className="state-shell">后台登录态校验失败：{sessionQuery.error.message}</div>;
  }

  if (!sessionQuery.data) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
