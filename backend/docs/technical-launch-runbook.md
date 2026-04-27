# 第七轮 CloudBase 实施 Runbook

本文档对应第七轮实施阶段，不再停留在纯评估层。

目标：

- 让当前后端真正具备 CloudBase 可部署验证基础

## 1. 当前已经具备的代码基础

当前仓库已经有：

1. CloudBase 运行时配置
- `src/config/env.ts`

2. CloudBase 存储实现
- `src/services/storage/cloudbase-storage.ts`

3. CloudBase HTTP 入口
- `src/cloudbase-http.ts`
- `scf_bootstrap`

4. 本地 / CloudBase 双入口并存
- 本地：`src/index.ts`
- CloudBase：`src/cloudbase-http.ts`

## 2. 本地开发与 CloudBase 路线的环境建议

### 本地开发

推荐：

```env
DEPLOY_TARGET=standalone
STORAGE_PROVIDER=local
SERVE_FRONTEND_FROM_BACKEND=true
```

### CloudBase 验证

推荐：

```env
NODE_ENV=production
DEPLOY_TARGET=cloudbase
STORAGE_PROVIDER=cloudbase
SERVE_FRONTEND_FROM_BACKEND=false
TRUST_PROXY=true
CLOUDBASE_ENV_ID=your-cloudbase-env-id
CLOUDBASE_HTTP_PORT=9000
DATABASE_URL=postgresql://username:password@host:5432/database
DIRECT_URL=postgresql://username:password@host:5432/database
```

说明：

- `APP_BASE_URL` 先写当前对外实际访问地址
- 如果只是函数侧验证，也可以先写 HTTP 访问服务地址

## 3. CloudBase HTTP 入口如何使用

当前第七轮提供了两种关键文件：

1. `src/cloudbase-http.ts`
- 编译后为 `dist/cloudbase-http.js`

2. `scf_bootstrap`
- 负责把 CloudBase Framework / Express 运行方式拉起到 `9000` 端口
- 仓库已通过 `.gitattributes` 把它固定为 LF

本轮代码层的判断是：

- CloudBase HTTP 承载已经有代码入口
- 下一步需要真实环境验证它是否按预期启动

## 4. CloudBase Storage 如何接当前上传链路

当前上传流程是：

1. `multer.memoryStorage`
2. `store-asset.ts`
3. 按 `STORAGE_PROVIDER` 分发

当 `STORAGE_PROVIDER=cloudbase` 时：

1. 上传会进入 `cloudbase-storage.ts`
2. 文件写入 CloudBase Storage
3. 后端仍返回：
- `url`
- `previewUrl`
- `downloadUrl`

这意味着：

- 前端理论上不需要因为平台切换而重写页面层

当前策略已经明确：

- 数据库持久化 `fileID / objectKey`
- 公开接口和后台读取时生成当前访问地址
- 不再把 CloudBase 临时 URL 当成数据库里的长期正式 URL

这带来的结果是：

- 历史 CloudBase 测试数据只要 `objectKey=fileID` 仍在
- 第八轮就无需额外数据迁移

当前还需要额外确认的一点：

- 读时生成的 URL 在真实环境下的有效期与长期稳定性

## 5. 本轮最应该先验证什么

### 第一步

验证数据库。

目标：

- CloudBase PostgreSQL 能否承接当前 Prisma 路线

至少要跑：

```bash
npm run prisma:generate
npm run prisma:migrate:deploy
npm run prisma:seed
```

### 第二步

验证 CloudBase HTTP 入口能否启动。

至少要确认：

1. `npm run build` 后存在 `dist/cloudbase-http.js`
2. `scf_bootstrap` 指向正确产物
3. 部署包中的 `scf_bootstrap` 保持 LF 换行并具备执行权限

### 第三步

验证 CloudBase Storage 上传。

至少要确认：

1. 图片上传
2. 项目 PDF 上传
3. 简历上传

### 第四步

验证同域访问与 Cookie 登录。

理想形态：

- `/` -> Static Hosting
- `/api` -> HTTP Cloud Function

## 6. 第七轮关键官方边界判断

### 6.1 默认域名

根据 CloudBase 官方文档：

- 默认域名更偏开发测试
- 浏览器直接访问默认域名会出现访问提醒页

所以当前更适合：

- 技术演示
- 可部署验证

而不是直接当最终长期正式公开入口。

### 6.2 自定义域名

根据 CloudBase 官方文档：

- 自定义域名需要先完成 ICP 备案

所以如果后续要正式对外长期公开：

- 域名与备案仍然是现实前置条件

### 6.3 数据库费用边界

当前要特别注意：

- CloudBase PostgreSQL 官方有能力支持，但预算边界仍需实际环境核对
- CloudBase MySQL 官方文档明确是按量计费并支持自动暂停

这意味着：

- CloudBase 路线适合继续推进
- 但数据库最终落点不能只靠纸面假设

## 7. 第七轮当前结论

当前最准确的结论是：

1. CloudBase 路线已经进入可部署验证阶段
2. 但还没完成真实环境验证闭环
3. 下一轮应优先进入：
- CloudBase 数据库验证
- CloudBase HTTP 启动验证
- CloudBase 上传验证
