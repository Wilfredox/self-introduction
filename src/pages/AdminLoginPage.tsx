import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { realApi } from "../data/realApi";
import { queryKeys, useAdminSessionQuery } from "../hooks/usePortfolioQueries";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const sessionQuery = useAdminSessionQuery();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const from = (location.state as { from?: string } | null)?.from ?? "/admin";

  const loginMutation = useMutation({
    mutationFn: ({ nextUsername, nextPassword }: { nextUsername: string; nextPassword: string }) =>
      realApi.login(nextUsername, nextPassword),
    onSuccess: (session) => {
      queryClient.setQueryData(queryKeys.adminSession, session);
      navigate(from, { replace: true });
    }
  });

  if (sessionQuery.data) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate({ nextUsername: username, nextPassword: password });
  };

  return (
    <div className="login-page">
      <section className="login-copy">
        <p className="eyebrow">/admin/login</p>
        <h1>后台登录页</h1>
        <p className="muted">
          第三轮已切到真实后台登录接口，前端使用 Cookie 会话，不再使用本地 mock 登录态。
        </p>
      </section>

      <form className="auth-card" onSubmit={handleSubmit}>
        <label className="field">
          <span>用户名</span>
          <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
        </label>

        <label className="field">
          <span>密码</span>
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" />
        </label>

        {loginMutation.error ? <p className="form-error">{loginMutation.error.message}</p> : null}

        <button className="button button--full" type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? "正在进入后台..." : "进入后台"}
        </button>
      </form>
    </div>
  );
}
