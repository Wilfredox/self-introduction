# API 示例

本文档用于 2.5 轮口径对齐，字段命名与返回结构以此版本为准。

## 统一说明

- 公开首页聚合接口正式返回：`profile + featuredProjects + resume + contentVersion`
- 作品详情正式必备字段：`title / excerpt / description / period / cover / pdf / links / images`
- 资产 URL 只是字段示意：
  - 本地开发可能返回 `/uploads/...`
  - 第七轮默认路线下，正式环境优先改为 CloudBase 可访问资源地址
- 扩展字段正式支持但可按“空值安全”处理：
  - `role`: 无内容时返回 `null`
  - `highlights`: 无内容时返回 `[]`
  - `notes`: 无内容时返回 `[]`
- 前端第三轮联调前，应把 `role / highlights / notes` 当作可选展示内容，不要依赖其一定有业务值

## 公开接口

### GET `/api/public/bootstrap`

```json
{
  "success": true,
  "data": {
    "profile": {
      "name": "张三",
      "tagline": "设计与开发并重的创作者",
      "contacts": [
        {
          "id": "ct_001",
          "label": "邮箱",
          "value": "hello@example.com",
          "href": "mailto:hello@example.com",
          "order": 100
        }
      ]
    },
    "featuredProjects": [
      {
        "id": "prj_001",
        "slug": "portfolio-redesign",
        "title": "Portfolio Redesign",
        "excerpt": "个人作品网站重构与上线",
        "period": "2025.03 - 2025.06",
        "status": "PUBLISHED",
        "sortOrder": 100,
        "cover": {
          "assetId": "ast_cover_001",
          "url": "https://assets.example.com/images/cover-a.webp",
          "previewUrl": "https://assets.example.com/images/cover-a.webp"
        },
        "links": [
          {
            "id": "lnk_001",
            "label": "Live Demo",
            "url": "https://example.com/demo",
            "order": 100
          }
        ],
        "updatedAt": "2026-04-26T08:30:00.000Z"
      }
    ],
    "resume": {
      "assetId": "ast_resume_001",
      "fileName": "resume.pdf",
      "url": "https://assets.example.com/resumes/2a4f-resume.pdf",
      "previewUrl": "https://assets.example.com/resumes/2a4f-resume.pdf",
      "downloadUrl": "https://assets.example.com/resumes/2a4f-resume.pdf",
      "updatedAt": "2026-04-26T08:30:00.000Z"
    },
    "contentVersion": "2026-04-26T08:30:00.000Z"
  }
}
```

### GET `/api/public/projects`

```json
{
  "success": true,
  "data": [
    {
      "id": "prj_001",
      "slug": "portfolio-redesign",
      "title": "Portfolio Redesign",
      "excerpt": "个人作品网站重构与上线",
      "period": "2025.03 - 2025.06",
      "status": "PUBLISHED",
      "sortOrder": 100,
      "cover": {
        "assetId": "ast_cover_001",
        "url": "https://assets.example.com/images/cover-a.webp",
        "previewUrl": "https://assets.example.com/images/cover-a.webp"
      },
      "links": [
        {
          "id": "lnk_001",
          "label": "Live Demo",
          "url": "https://example.com/demo",
          "order": 100
        }
      ],
      "updatedAt": "2026-04-26T08:30:00.000Z"
    }
  ]
}
```

### GET `/api/public/projects/:slug`

```json
{
  "success": true,
  "data": {
    "id": "prj_001",
    "slug": "portfolio-redesign",
    "title": "Portfolio Redesign",
    "excerpt": "个人作品网站重构与上线",
    "description": "这是一个面向招聘方展示的个人作品网站项目，重点处理首页拼贴交互、后台维护和公开内容读取。",
    "period": "2025.03 - 2025.06",
    "status": "PUBLISHED",
    "sortOrder": 100,
    "cover": {
      "assetId": "ast_cover_001",
      "url": "https://assets.example.com/images/cover-a.webp",
      "previewUrl": "https://assets.example.com/images/cover-a.webp"
    },
    "pdf": {
      "assetId": "ast_pdf_001",
      "fileName": "portfolio.pdf",
      "url": "https://assets.example.com/pdfs/portfolio.pdf",
      "previewUrl": "https://assets.example.com/pdfs/portfolio.pdf"
    },
    "links": [
      {
        "id": "lnk_001",
        "label": "Live Demo",
        "url": "https://example.com/demo",
        "order": 100
      }
    ],
    "images": [
      {
        "id": "img_001",
        "assetId": "ast_gallery_001",
        "caption": "首页截图",
        "order": 100,
        "url": "https://assets.example.com/images/gallery-a.webp",
        "previewUrl": "https://assets.example.com/images/gallery-a.webp"
      }
    ],
    "role": "产品设计与前后端开发",
    "highlights": [
      "首页内放大简介态，不跳出当前页面",
      "后台支持作品上传、排序和资料维护"
    ],
    "notes": [
      "如果 role 没有内容，后端返回 null",
      "如果 highlights 或 notes 没有内容，后端返回空数组"
    ],
    "createdAt": "2026-04-26T08:00:00.000Z",
    "updatedAt": "2026-04-26T08:30:00.000Z"
  }
}
```

### GET `/api/public/resume`

```json
{
  "success": true,
  "data": {
    "assetId": "ast_resume_001",
    "fileName": "resume.pdf",
    "url": "https://assets.example.com/resumes/2a4f-resume.pdf",
    "previewUrl": "https://assets.example.com/resumes/2a4f-resume.pdf",
    "downloadUrl": "https://assets.example.com/resumes/2a4f-resume.pdf",
    "updatedAt": "2026-04-26T08:30:00.000Z"
  }
}
```

## 管理员登录

### POST `/api/admin/auth/login`

请求体：

```json
{
  "username": "admin",
  "password": "your-password"
}
```

响应：

```json
{
  "success": true,
  "data": {
    "admin": {
      "id": "adm_001",
      "username": "admin"
    }
  }
}
```

## 后台站点资料

### PATCH `/api/admin/site`

```json
{
  "name": "张三",
  "tagline": "设计与开发并重的创作者",
  "contacts": [
    {
      "label": "邮箱",
      "value": "hello@example.com",
      "href": "mailto:hello@example.com",
      "order": 100
    },
    {
      "label": "GitHub",
      "value": "github.com/example",
      "href": "https://github.com/example",
      "order": 200
    }
  ]
}
```

## 后台作品新增 / 编辑

```json
{
  "title": "Portfolio Redesign",
  "slug": "portfolio-redesign",
  "excerpt": "个人作品网站重构与上线",
  "description": "这是一个面向招聘方展示的个人作品网站项目，重点处理首页拼贴交互、后台维护和公开内容读取。",
  "period": "2025.03 - 2025.06",
  "role": "产品设计与前后端开发",
  "highlights": [
    "首页内放大简介态，不跳出当前页面",
    "后台支持作品上传、排序和资料维护"
  ],
  "notes": [
    "第三轮联调前，前端应容错 role/highlights/notes 的空值场景"
  ],
  "coverAssetId": "ast_cover_001",
  "pdfAssetId": "ast_pdf_001",
  "status": "PUBLISHED",
  "images": [
    {
      "assetId": "ast_gallery_001",
      "caption": "首页截图",
      "order": 100
    }
  ],
  "links": [
    {
      "label": "Live Demo",
      "url": "https://example.com/demo",
      "order": 100
    }
  ]
}
```

## 文件上传

### POST `/api/admin/assets/images`

- `Content-Type: multipart/form-data`
- 字段名：`file`

响应：

```json
{
  "success": true,
  "data": {
    "id": "ast_cover_001",
    "kind": "IMAGE",
    "fileName": "58c8d-image.webp",
    "mimeType": "image/webp",
    "size": 248120,
    "url": "https://assets.example.com/images/58c8d-image.webp",
    "previewUrl": "https://assets.example.com/images/58c8d-image.webp"
  }
}
```

