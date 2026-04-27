# 第七轮 CloudBase 部署清单

本文档对应第七轮“CloudBase 可部署性验证与后端迁移实施”。

当前结论先写在最前面：

- CloudBase 路线已经进入代码实施阶段
- 但它更准确的定位是：
  - 真正可执行的国内友好技术演示路线
  - 还不是“零成本、零前置条件的长期正式公开路线”

## 1. 第七轮已经落地到代码的内容

### 1.1 运行时配置

当前 `src/config/env.ts` 已支持：

- `DEPLOY_TARGET=standalone|cloudbase`
- `STORAGE_PROVIDER=local|supabase|cloudbase`
- `SERVE_FRONTEND_FROM_BACKEND`
- `CLOUDBASE_ENV_ID`
- `CLOUDBASE_SECRET_ID`
- `CLOUDBASE_SECRET_KEY`
- `CLOUDBASE_SESSION_TOKEN`
- `CLOUDBASE_HTTP_PORT`

结论：

- `cloudbase` 已经从文档路线进入运行时配置路线

### 1.2 存储分发

当前 `src/services/storage/store-asset.ts` 已支持：

- `local`
- `supabase`
- `cloudbase`

其中新增了：

- `src/services/storage/cloudbase-storage.ts`

结论：

- 上传链路已经不再只有本地或 Supabase
- `cloudbase` 已经成为真实代码分支

### 1.3 HTTP 入口

当前仓库中已新增：

- `src/cloudbase-http.ts`
- `src/server.ts`
- `scf_bootstrap`
- `.gitattributes`

说明：

- `src/index.ts` 继续作为本地开发入口
- `src/cloudbase-http.ts` 用于 CloudBase HTTP 承载
- `scf_bootstrap` 对应 CloudBase Express / Framework 方式
- `.gitattributes` 已对 `scf_bootstrap` 固定为 LF，降低 Windows 提交后在 Linux 运行时报错的风险

结论：

- “CloudBase HTTP Cloud Function” 已不再只存在于文档里

## 2. 当前哪些代码已经切到 CloudBase

已真正切到 CloudBase 的代码点：

1. 运行时默认目标
- 生产环境默认 `DEPLOY_TARGET=cloudbase`
- 生产环境默认 `STORAGE_PROVIDER=cloudbase`

2. 存储实现
- 上传后可走 CloudBase Storage SDK

补充说明：

- 当前策略已收口为：
  - 持久化 `fileID / objectKey`
  - 读取资产时再通过 CloudBase SDK 生成当前访问 URL
- 这意味着数据库里的 CloudBase 资产不再把临时 URL 当长期正式值
- 只要历史数据的 `objectKey=fileID` 仍在，第八轮无需额外数据迁移
- 真实环境里仍需继续确认：
  - 这些读时生成 URL 的有效期
  - 后续是否还要演进成更稳定的永久公开访问策略

3. 启动入口
- 已存在 CloudBase 专用启动入口

4. 静态托管逻辑
- `SERVE_FRONTEND_FROM_BACKEND` 已变成显式开关
- CloudBase 路线下默认不再把“后端顺手托管前端 dist”当唯一正式方式

## 3. 当前哪些仍是待迁移旧实现

这轮之后仍保留、但不再是默认正式路线的部分有：

1. `src/services/storage/supabase-storage.ts`
2. `@supabase/supabase-js`
3. `STORAGE_PROVIDER=supabase` 兼容分支

它们当前保留的意义是：

- 给过渡期回归和历史路线留兜底
- 不代表还要继续按 Supabase 做正式默认上线

## 4. CloudBase 路线下的最小部署形态

当前建议的最小形态是：

1. 前端
- CloudBase Static Hosting

2. 后端
- CloudBase HTTP Cloud Function

3. 文件
- CloudBase Cloud Storage

4. 数据库
- 优先验证 CloudBase PostgreSQL
- 不行再评估 CloudBase MySQL

## 5. 第七轮关键平台判断

### 5.1 这条路线是不是“真正可执行的免费技术演示路线”

结论：是。

原因：

1. CloudBase 官方提供：
- 静态托管
- HTTP 访问服务
- 云函数
- 云存储
- 数据库能力

2. 当前项目结构适合它：
- 前端可静态托管
- 后端可保留 Express
- 文件可迁到云存储

### 5.2 这条路线是不是“零门槛长期正式公开路线”

结论：不是。

原因同样基于官方口径：

1. 默认域名更偏开发测试
- 浏览器直接访问默认域名会出现访问提醒页

2. 自定义域名需要先完成 ICP 备案

3. CloudBase MySQL 官方文档明确是按量计费并支持自动暂停
- 所以它不应先被理解为“完全免费默认库”

4. CloudBase PostgreSQL 虽然官方已提供能力
- 但当前项目是否能在预算与 Prisma 兼容性上成立，仍需真实环境验证

所以更准确的判断是：

- 它已经是可执行的国内友好技术演示路线
- 但距离“长期正式公开路线”仍受默认域名、备案和数据库边界影响

## 6. 当前真实阻塞

### 6.1 数据库阻塞

当前最关键阻塞仍然是：

- CloudBase PostgreSQL 与 Prisma 的真实兼容性还没验证

至少还没在真实 CloudBase 环境完成：

1. `prisma migrate deploy`
2. `prisma seed`
3. 运行态连接验证

### 6.2 同域登录阻塞

当前管理员登录依赖：

- HttpOnly Cookie
- `SameSite=Lax`
- 生产环境 `secure=true`

所以仍然必须尽快确认：

1. 能否通过 CloudBase HTTP 访问服务把：
- `/` 指向静态托管
- `/api` 指向云函数

2. 如果不能同域
- 当前登录策略就不应直接上线

### 6.3 正式公开阻塞

当前官方边界意味着：

1. 默认域名更适合开发测试
2. 如果要长期正式公开
- 大概率仍需要自定义域名
- 需要 ICP 备案

## 7. 当前推荐的验证顺序

1. 先在真实 CloudBase 环境验证数据库
- 优先 PostgreSQL

2. 再验证 CloudBase Storage 上传
- 图片
- 项目 PDF
- 简历

3. 再验证 CloudBase HTTP 入口
- `scf_bootstrap`
- `src/cloudbase-http.ts`
- 确认部署包里的 `scf_bootstrap` 保持 LF 且具备执行权限

4. 最后验证同域访问与 Cookie 登录

## 8. 当前结论

第七轮完成后，后端已经达到：

1. `cloudbase` 从评估路线进入代码路线
2. 上传 dispatch 真正支持 `cloudbase`
3. 仓库中存在 CloudBase HTTP 入口实现
4. 文档默认口径已切到 CloudBase

但还不能直接宣称：

- CloudBase 路线已经完成真实环境验证

因为真实环境阻塞仍集中在：

1. 数据库
2. 同域登录
3. 默认域名 / 备案边界
4. CloudBase Storage 读时生成 URL 的长期稳定性还没在真实环境验证
