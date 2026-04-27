import { AccentTone, ProjectDetail, PublicAssetRef } from "../types/content";
import { createStaticAsset, createStoryboardAsset } from "./placeholders";

export interface PortfolioProjectEntry extends ProjectDetail {
  featuredOnHome: boolean;
}

interface ProjectImageDefinition {
  asset?: PublicAssetRef;
  caption: string;
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
  links?: Array<{ label: string; url: string }>;
  coverAsset?: PublicAssetRef;
  pdfAsset?: PublicAssetRef | null;
  downloadAsset?: PublicAssetRef | null;
  downloadLabel?: string;
  imageAssets?: ProjectImageDefinition[];
  featuredOnHome?: boolean;
}

function createProject(definition: ProjectDefinition): PortfolioProjectEntry {
  const cover =
    definition.coverAsset ??
    createImageAsset(
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
    pdf: definition.pdfAsset ?? null,
    downloadAsset: definition.downloadAsset ?? null,
    downloadLabel: definition.downloadLabel,
    links: (definition.links ?? []).map((link, index) => ({
      id: `${definition.id}-link-${index + 1}`,
      label: link.label,
      url: link.url
    })),
    images: (definition.imageAssets ?? []).map((image, index) => {
      const asset =
        image.asset ??
        createStoryboardAsset(
          `${definition.id}-image-${index + 1}`,
          definition.title,
          definition.tone,
          `截图 ${index + 1} / ${image.caption}`
        );

      return {
        id: `${definition.id}-image-${index + 1}`,
        assetId: asset.assetId,
        fileName: asset.fileName,
        url: asset.url,
        previewUrl: asset.previewUrl,
        caption: image.caption
      };
    }),
    featuredOnHome: definition.featuredOnHome ?? true
  };
}

const waterDailyImage = createStaticAsset(
  "water-daily-image",
  "cover.png",
  "projects/water-daily/cover.png",
  "image/png"
);

const xajCoverImage = createStaticAsset(
  "xaj-cover",
  "cover.png",
  "projects/xaj-model/cover.png",
  "image/png"
);

const mike11CoverImage = createStaticAsset(
  "mike11-cover",
  "cover.png",
  "projects/mike11-network/cover.png",
  "image/png"
);

const hydrologyCoverImage = createStaticAsset(
  "hydrology-cover",
  "cover.png",
  "projects/hydrology-design-flood/cover.png",
  "image/png"
);

const xajSlidesAsset = createStaticAsset(
  "xaj-slides",
  "xinanjiang-model-slides.pptx",
  "projects/xaj-model/xinanjiang-model-slides.pptx",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation"
);

const mike11ReportAsset = createStaticAsset(
  "mike11-report",
  "mike11-ring-network-report.docx",
  "projects/mike11-network/mike11-ring-network-report.docx",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
);

const hydrologyReportAsset = createStaticAsset(
  "hydrology-report",
  "hydrology-design-flood-report.pdf",
  "projects/hydrology-design-flood/hydrology-design-flood-report.pdf",
  "application/pdf"
);

const mike21ReportAsset = createStaticAsset(
  "mike21-report",
  "mike21-calibration-report.docx",
  "projects/mike21-calibration/mike21-calibration-report.docx",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
);

const mike21OverviewImage = createStaticAsset(
  "mike21-overview",
  "result-overview.png",
  "projects/mike21-calibration/result-overview.png",
  "image/png"
);

const mike21BoundaryImage = createStaticAsset(
  "mike21-boundary",
  "boundary-conditions.png",
  "projects/mike21-calibration/boundary-conditions.png",
  "image/png"
);

const mike21ManningImage = createStaticAsset(
  "mike21-manning",
  "manning-parameter.png",
  "projects/mike21-calibration/manning-parameter.png",
  "image/png"
);

const arcgisMapImage = createStaticAsset(
  "arcgis-map",
  "wuyin-irrigation-map.jpg",
  "projects/arcgis-irrigation/wuyin-irrigation-map.jpg",
  "image/jpeg"
);

const arcgisLayoutPdf = createStaticAsset(
  "arcgis-layout",
  "wuyin-irrigation-layout.pdf",
  "projects/arcgis-irrigation/wuyin-irrigation-layout.pdf",
  "application/pdf"
);

const villaSheet1Asset = createStaticAsset(
  "villa-sheet-1",
  "villa-sheet-1.pdf",
  "projects/villa-bim/villa-sheet-1.pdf",
  "application/pdf"
);

const villaSheet2Asset = createStaticAsset(
  "villa-sheet-2",
  "villa-sheet-2.pdf",
  "projects/villa-bim/villa-sheet-2.pdf",
  "application/pdf"
);

const villaBimCover = createStaticAsset(
  "villa-bim-cover",
  "cover.png",
  "projects/villa-bim/cover.png",
  "image/png"
);

const guizhouCadPdfAsset = createStaticAsset(
  "guizhou-cad-pdf",
  "guizhou-changzheng-cad.pdf",
  "projects/guizhou-cad/guizhou-changzheng-cad.pdf",
  "application/pdf"
);

const guizhouCadCover = createStaticAsset(
  "guizhou-cad-cover",
  "cover.png",
  "projects/guizhou-cad/cover.png",
  "image/png"
);

const damComponent1Asset = createStaticAsset(
  "dam-component-1",
  "dam-component-1.png",
  "projects/dam-bim/dam-component-1.png",
  "image/png"
);

const damComponent2Asset = createStaticAsset(
  "dam-component-2",
  "dam-component-2.png",
  "projects/dam-bim/dam-component-2.png",
  "image/png"
);

const damFamilyAsset = createStaticAsset(
  "dam-component-family",
  "dam-component-family.rfa",
  "projects/dam-bim/dam-component-family.rfa",
  "application/octet-stream"
);

export const portfolioProjects: PortfolioProjectEntry[] = [
  createProject({
    id: "water-daily",
    slug: "water-daily-site",
    title: "水利行业日报展示网站",
    excerpt: "用 AI 辅助开发把水利资讯整理成日更静态站，兼顾每日发布、历史归档和公开可访问性。",
    period: "2026.04",
    tone: "olive",
    role: "独立开发 / 内容整理 / GitHub Pages 发布",
    description:
      "这个项目更接近我把技术和信息整理结合起来的一次快速实践。我基于 AI 辅助开发搭建了一个面向水利行业的日报展示网站，用 GitHub Pages 公开发布，让每日信息更新和历史归档形成一条轻量但完整的工作链路。",
    highlights: ["AI 辅助开发", "GitHub Pages 发布", "日更归档机制"],
    notes: ["这个项目适合放在第一页，能快速说明我会把内容和技术一起落地。"],
    links: [{ label: "在线网站", url: "https://wilfredox.github.io/water-daily" }],
    coverAsset: waterDailyImage,
    imageAssets: [{ asset: waterDailyImage, caption: "历史日报列表、月份筛选和公开访问页已经能完整说明这个站点的内容组织方式。" }]
  }),
  createProject({
    id: "xaj-model",
    slug: "xinanjiang-fortran-model",
    title: "新安江模型 Fortran 开发",
    excerpt: "围绕产汇流计算和输入读取，独立完成 Fortran 模型开发与调试，贴近实际水文计算场景。",
    period: "2026.01 - 2026.02",
    tone: "charcoal",
    role: "Fortran 开发 / 模型调试 / 水文计算",
    description:
      "这部分材料来自实习和模型整理成果。我围绕新安江模型完成了 Fortran 代码实现与调试，处理输入读取、参数组织和产汇流计算流程，并配合业务系统联调，确保模型输出能落回真实工程计算场景。",
    highlights: ["Fortran 模型开发", "产汇流计算", "业务系统联调"],
    notes: ["如果后面把源代码仓库也整理出来，这个项目会更完整。"],
    links: [{ label: "模型讲解 PPT", url: xajSlidesAsset.url }],
    downloadAsset: xajSlidesAsset,
    downloadLabel: "下载模型讲解 PPT",
    coverAsset: xajCoverImage,
    imageAssets: [{ asset: xajCoverImage, caption: "结果页保留了 NSE、RMSE、R² 以及洪峰误差等指标，能直接体现模型率定效果。" }]
  }),
  createProject({
    id: "mike11-network",
    slug: "mike11-ring-network",
    title: "数字化水网构建课程设计（MIKE 11）",
    excerpt: "针对 10 条河道组成的环状河网，独立完成一维非恒定流模型搭建、边界设置与结果分析。",
    period: "2025.09 - 2026.01",
    tone: "rust",
    role: "一维水动力建模 / 河网拓扑 / 结果分析",
    description:
      "我以一个包含 10 条河道的环状河网为对象，使用 MIKE 11 搭建一维非恒定流水动力模型，完成河网拓扑、断面参数、边界条件和时间控制的配置，并对 24 小时模拟结果中的水位、流量分配和异常波动进行分析。",
    highlights: ["环状河网拓扑", "24 小时非恒定流模拟", "断面与边界条件配置"],
    notes: ["这类项目很能说明我对数字化水网构建流程的掌握程度。"],
    links: [{ label: "课程报告 DOCX", url: mike11ReportAsset.url }],
    downloadAsset: mike11ReportAsset,
    downloadLabel: "下载 MIKE 11 课程报告",
    coverAsset: mike11CoverImage,
    imageAssets: [{ asset: mike11CoverImage, caption: "时序流量结果截图能直观看到多支流在初始波动后逐步收敛到稳定状态。" }]
  }),
  createProject({
    id: "design-flood",
    slug: "hydrology-design-flood",
    title: "工程水文学课程设计：汤浦水库设计洪水",
    excerpt: "基于暴雨资料完成设计暴雨、产汇流与设计洪水推求，把工程水文计算链路完整跑通。",
    period: "2025.09 - 2026.01",
    tone: "marine",
    role: "水文计算 / 设计暴雨 / 设计洪水",
    description:
      "这个项目围绕汤浦水库设计洪水推求展开。我基于实测暴雨资料完成流域概况整理、面雨量统计、设计暴雨计算以及产流汇流分析，并最终形成完整的设计洪水结果与课程报告。",
    highlights: ["PIII 曲线适线法", "单位线法产汇流", "洪峰与时程分配"],
    links: [{ label: "课程报告 PDF", url: hydrologyReportAsset.url }],
    pdfAsset: hydrologyReportAsset,
    downloadAsset: hydrologyReportAsset,
    downloadLabel: "下载水文课设报告",
    coverAsset: hydrologyCoverImage,
    imageAssets: [{ asset: hydrologyCoverImage, caption: "P3 曲线与参数试算界面截图能直接说明我做过频率分析、设计暴雨和洪水推求这一整条链路。" }]
  }),
  createProject({
    id: "mike21-calibration",
    slug: "mike21-hydrodynamic-calibration",
    title: "二维水动力模型率定（MIKE 21）",
    excerpt: "围绕 Øresund 海峡案例比较不同曼宁系数下的水位与流速拟合结果，完成率定记录与误差评估。",
    period: "2025.12",
    tone: "slate",
    role: "二维水动力 / 参数率定 / 结果对比",
    description:
      "这个项目使用 MIKE 21 对 Øresund 海峡连接工程案例进行二维水动力模拟与参数率定。我对比不同曼宁系数组合下的水位和流速曲线，结合 RMSE 对拟合质量进行评估，并整理了边界条件、初始水位和参数调整理由。",
    highlights: ["曼宁系数率定", "水位与流速对比", "RMSE 误差评估"],
    links: [{ label: "率定报告 DOCX", url: mike21ReportAsset.url }],
    coverAsset: mike21OverviewImage,
    downloadAsset: mike21ReportAsset,
    downloadLabel: "下载 MIKE 21 报告",
    imageAssets: [
      { asset: mike21OverviewImage, caption: "同一组率定结果里同时对比水位、速度分量和流速变化。" },
      { asset: mike21BoundaryImage, caption: "边界条件配置是这类二维模型里很核心的一层。 " },
      { asset: mike21ManningImage, caption: "通过调整曼宁系数观察拟合变化，并据此记录率定理由。" }
    ]
  }),
  createProject({
    id: "arcgis-irrigation",
    slug: "arcgis-wuyin-irrigation",
    title: "乌引灌区 ArcGIS 一张图",
    excerpt: "把灌区点、线、面数据整理成一张能读、能讲、能作为成果附件的总览图。",
    period: "2025.06",
    tone: "sand",
    role: "ArcGIS 矢量化 / 拓扑修复 / 制图表达",
    description:
      "这个项目来自 ArcGIS 期末作业整理。我围绕乌引灌区完成了点线面要素矢量化、拓扑修复和一张图表达，最终输出可以直接展示灌区结构、节点设施和主干线关系的成果附件。",
    highlights: ["点线面矢量化", "拓扑修复", "一张图成果表达"],
    links: [{ label: "一张图 PDF", url: arcgisLayoutPdf.url }],
    coverAsset: arcgisMapImage,
    pdfAsset: arcgisLayoutPdf,
    downloadAsset: arcgisLayoutPdf,
    downloadLabel: "下载 ArcGIS 成果图",
    imageAssets: [{ asset: arcgisMapImage, caption: "用一张总览图把灌区主要设施、干渠和节点关系压到一个成果表达里。" }]
  }),
  createProject({
    id: "villa-bim",
    slug: "villa-bim-drawings",
    title: "欧式别墅 BIM 图纸整合",
    excerpt: "把平面、剖面、立面和窗表整理成一套完整图纸，强调建筑表达的完整性与制图秩序。",
    period: "2025.04",
    tone: "rust",
    role: "BIM 建模 / 建筑制图 / 图纸整理",
    description:
      "这组材料以欧式别墅为对象，完成了平面、剖面、立面与窗明细等图纸表达，适合用来展示我在建筑图纸排布、比例控制和图纸信息组织上的基本功。当前站内保留了两张主要图纸作为附件，后续如果补充导出的页面截图，展示会更完整。",
    highlights: ["平面与剖面表达", "立面与窗表整理", "建筑图纸信息排布"],
    links: [
      { label: "图纸一", url: villaSheet1Asset.url },
      { label: "图纸二", url: villaSheet2Asset.url }
    ],
    coverAsset: villaBimCover,
    pdfAsset: villaSheet1Asset,
    downloadAsset: villaSheet1Asset,
    downloadLabel: "下载别墅图纸一",
    imageAssets: [{ asset: villaBimCover, caption: "这一张图同时包含平面、人视点和剖面表达，足够代表整套别墅 BIM 图纸的制图完成度。" }]
  }),
  createProject({
    id: "guizhou-cad",
    slug: "guizhou-changzheng-cad",
    title: "贵州长征电站 CAD 图纸整理",
    excerpt: "围绕贵州长征电站图纸做成果归档，作为工程制图与水工图纸理解的一次集中展示。",
    period: "2023.12",
    tone: "charcoal",
    role: "工程制图 / 图纸归档 / 水工图纸理解",
    description:
      "这份 CAD 图纸材料目前以 PDF 归档的方式保留下来，主要用于呈现我在工程图纸阅读、整理与成果留存上的基础能力。它更像是一份图纸归档型作品：内容本身偏工程表达，价值在于制图尺度、图纸规范和对水工结构关系的理解。",
    highlights: ["工程制图基础", "图纸归档整理", "水工结构理解"],
    coverAsset: guizhouCadCover,
    pdfAsset: guizhouCadPdfAsset,
    downloadAsset: guizhouCadPdfAsset,
    downloadLabel: "下载 CAD 图纸",
    imageAssets: [{ asset: guizhouCadCover, caption: "剖面图截图能更直接体现电站图纸的工程表达方式，也方便和原始 CAD 附件对应查看。" }]
  }),
  createProject({
    id: "dam-bim",
    slug: "dam-bim-components",
    title: "水工大坝 BIM 构件建模",
    excerpt: "围绕水工构件做基础 BIM 建模，保留了两个角度的构件视图和可下载族文件。",
    period: "2025.04",
    tone: "sand",
    role: "BIM 构件建模 / 水工结构表达",
    description:
      "这组材料更适合展示我在 BIM 构件层面的动手能力。当前保留了两个角度的构件视图和可下载族文件，重点不是复杂渲染，而是把构件形体、结构关系和建模逻辑表达清楚。",
    highlights: ["水工构件建模", "多角度视图", "族文件输出"],
    coverAsset: damComponent1Asset,
    downloadAsset: damFamilyAsset,
    downloadLabel: "下载构件族文件",
    imageAssets: [
      { asset: damComponent1Asset, caption: "第一个视角更适合看整体轮廓和前侧结构关系。" },
      { asset: damComponent2Asset, caption: "第二个视角补充后部形体与构件转折细节。" }
    ]
  })
];
