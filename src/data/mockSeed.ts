import {
  Asset,
  ContactItem,
  MockDatabase,
  Project,
  ProjectImage,
  ProjectLink,
  ProjectStory
} from "../types/content";

const PDF_DATA_URL =
  "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA1OTUgODQyXSAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA1IDAgUiA+PiA+PiAvQ29udGVudHMgNCAwIFIgPj4KZW5kb2JqCjQgMCBvYmoKPDwgL0xlbmd0aCAxMDUgPj4Kc3RyZWFtCkJUCi9GMSAyNCBUZgo3MiA3NjAgVGQKKE1vY2sgUG9ydGZvbGlvIFBERiBQcmV2aWV3KSBUagowIC0zNiBUZAovRjEgMTIgVGYKKFNlY29uZCByb3VuZCBmcm9udC1lbmQgcGxhY2Vob2xkZXIgYXNzZXQuKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKPDwgL1R5cGUgL0ZvbnQgL1N1YnR5cGUgL1R5cGUxIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyNDEgMDAwMDAgbiAKMDAwMDAwMDM5NiAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDYgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjQ2NgolJUVPRg==";

const TONES = {
  olive: "#6c7750",
  rust: "#b96d49",
  slate: "#6e8888",
  charcoal: "#2a2f29",
  marine: "#2f5376",
  sand: "#8c795d"
} as const;

type ToneKey = keyof typeof TONES;

function svgDataUrl(markup: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(markup)}`;
}

function createPosterSvg(title: string, subtitle: string, accent: string, badge: string) {
  return svgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 960">
      <rect width="800" height="960" fill="#f6f0e7"/>
      <rect x="28" y="28" width="744" height="904" fill="#fbf7f0" stroke="rgba(21,21,21,0.10)"/>
      <rect x="64" y="84" width="672" height="96" fill="${accent}" opacity="0.14"/>
      <rect x="64" y="212" width="672" height="372" fill="${accent}" opacity="0.2"/>
      <rect x="104" y="250" width="592" height="42" fill="#ffffff" opacity="0.82"/>
      <rect x="104" y="320" width="292" height="196" fill="#ffffff" opacity="0.65"/>
      <rect x="432" y="332" width="212" height="112" fill="#ffffff" opacity="0.55"/>
      <text x="64" y="652" fill="#161616" font-size="34" font-family="Segoe UI, Microsoft YaHei, sans-serif" font-weight="700">${title}</text>
      <text x="64" y="702" fill="#615c55" font-size="22" font-family="Segoe UI, Microsoft YaHei, sans-serif">${subtitle}</text>
      <rect x="64" y="758" width="174" height="42" rx="21" fill="#ffffff" stroke="${accent}" opacity="0.9"/>
      <text x="92" y="785" fill="${accent}" font-size="18" font-family="Segoe UI, Microsoft YaHei, sans-serif">${badge}</text>
    </svg>
  `);
}

function createStoryboardSvg(title: string, accent: string, step: string) {
  return svgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900">
      <rect width="1440" height="900" fill="#f7f2ea"/>
      <rect x="36" y="36" width="1368" height="828" fill="#fdf9f2" stroke="rgba(21,21,21,0.10)"/>
      <rect x="72" y="82" width="1296" height="86" fill="${accent}" opacity="0.14"/>
      <rect x="72" y="210" width="780" height="420" fill="${accent}" opacity="0.18"/>
      <rect x="896" y="210" width="472" height="180" fill="#ffffff" stroke="rgba(21,21,21,0.08)"/>
      <rect x="896" y="420" width="472" height="210" fill="#ffffff" stroke="rgba(21,21,21,0.08)"/>
      <text x="92" y="128" fill="#171717" font-size="34" font-family="Segoe UI, Microsoft YaHei, sans-serif" font-weight="700">${title}</text>
      <text x="92" y="684" fill="#615c55" font-size="26" font-family="Segoe UI, Microsoft YaHei, sans-serif">${step}</text>
    </svg>
  `);
}

export function createImageAsset(
  id: string,
  title: string,
  subtitle: string,
  tone: ToneKey,
  badge: string
): Asset {
  const preview = createPosterSvg(title, subtitle, TONES[tone], badge);

  return {
    id,
    kind: "image",
    fileName: `${id}.svg`,
    mimeType: "image/svg+xml",
    size: preview.length,
    url: preview,
    previewUrl: preview
  };
}

function createStoryboardAsset(id: string, title: string, tone: ToneKey, step: string): Asset {
  const preview = createStoryboardSvg(title, TONES[tone], step);

  return {
    id,
    kind: "image",
    fileName: `${id}.svg`,
    mimeType: "image/svg+xml",
    size: preview.length,
    url: preview,
    previewUrl: preview
  };
}

export function createPdfAsset(id: string, fileName: string): Asset {
  return {
    id,
    kind: "pdf",
    fileName,
    mimeType: "application/pdf",
    size: PDF_DATA_URL.length,
    url: PDF_DATA_URL,
    previewUrl: PDF_DATA_URL
  };
}

const contacts: ContactItem[] = [
  {
    id: "contact-email",
    label: "邮箱",
    value: "hello@linlan.design",
    href: "mailto:hello@linlan.design",
    order: 1
  },
  {
    id: "contact-phone",
    label: "电话",
    value: "+86 138 0000 0000",
    href: "tel:+8613800000000",
    order: 2
  },
  {
    id: "contact-location",
    label: "城市",
    value: "上海 / 可远程协作",
    href: "https://maps.google.com/?q=Shanghai",
    order: 3
  }
];

const projectDefinitions = [
  {
    id: "hydra",
    slug: "hydra-ops-console",
    title: "Hydra Ops 控制台",
    excerpt: "把复杂监控改成招聘方一眼能看懂的层级：目标、状态、动作，控制台从工具感变成叙事感。",
    period: "2025.01 - 2025.04",
    tone: "olive" as ToneKey,
    status: "published" as const,
    role: "产品体验 / 信息架构 / 设计交付",
    description:
      "这是一个典型的复杂后台案例。前端结构先预留出封面、项目导语、截图说明、多图与 PDF 区块，后续接入真实内容时不需要重新推翻详情页层级。",
    highlights: ["首屏任务聚焦", "告警路径压缩", "桌面端主导布局"],
    notes: ["适合展示你对复杂信息的收束能力。", "首页放大态第一行优先给出真实项目链接。"],
    links: [
      { label: "在线案例页", url: "https://portfolio.example/hydra" },
      { label: "交互稿预览", url: "https://figma.example/hydra" }
    ],
    images: ["首屏聚焦在值班人员最需要判断的状态与动作。", "把告警编排改成更清楚的并列关系，减少跨模块跳转。"]
  },
  {
    id: "atelier",
    slug: "atelier-portfolio-refresh",
    title: "Atelier 作品站改版",
    excerpt: "中文杂志感版式配合大图留白，让作品不是平铺罗列，而是按阅读节奏展开。",
    period: "2024.05 - 2024.08",
    tone: "rust" as ToneKey,
    status: "published" as const,
    role: "视觉系统 / 排版方向 / 前端协作",
    description:
      "该项目强调排版、题头和图文顺序。第二轮前端会先把结构稳定下来，再等待设计高保真稿逐步细化色彩、字距和动态细节。",
    highlights: ["题头强化", "中英混排", "首屏识别高"],
    notes: ["适合强调审美判断与品牌气质。", "详情页保留 PDF 区块，方便放提案材料。"],
    links: [
      { label: "线上站点", url: "https://portfolio.example/atelier" },
      { label: "视觉提案", url: "https://docs.example/atelier" }
    ],
    images: ["把刊头、题签和卡片间距做成统一秩序。", "通过更克制的色彩让作品图成为主角。"]
  },
  {
    id: "memo",
    slug: "memo-content-platform",
    title: "Memo 内容产品",
    excerpt: "把长内容拆成轻重量级阅读层次，读者既能快速扫，也能沉浸式看完整故事。",
    period: "2025.06 - 2025.09",
    tone: "slate" as ToneKey,
    status: "published" as const,
    role: "交互策略 / 组件规范 / 可用性迭代",
    description:
      "内容型项目需要同时照顾导语、截图说明和长段叙事，因此详情页正文采用分区块结构，不把信息全塞进单段文本里。",
    highlights: ["长文导航", "截图说明", "移动端阅读节奏"],
    notes: ["适合突出系统思考和内容型项目经验。", "移动端会从双栏回退为单栏阅读。"],
    links: [
      { label: "产品首页", url: "https://portfolio.example/memo" },
      { label: "阅读稿", url: "https://docs.example/memo" }
    ],
    images: ["阅读节奏从概览、重点到深读逐步递进。", "卡片和正文模块共享同一套内容摘要字段。"]
  },
  {
    id: "signal",
    slug: "signal-hiring-feature",
    title: "Signal 招聘专题页",
    excerpt: "把抽象的组织能力转译成结构清楚、短时间内可读完的招聘专题体验。",
    period: "2023.09 - 2023.11",
    tone: "charcoal" as ToneKey,
    status: "published" as const,
    role: "页面策划 / 内容编辑 / 视觉梳理",
    description:
      "这个案例更接近当前个人作品站的使用场景，因此会作为首页 A 方案的阅读效率对照样本，用来判断首页交互是否真的帮助招聘方快速进入项目。",
    highlights: ["短链路叙事", "关键信息前置", "下载动作强化"],
    notes: ["适合展示面向招聘方的理解。", "首页亮点不能干扰作品入口和简历下载入口。"],
    links: [
      { label: "招聘专题", url: "https://portfolio.example/signal" },
      { label: "归档 PDF", url: "https://docs.example/signal" }
    ],
    images: ["用更短链路的叙事把抽象能力转成页面证据。", "将下载按钮保持在用户不会错过的位置。"]
  },
  {
    id: "field",
    slug: "field-crm-workbench",
    title: "Field CRM 工作台",
    excerpt: "不靠炫技，而是靠稳定层级与轻提示让后台看起来专业、安静、能干活。",
    period: "2024.01 - 2024.04",
    tone: "marine" as ToneKey,
    status: "published" as const,
    role: "后台布局 / 表单规范 / 状态设计",
    description:
      "后台页面这轮会借鉴这个案例的思路，优先保证单管理员顺手维护内容，而不是做复杂运营面板。",
    highlights: ["低干扰布局", "批量操作位", "信息密度平衡"],
    notes: ["适合说明你也能处理务实型界面。", "后台路由会独立于公开页，避免相互影响。"],
    links: [
      { label: "系统预览", url: "https://portfolio.example/field" },
      { label: "流程说明", url: "https://docs.example/field" }
    ],
    images: ["把高频操作放在更顺手的位置，减少回看。", "信息密度收住以后，状态判断更稳定。"]
  },
  {
    id: "folio",
    slug: "folio-resume-system",
    title: "Folio 简历系统",
    excerpt: "在线预览与下载动作并置，既能浏览，也能快速带走关键信息。",
    period: "2025.02 - 2025.03",
    tone: "sand" as ToneKey,
    status: "draft" as const,
    role: "履历结构 / 文档可视化 / 导出体验",
    description:
      "作为草稿项目，这个案例主要用来验证后台对 draft / published 状态的处理，以及前台公开页是否只读取已发布内容。",
    highlights: ["双栏履历", "PDF 预览", "下载转化明确"],
    notes: ["适合体现内容整理能力。", "当前作为草稿不会出现在公开页面。"],
    links: [
      { label: "简历模块说明", url: "https://portfolio.example/folio" },
      { label: "交付文档", url: "https://docs.example/folio" }
    ],
    images: ["预览和下载必须并置，不让招聘方先猜按钮在哪。", "PDF 容器结构要尽量稳定，避免后续大改。"]
  }
];

const assets: Asset[] = [createPdfAsset("resume-pdf", "lin-lan-resume.pdf")];
const projects: Project[] = [];
const projectLinks: ProjectLink[] = [];
const projectImages: ProjectImage[] = [];
const projectStories: ProjectStory[] = [];

projectDefinitions.forEach((definition, index) => {
  const coverAsset = createImageAsset(
    `${definition.id}-cover`,
    definition.title,
    definition.period,
    definition.tone,
    definition.role
  );
  const pdfAsset = createPdfAsset(`${definition.id}-pdf`, `${definition.slug}.pdf`);

  assets.push(coverAsset, pdfAsset);

  definition.images.forEach((caption, imageIndex) => {
    const assetId = `${definition.id}-image-${imageIndex + 1}`;
    assets.push(
      createStoryboardAsset(
        assetId,
        definition.title,
        definition.tone,
        `截图 ${imageIndex + 1} / ${caption}`
      )
    );
    projectImages.push({
      id: `${definition.id}-image-rel-${imageIndex + 1}`,
      projectId: definition.id,
      assetId,
      caption,
      order: imageIndex + 1
    });
  });

  definition.links.forEach((link, linkIndex) => {
    projectLinks.push({
      id: `${definition.id}-link-${linkIndex + 1}`,
      projectId: definition.id,
      label: link.label,
      url: link.url,
      order: linkIndex + 1
    });
  });

  projects.push({
    id: definition.id,
    slug: definition.slug,
    title: definition.title,
    excerpt: definition.excerpt,
    period: definition.period,
    coverAssetId: coverAsset.id,
    pdfAssetId: pdfAsset.id,
    sortOrder: index + 1,
    status: definition.status,
    createdAt: "2026-04-26T12:00:00.000Z",
    updatedAt: "2026-04-26T12:00:00.000Z"
  });

  projectStories.push({
    projectId: definition.id,
    description: definition.description,
    role: definition.role,
    highlights: definition.highlights,
    notes: definition.notes
  });
});

export const seedDatabase: MockDatabase = {
  contentVersion: "2026-04-26T13:45:00.000Z",
  siteProfile: {
    name: "林岚",
    tagline: "产品体验设计师，擅长把复杂信息整理成清楚、有记忆点、适合招聘方快速浏览的作品表达。",
    contacts,
    resumeAssetId: "resume-pdf"
  },
  resumeMeta: {
    title: "Lin Lan Resume 2026",
    summary: "简历页以在线预览和下载并置为原则，让招聘方不必先离开页面就能快速判断是否需要保存。",
    downloadLabel: "下载简历 PDF",
    resumeAssetId: "resume-pdf"
  },
  assets,
  projects,
  projectLinks,
  projectImages,
  projectStories
};
