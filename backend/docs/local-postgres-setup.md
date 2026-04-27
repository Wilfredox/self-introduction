# 本地 PostgreSQL 实跑说明

本文档用于第三轮真实联调前的后端准备，不涉及前端入口恢复或设计稿迁移。

## 目标

在本地得到一个可运行的后端环境，至少完成：

1. PostgreSQL 可连接
2. Prisma migration 已执行
3. 管理员账号已初始化
4. 后端服务可启动

## 1. 准备数据库

推荐数据库名：

- `portfolio_site`

默认连接串已写在 `.env.example`：

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/portfolio_site?pgbouncer=true
DIRECT_URL=postgresql://postgres:postgres@localhost:5432/portfolio_site
```

如果你本地用户名、密码或端口不同，请同时改 `.env` 中的：

- `DATABASE_URL`
- `DIRECT_URL`

说明：

- `DATABASE_URL` 给运行中的 Prisma Client 使用，默认按 PgBouncer 兼容模式配置
- `DIRECT_URL` 给 migration / schema engine 直接使用

## 2. 初始化环境变量

在 `backend/` 目录下复制：

```bash
cp .env.example .env
```

Windows PowerShell 也可以直接新建并复制内容。

至少需要确认这些值：

- `DATABASE_URL`
- `DIRECT_URL`
- `APP_BASE_URL`
- `ADMIN_APP_ORIGIN`
- `ADMIN_SEED_USERNAME`
- `ADMIN_SEED_PASSWORD`

## 可选：直接使用 Prisma Dev 本地开发库

如果本机没有独立安装 PostgreSQL，可以先在 `backend/` 目录执行：

```bash
npm run prisma:dev
```

当前项目已经按这个方式完成过一次第三轮本地联调验证。

说明：

- Prisma Dev 会在本机拉起一个本地开发用 PostgreSQL 服务
- 启动后会输出可用连接串
- 你需要把输出的运行连接写到 `DATABASE_URL`
- 把不带 `pgbouncer=true` 的直连串写到 `DIRECT_URL`

如果使用的是本项目默认脚本，建议仍然确认 `.env` 中最终值是否和终端输出一致

## 3. 安装依赖并生成 Prisma Client

```bash
npm install
npm run prisma:generate
```

## 4. 执行 migration

当前仓库已提供初始 migration：

- `prisma/migrations/20260426_000001_init/migration.sql`

执行：

```bash
npm run prisma:migrate:deploy
```

如果只是查看迁移状态，可以执行：

```bash
npm run prisma:migrate:status
```

## 5. 初始化管理员账号和站点基础记录

```bash
npm run prisma:seed
```

seed 会做两件事：

1. 按 `.env` 中的账号密码初始化单管理员
2. 创建 `site_profiles` 的默认记录

## 6. 启动后端

开发模式：

```bash
npm run dev
```

生产启动前先构建：

```bash
npm run build
npm run start
```

## 7. 最小验证

启动后可先检查：

- `GET /api/health`
- `POST /api/admin/auth/login`
- `GET /api/public/bootstrap`

## 8. 前端联调地址约定

第三轮问题修复后，前端正式代码默认应走相对路径 `/api`，不要在正式构建里静默回退到 `http://localhost:4000/api`。

后端侧约定如下：

1. 正式部署
- 推荐同域名或反向代理部署
- 示例：
  - 前端页面：`https://example.com`
  - 对外接口：`https://example.com/api`
- `/api` 由 Nginx、平台网关或托管平台路由转发到后端服务

2. 本地联调
- 后端本地服务默认仍可跑在：
  - `http://127.0.0.1:4000`
- 前端如果保留相对路径 `/api`，应在本地开发服务器上代理到：
  - `http://127.0.0.1:4000/api`
- 只有在确实无法使用代理时，才显式设置：
  - `VITE_API_BASE_URL=http://127.0.0.1:4000/api`

说明：

- `http://127.0.0.1:4000/api` 是开发环境联调地址，不是正式站点对访客暴露的默认回退地址
- 这样可以避免站点部署到别人设备后，浏览器误请求访问者自己的 localhost

## 当前已冻结的联调重点

第三轮联调前，后端已冻结以下内容：

1. 首页聚合结构
- `profile`
- `featuredProjects`
- `resume`
- `contentVersion`

2. 作品详情必备字段
- `title`
- `excerpt`
- `description`
- `period`
- `cover`
- `pdf`
- `links`
- `images`

3. 作品详情可选扩展字段
- `role`
- `highlights`
- `notes`

空值策略：

- `role` 无内容时返回 `null`
- `highlights` 无内容时返回 `[]`
- `notes` 无内容时返回 `[]`

## 当前未覆盖事项

以下内容仍不是本轮后端处理范围：

1. 根目录 `index.html` 恢复
2. 设计参考页迁移到独立目录
3. React 正式入口恢复与设计稿隔离

这些事项按职责边界由前端 / 设计侧处理。
