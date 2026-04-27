# 个人作品集（GitHub 静态版）

这个仓库现在的主线已经收成了：

- 纯前端静态作品集
- 适合发布到 GitHub Pages
- 不再依赖站内后台、数据库或文件上传服务

## 当前目录

- `src/`
  前端页面、组件和内容读取逻辑
- `public/`
  公共静态资源
- `.github/workflows/`
  GitHub Pages 自动发布工作流
- `docs/内容更新说明.md`
  后续手动维护内容时看的说明

## 当前内容来源

当前公开页面使用仓库内置内容，不再请求后端接口，也不再依赖站内后台。

主要内容入口：

- `src/content/site.ts`
- `src/content/projects.ts`

这里包含：

- 姓名、一句话介绍、联系方式
- 作品列表
- 作品详情
- 简历预览与下载信息

## 更新内容的方式

这个版本不再提供网站内后台。

以后更新内容的方式是：

1. 打开 GitHub 仓库
2. 编辑 `src/content/site.ts` 或 `src/content/projects.ts`
3. 提交 commit
4. 重新部署 GitHub Pages

更详细的说明见：

- `docs/内容更新说明.md`

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 说明

- 当前前端已经切成静态内容模式
- 当前 V1 默认发布目标是 GitHub 仓库 Pages
- 路由使用 `HashRouter`
- 当前 404 跳转脚本已按现有公开路由适配 GitHub 仓库 Pages 与根域 / 自定义域名场景
- 如果后续新增新的一级公开路由，需要同步更新 `public/404.html` 里的路由根段判断
