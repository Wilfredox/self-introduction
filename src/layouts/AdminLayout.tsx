import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { realApi } from "../data/realApi";
import { queryKeys, useAdminSessionQuery } from "../hooks/usePortfolioQueries";

export function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const sessionQuery = useAdminSessionQuery();

  const logoutMutation = useMutation({
    mutationFn: () => realApi.logout(),
    onSuccess: async () => {
      queryClient.setQueryData(queryKeys.adminSession, null);
      await queryClient.invalidateQueries();
      navigate("/admin/login", { replace: true });
    }
  });

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <p className="eyebrow">Admin</p>
          <h1>Lin Lan Portfolio CMS</h1>
          <p className="muted">第三轮已切入真实接口、Cookie 登录态和文件上传链路。</p>
        </div>

        <nav className="admin-nav">
          <NavLink end to="/admin">
            总览
          </NavLink>
          <NavLink to="/admin/profile">基本信息</NavLink>
          <NavLink to="/admin/projects">作品管理</NavLink>
          <NavLink to="/admin/resume">简历管理</NavLink>
        </nav>

        <div className="admin-session">
          <span className="muted">当前登录</span>
          <strong>{sessionQuery.data?.username ?? "未登录"}</strong>
          <button className="ghost-button" type="button" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}>
            {logoutMutation.isPending ? "正在退出..." : "退出登录"}
          </button>
        </div>
      </aside>

      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
}
