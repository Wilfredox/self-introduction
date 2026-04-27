import { AccentTone, ProjectDetail } from "../types/content";
import { createImageAsset, createPdfAsset, createStoryboardAsset } from "./placeholders";

export interface PortfolioProjectEntry extends ProjectDetail {
  featuredOnHome: boolean;
}

interface ProjectDefinition {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  period: string;
  tone: AccentTone;
  role?: string;
  description: string;
  highlights?: string[];
  notes?: string[];
  links: Array<{ label: string; url: string }>;
  imageCaptions: string[];
  featuredOnHome?: boolean;
}

function createProject(definition: ProjectDefinition): PortfolioProjectEntry {
  const cover = createImageAsset(
    `${definition.id}-cover`,
    definition.title,
    definition.period,
    definition.tone,
    definition.role ?? "Selected Work"
  );

  return {
    id: definition.id,
    slug: definition.slug,
    title: definition.title,
    excerpt: definition.excerpt,
    period: definition.period,
    description: definition.description,
    role: definition.role,
    highlights: definition.highlights,
    notes: definition.notes,
    cover,
    pdf: createPdfAsset(`${definition.id}-pdf`, `${definition.slug}.pdf`),
    links: definition.links.map((link, index) => ({
      id: `${definition.id}-link-${index + 1}`,
      label: link.label,
      url: link.url
    })),
    images: definition.imageCaptions.map((caption, index) => {
      const visual = createStoryboardAsset(
        `${definition.id}-image-${index + 1}`,
        definition.title,
        definition.tone,
        `截图 ${index + 1} / ${caption}`
      );

      return {
        id: `${definition.id}-image-${index + 1}`,
        assetId: visual.assetId,
        fileName: visual.fileName,
        url: visual.url,
        previewUrl: visual.previewUrl,
        caption
      };
    }),
    featuredOnHome: definition.featuredOnHome ?? true
  };
}

export const portfolioProjects: PortfolioProjectEntry[] = [
  createProject({
    id: "hydra",
    slug: "hydra-ops-console",
    title: "Hydra Ops 控制台",
    excerpt: "把复杂监控改成一眼能读懂的层级：目标、状态、动作，控制台从工具感变成叙事感。",
    period: "2025.01 - 2025.04",
    tone: "olive",
    role: "产品体验 / 信息架构 / 设计交付",
    description:
      "这是一个面向复杂运维场景的控制台重构项目。设计重点不是堆功能，而是把状态、动作与后果放进同一条阅读链路，让第一次进入页面的人也能迅速判断系统当前局面。",
    highlights: ["首屏任务聚焦", "告警路径压缩", "桌面端主导布局"],
    notes: ["适合展示复杂信息整理能力。", "首页放大态会把作品入口放在第一行。"],
    links: [
      { label: "在线案例页", url: "https://portfolio.example/hydra" },
      { label: "交互稿预览", url: "https://figma.example/hydra" }
    ],
    imageCaptions: ["首屏聚焦在最关键的状态与动作。", "告警编排改成并列关系，减少跨模块跳转。"]
  }),
  createProject({
    id: "atelier",
    slug: "atelier-portfolio-refresh",
    title: "Atelier 作品站改版",
    excerpt: "中文杂志感版式配合大图留白，让作品不是平铺罗列，而是按阅读节奏展开。",
    period: "2024.05 - 2024.08",
    tone: "rust",
    role: "视觉系统 / 排版方向 / 前端协作",
    description:
      "这个项目更强调刊物感排版、题头秩序和图文呼吸感。页面不靠花哨组件取胜，而是通过克制的留白、标题层级与大图比例，把阅读节奏真正做出来。",
    highlights: ["题头强化", "中英混排", "首屏识别高"],
    notes: ["适合强调审美判断与品牌气质。", "详情页保留 PDF 区块，方便承载提案材料。"],
    links: [
      { label: "线上站点", url: "https://portfolio.example/atelier" },
      { label: "视觉提案", url: "https://docs.example/atelier" }
    ],
    imageCaptions: ["把刊头、题签和卡片间距做成统一秩序。", "用更克制的色彩让作品图成为主角。"]
  }),
  createProject({
    id: "memo",
    slug: "memo-content-platform",
    title: "Memo 内容产品",
    excerpt: "把长内容拆成轻重量级阅读层次，读者既能快速扫，也能沉浸式看完整故事。",
    period: "2025.06 - 2025.09",
    tone: "slate",
    role: "交互策略 / 组件规范 / 可用性迭代",
    description:
      "内容型项目既要照顾导语和重点提炼，也要保证深度阅读时的节奏稳定。所以详情页采用分区块结构，把摘要、截图说明和长段叙事拆开，而不是全部塞进单一正文里。",
    highlights: ["长文导航", "截图说明", "移动端阅读节奏"],
    notes: ["适合突出系统思考和内容型项目经验。", "移动端会从双栏回退为单栏阅读。"],
    links: [
      { label: "产品首页", url: "https://portfolio.example/memo" },
      { label: "阅读稿", url: "https://docs.example/memo" }
    ],
    imageCaptions: ["阅读节奏从概览、重点到深读逐步递进。", "卡片和正文模块共享同一套内容摘要字段。"]
  }),
  createProject({
    id: "signal",
    slug: "signal-hiring-feature",
    title: "Signal 招聘专题页",
    excerpt: "把抽象的组织能力转译成结构清楚、短时间内可读完的专题体验。",
    period: "2023.09 - 2023.11",
    tone: "charcoal",
    role: "页面策划 / 内容编辑 / 视觉梳理",
    description:
      "这个案例更接近个人作品集的使用场景，核心目标是让阅读者在几分钟内完成“理解角色、看到证据、决定是否深入”的完整判断，因此特别重视信息前置和下载动作的位置安排。",
    highlights: ["短链路叙事", "关键信息前置", "下载动作强化"],
    notes: ["适合展示面向招聘场景的内容组织能力。", "首页亮点不能干扰作品入口和简历下载入口。"],
    links: [
      { label: "专题页面", url: "https://portfolio.example/signal" },
      { label: "归档 PDF", url: "https://docs.example/signal" }
    ],
    imageCaptions: ["用更短链路的叙事把抽象能力转成页面证据。", "将下载按钮保持在用户不会错过的位置。"]
  }),
  createProject({
    id: "field",
    slug: "field-crm-workbench",
    title: "Field CRM 工作台",
    excerpt: "不靠炫技，而是靠稳定层级与轻提示让复杂业务界面看起来专业、安静、能干活。",
    period: "2024.01 - 2024.04",
    tone: "marine",
    role: "企业系统布局 / 表单规范 / 状态设计",
    description:
      "这是一个偏务实型的业务工作台案例。项目重点在于信息密度的平衡、高频操作位的安排，以及在不牺牲效率的前提下，让界面保持可读与耐看。",
    highlights: ["低干扰布局", "批量操作位", "信息密度平衡"],
    notes: ["适合说明你也能处理偏业务型系统界面。", "案例重点在秩序感，而不是华丽视觉。"],
    links: [
      { label: "系统预览", url: "https://portfolio.example/field" },
      { label: "流程说明", url: "https://docs.example/field" }
    ],
    imageCaptions: ["把高频操作放在更顺手的位置，减少回看。", "信息密度收住以后，状态判断更稳定。"]
  }),
  createProject({
    id: "folio",
    slug: "folio-resume-system",
    title: "Folio 简历系统",
    excerpt: "在线预览与下载动作并置，既能浏览，也能快速带走关键信息。",
    period: "2025.02 - 2025.03",
    tone: "sand",
    role: "履历结构 / 文档可视化 / 导出体验",
    description:
      "这个项目关注的是履历信息如何被更轻松地阅读和保存。页面把在线预览、下载动作和摘要说明放进同一屏里，让查看者不用猜“完整资料在哪里”。",
    highlights: ["双栏履历", "PDF 预览", "下载转化明确"],
    notes: ["适合体现内容整理与信息可视化能力。", "对当前个人作品集的简历页也有直接启发。"],
    links: [
      { label: "模块说明", url: "https://portfolio.example/folio" },
      { label: "交付文档", url: "https://docs.example/folio" }
    ],
    imageCaptions: ["预览和下载并置，不让用户先猜按钮在哪。", "PDF 容器结构尽量稳定，保证长文档查看体验。"]
  })
];
