const portfolioItems = [
  {
    id: "hydra",
    slug: "hydra-ops-console",
    title: "Hydra Ops 控制台",
    year: "2025",
    period: "2025.01 - 2025.04",
    type: "B2B 仪表盘",
    tone: "olive",
    link: "https://portfolio.example/hydra",
    detailUrl: "project.html?slug=hydra-ops-console",
    summary: "把复杂监控改成招聘方一眼能看懂的层级：目标、状态、动作，控制台从工具感变成叙事感。",
    role: "产品体验 / 信息架构 / 设计交付",
    highlights: ["首屏任务聚焦", "告警路径压缩", "桌面端主导布局"],
    note: "适合展示你对复杂信息的收束能力。"
  },
  {
    id: "atelier",
    slug: "atelier-portfolio-refresh",
    title: "Atelier 作品站改版",
    year: "2024",
    period: "2024.05 - 2024.08",
    type: "品牌官网",
    tone: "rust",
    link: "https://portfolio.example/atelier",
    detailUrl: "project.html?slug=atelier-portfolio-refresh",
    summary: "中文杂志感版式配合大图留白，让作品不是平铺罗列，而是按阅读节奏展开。",
    role: "视觉系统 / 排版方向 / 前端协作",
    highlights: ["题头强化", "中英混排", "首屏识别高"],
    note: "适合强调审美判断与品牌气质。"
  },
  {
    id: "memo",
    slug: "memo-content-platform",
    title: "Memo 内容产品",
    year: "2025",
    period: "2025.06 - 2025.09",
    type: "内容平台",
    tone: "slate",
    link: "https://portfolio.example/memo",
    detailUrl: "project.html?slug=memo-content-platform",
    summary: "把长内容拆成轻重量级阅读层次，读者既能快速扫，也能沉浸式看完整故事。",
    role: "交互策略 / 组件规范 / 可用性迭代",
    highlights: ["长文导航", "截图说明", "移动端阅读节奏"],
    note: "适合突出系统思考和内容型项目经验。"
  },
  {
    id: "signal",
    slug: "signal-hiring-feature",
    title: "Signal 招聘专题页",
    year: "2023",
    period: "2023.09 - 2023.11",
    type: "专题页",
    tone: "charcoal",
    link: "https://portfolio.example/signal",
    detailUrl: "project.html?slug=signal-hiring-feature",
    summary: "把抽象的组织能力转译成结构清楚、短时间内可读完的招聘专题体验。",
    role: "页面策划 / 内容编辑 / 视觉梳理",
    highlights: ["短链路叙事", "关键信息前置", "下载动作强化"],
    note: "适合展示面向招聘方的理解。"
  },
  {
    id: "field",
    slug: "field-crm-workbench",
    title: "Field CRM 工作台",
    year: "2024",
    period: "2024.01 - 2024.04",
    type: "管理后台",
    tone: "marine",
    link: "https://portfolio.example/field",
    detailUrl: "project.html?slug=field-crm-workbench",
    summary: "不靠炫技，而是靠稳定层级与轻提示让后台看起来专业、安静、能干活。",
    role: "后台布局 / 表单规范 / 状态设计",
    highlights: ["低干扰布局", "批量操作位", "信息密度平衡"],
    note: "适合说明你也能处理务实型界面。"
  },
  {
    id: "folio",
    slug: "folio-resume-system",
    title: "Folio 简历系统",
    year: "2025",
    period: "2025.02 - 2025.03",
    type: "简历与文档",
    tone: "sand",
    link: "https://portfolio.example/folio",
    detailUrl: "project.html?slug=folio-resume-system",
    summary: "在线预览与下载动作并置，既能浏览，也能快速带走关键信息。",
    role: "履历结构 / 文档可视化 / 导出体验",
    highlights: ["双栏履历", "PDF 预览", "下载转化明确"],
    note: "适合体现你的内容整理能力。"
  }
];

const homeLayouts = {
  a: [
    { x: 15, y: 30, rotate: -7, width: 250 },
    { x: 39, y: 20, rotate: 5, width: 220 },
    { x: 64, y: 38, rotate: -3, width: 265 },
    { x: 84, y: 26, rotate: 8, width: 205 },
    { x: 24, y: 69, rotate: 4, width: 215 },
    { x: 55, y: 73, rotate: -5, width: 235 }
  ],
  b: [
    { x: 12, y: 22, rotate: -2, width: 228 },
    { x: 33, y: 58, rotate: 6, width: 206 },
    { x: 52, y: 18, rotate: -4, width: 245 },
    { x: 69, y: 52, rotate: 3, width: 230 },
    { x: 84, y: 24, rotate: -7, width: 208 },
    { x: 88, y: 72, rotate: 2, width: 220 }
  ],
  c: [
    { x: 18, y: 38, rotate: -8, width: 210 },
    { x: 38, y: 22, rotate: 2, width: 248 },
    { x: 59, y: 48, rotate: -1, width: 290 },
    { x: 79, y: 30, rotate: 6, width: 194 },
    { x: 32, y: 74, rotate: 5, width: 205 },
    { x: 73, y: 76, rotate: -6, width: 208 }
  ]
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function createWorkCard(item, layout) {
  return `
    <button
      class="work-card"
      type="button"
      data-work-id="${item.id}"
      data-work-slug="${item.slug}"
      style="left:${layout.x}%; top:${layout.y}%; width:${layout.width}px; --card-rotation:${layout.rotate}deg;"
      aria-label="查看 ${item.title}"
    >
      <div class="work-card__cover" data-tone="${item.tone}">
        <div class="cover-stage"></div>
      </div>
      <div class="work-card__meta">
        <span class="work-card__year">${item.year}</span>
        <p class="work-card__title">${item.title}</p>
        <span class="work-card__label">${item.type}</span>
      </div>
    </button>
  `;
}

function createDetailMarkup(item, variant) {
  const sideNote =
    variant === "b"
      ? "在首页右侧形成独立阅读层，不离开首页即可继续看下一个项目。"
      : variant === "c"
        ? "以居中展开的方式保留画布整体气氛，适合更克制的杂志感。"
        : "放大后像翻开作品卡片，招聘方先看到链接，再进入项目概览。";

  return `
    <div class="canvas-backdrop" data-close-overlay="true"></div>
    <article class="detail-panel" data-overlay-panel>
      <button class="detail-panel__close ghost-button" type="button" data-close-overlay="true" aria-label="关闭">×</button>
      <a class="detail-panel__link" href="${item.link}" target="_blank" rel="noreferrer">作品链接 / ${item.link.replace("https://", "")}</a>
      <div class="detail-panel__body">
        <div class="detail-panel__visual">
          <div class="detail-panel__visual-badge">${item.type}</div>
          <div class="detail-panel__visual-copy">
            <strong>${item.title}</strong>
            <span>${item.period}</span>
          </div>
        </div>
        <div class="detail-panel__content">
          <header class="detail-panel__header">
            <h2 class="headline-lg">${item.title}</h2>
            <p class="lead">${item.summary}</p>
          </header>
          <div class="detail-panel__meta">
            <span>${item.year}</span>
            <span>${item.period}</span>
            <span>${item.role}</span>
          </div>
          <div class="detail-panel__tags">
            ${item.highlights.map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </div>
          <p class="muted">${item.note}</p>
          <p class="muted">${sideNote}</p>
          <div class="detail-panel__actions">
            <a class="button" href="${item.detailUrl}">进入详情页</a>
            <a class="ghost-button" href="${item.link}" target="_blank" rel="noreferrer">打开真实项目</a>
          </div>
        </div>
      </div>
    </article>
  `;
}

function updateProjectQuery(slug) {
  const url = new URL(window.location.href);
  if (slug) {
    url.searchParams.set("project", slug);
  } else {
    url.searchParams.delete("project");
  }
  window.history.replaceState({}, "", url);
}

function initCollageShell(shell) {
  const variant = shell.dataset.variant;
  const viewport = shell.querySelector(".collage-viewport");
  const track = shell.querySelector(".collage-track");
  const overlay = shell.querySelector(".canvas-overlay");
  const controls = shell.querySelectorAll("[data-zoom]");
  const layouts = homeLayouts[variant];
  let scale = 1;
  let x = 0;
  let y = 0;
  let pointerId = null;
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;
  let dragMoved = false;
  let activeCard = null;

  track.innerHTML = portfolioItems
    .slice(0, layouts.length)
    .map((item, index) => createWorkCard(item, layouts[index]))
    .join("");

  const applyTransform = () => {
    track.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  };

  const openItem = (slug) => {
    const item = portfolioItems.find((entry) => entry.slug === slug);
    if (!item) {
      return;
    }
    const nextCard = track.querySelector(`[data-work-slug="${slug}"]`);
    if (activeCard && activeCard !== nextCard) {
      activeCard.classList.remove("is-active");
    }
    activeCard = nextCard;
    activeCard?.classList.add("is-active");
    overlay.innerHTML = createDetailMarkup(item, variant);
    overlay.classList.add("is-open");
    updateProjectQuery(slug);
  };

  const closeOverlay = () => {
    overlay.classList.remove("is-open");
    overlay.innerHTML = "";
    activeCard?.classList.remove("is-active");
    activeCard = null;
    updateProjectQuery("");
  };

  applyTransform();

  viewport.addEventListener(
    "wheel",
    (event) => {
      if (event.target.closest(".detail-panel")) {
        return;
      }
      event.preventDefault();
      const next = scale + (event.deltaY < 0 ? 0.08 : -0.08);
      scale = clamp(next, 0.84, 1.9);
      applyTransform();
    },
    { passive: false }
  );

  viewport.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".work-card") || event.target.closest(".detail-panel") || event.target.closest(".home-canvas__toolbar")) {
      return;
    }
    pointerId = event.pointerId;
    dragging = true;
    dragMoved = false;
    startX = event.clientX;
    startY = event.clientY;
    originX = x;
    originY = y;
    viewport.classList.add("is-dragging");
    viewport.setPointerCapture(pointerId);
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!dragging || event.pointerId !== pointerId) {
      return;
    }
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      dragMoved = true;
    }
    x = originX + dx;
    y = originY + dy;
    applyTransform();
  });

  const endDrag = (event) => {
    if (!dragging || event.pointerId !== pointerId) {
      return;
    }
    dragging = false;
    viewport.classList.remove("is-dragging");
    try {
      viewport.releasePointerCapture(pointerId);
    } catch (error) {
      // Ignore pointer capture mismatches from fast taps.
    }
    pointerId = null;
  };

  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);

  controls.forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.zoom;
      if (mode === "in") {
        scale = clamp(scale + 0.12, 0.84, 1.9);
      } else if (mode === "out") {
        scale = clamp(scale - 0.12, 0.84, 1.9);
      } else {
        scale = 1;
        x = 0;
        y = 0;
      }
      applyTransform();
    });
  });

  track.querySelectorAll(".work-card").forEach((card) => {
    card.addEventListener("click", () => {
      if (dragMoved) {
        dragMoved = false;
        return;
      }
      openItem(card.dataset.workSlug);
    });
  });

  overlay.addEventListener("click", (event) => {
    if (!event.target.closest("[data-close-overlay]")) {
      return;
    }
    closeOverlay();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeOverlay();
    }
  });

  const currentSlug = new URL(window.location.href).searchParams.get("project");
  if (currentSlug) {
    openItem(currentSlug);
  }
}

function initAdminTabs() {
  const buttons = document.querySelectorAll("[data-admin-target]");
  const panels = document.querySelectorAll("[data-admin-panel]");
  if (!buttons.length) {
    return;
  }

  const activate = (target) => {
    buttons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.adminTarget === target);
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.adminPanel !== target;
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => activate(button.dataset.adminTarget));
  });

  activate(buttons[0].dataset.adminTarget);
}

document.querySelectorAll(".collage-shell").forEach(initCollageShell);
initAdminTabs();
