# 后端项目

这是个人作品网站的后端工程，负责：

- 单管理员登录与登录态校验
- 首页资料维护
- 作品 CRUD 与排序
- 图片 / PDF / 简历上传
- 公开读取接口
- CloudBase 路线的运行时与部署适配

## 第七轮当前状态

当前默认路线已经进入：

- `Tencent CloudBase` 可部署性验证与后端迁移实施阶段

本轮已经落进代码的部分：

1. 运行时配置已支持 `cloudbase`
2. 上传存储 dispatch 已支持 `cloudbase`
3. 仓库中已新增 CloudBase HTTP 入口
4. 第五轮 `Render + Supabase` 已不再是默认正式路线

## 当前技术栈

- Node.js
- Express
- TypeScript
- Prisma
- 关系型数据库优先
- 云对象存储

## 快速开始

1. 复制环境变量

```bash
cp .env.example .env
```

2. 本地开发推荐配置
- `DEPLOY_TARGET=standalone`
- `STORAGE_PROVIDER=local`
- `DATABASE_URL / DIRECT_URL` 指向本地 MySQL 或当前 CloudBase MySQL

3. 安装依赖

```bash
npm install
```

4. 生成 Prisma Client

```bash
npm run prisma:generate
```

5. 运行数据库迁移

```bash
npm run prisma:migrate:deploy
```

6. 初始化管理员账号和站点基础记录

```bash
npm run prisma:seed
```

7. 启动本地开发服务

```bash
npm run dev
```

## 第七轮已实现的 CloudBase 代码点

1. 运行时配置
- `src/config/env.ts`
- 已支持：
  - `DEPLOY_TARGET=standalone|cloudbase`
  - `STORAGE_PROVIDER=local|supabase|cloudbase`
  - `SERVE_FRONTEND_FROM_BACKEND`
  - `CLOUDBASE_*` 环境变量

2. CloudBase 存储实现
- `src/services/storage/cloudbase-storage.ts`
- `src/services/storage/store-asset.ts`
- 当前策略已调整为：
  - 持久化 `fileID / objectKey`
  - 接口读取时再生成当前可访问 URL
- 不再把 CloudBase 的临时访问 URL 当成数据库里的长期正式 URL

3. CloudBase HTTP 入口
- `src/cloudbase-http.ts`
- `scf_bootstrap`
- `npm run start:cloudbase`
- `.gitattributes` 已固定 `scf_bootstrap` 为 LF

4. 本地入口仍保留
- `src/index.ts`
- 方便继续本地联调和本地数据库开发

## 当前保留与待迁移状态

已经保留的核心：

- Express 路由和业务 service
- Cookie Session 登录方案
- Prisma schema
- 资源输出字段：
  - `url`
  - `previewUrl`
  - `downloadUrl`

仍属于待迁移旧实现的部分：

- `src/services/storage/supabase-storage.ts`
- `@supabase/supabase-js`

说明：

- 它们现在不再是默认正式路线
- 只是为了避免一次性大拆导致本地回归链路中断，暂时保留

## 当前推荐部署理解

第七轮当前最合理的技术形态是：

1. 前端
- CloudBase Static Hosting

2. 后端
- CloudBase HTTP Cloud Function

3. 文件
- CloudBase Cloud Storage

4. 数据库
- 当前低成本路线默认改为 CloudBase MySQL
- Prisma schema 已切换为 MySQL provider

## 数据库说明

- `DATABASE_URL`
  运行中的 Prisma Client 使用
- `DIRECT_URL`
  Prisma migrate / schema engine 使用

当前判断：

- 当前 Prisma schema 已切换到 MySQL provider
- 第一个真实目标是把现有后端接到 CloudBase MySQL

## 当前目录

- `prisma/schema.prisma`
  数据库结构
- `src/index.ts`
  本地开发启动入口
- `src/cloudbase-http.ts`
  CloudBase HTTP 入口
- `src/server.ts`
  共享的 HTTP 启动封装
- `src/services/storage/cloudbase-storage.ts`
  CloudBase 存储实现
- `docs/api-examples.md`
  给前端联调使用的接口字段示例
- `docs/production-deploy-checklist.md`
  第七轮部署收口清单
- `docs/technical-launch-runbook.md`
  第七轮 CloudBase 实施与验证顺序
- `scf_bootstrap`
  CloudBase Framework / Express 承载脚本
- `.gitattributes`
  固定 `scf_bootstrap` 为 LF，降低 Windows 提交后在 Linux 运行时报错的风险
- `uploads/`
  仅供本地开发兜底使用的上传目录

## 当前结论

CloudBase 路线现在已经不是纯文档路线，而是已进入代码实施阶段。

但要实话实说：

- 这已经开始具备“可部署验证基础”
- 还没有完成“真实 CloudBase 环境验证”

因为真正剩下的阻塞已经收敛到：

1. CloudBase MySQL 连接与迁移如何落地
2. CloudBase 默认域名 / 访问提示页 / 备案边界
3. 前后端同域 Cookie 登录的最终实配
4. CloudBase 存储 URL 的长期稳定性验证
- 当前数据库里的 CloudBase 资产以 `objectKey=fileID` 为长期识别依据
- 公开接口和后台读取会在返回前现算 `url / previewUrl / downloadUrl`
- 这意味着历史 CloudBase 测试数据只要 `objectKey` 仍在，就不需要额外数据迁移
