import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { realApi } from "../data/realApi";
import { queryKeys, useAdminProjectsQuery } from "../hooks/usePortfolioQueries";
import {
  AdminProjectPayload,
  ProjectDetail,
  ProjectStatus,
  PublicAssetRef
} from "../types/content";
import { moveItem } from "../utils/array";
import { toApiProjectStatus } from "../data/publicAdapters";

interface EditorAsset {
  assetId: string | null;
  fileName?: string;
  url?: string;
  previewUrl?: string;
}

interface ProjectEditorImage {
  id: string;
  assetId: string;
  caption: string;
  order: number;
  fileName?: string;
  url: string;
  previewUrl: string;
}

interface ProjectEditorState {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  period: string;
  status: ProjectStatus;
  description: string;
  role: string;
  highlights: string[];
  notes: string[];
  cover: EditorAsset | null;
  pdf: EditorAsset | null;
  links: Array<{ id: string; label: string; url: string; order: number }>;
  images: ProjectEditorImage[];
}

function getAssetDisplayName(asset: EditorAsset | null | undefined, emptyLabel: string) {
  if (!asset) {
    return emptyLabel;
  }

  if (asset.fileName) {
    return asset.fileName;
  }

  if (asset.url) {
    const [, fileName = ""] = asset.url.split("/").slice(-1);
    return fileName || "资源已绑定";
  }

  return "资源已绑定";
}

function getPersistedAssetId(asset: EditorAsset | null | undefined) {
  if (!asset?.assetId) {
    return null;
  }

  if (asset.assetId.startsWith("placeholder-") || asset.url?.startsWith("data:image/")) {
    return null;
  }

  return asset.assetId;
}

function toEditorAsset(asset: PublicAssetRef | null | undefined): EditorAsset | null {
  if (!asset) {
    return null;
  }

  return {
    assetId: asset.assetId,
    fileName: asset.fileName,
    url: asset.url,
    previewUrl: asset.previewUrl
  };
}

function toEditorState(project: ProjectDetail): ProjectEditorState {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    excerpt: project.excerpt,
    period: project.period,
    status: project.status,
    description: project.description,
    role: project.role ?? "",
    highlights: [...(project.highlights ?? [])],
    notes: [...(project.notes ?? [])],
    cover: toEditorAsset(project.cover),
    pdf: toEditorAsset(project.pdf),
    links: project.links.map((link) => ({ id: link.id, label: link.label, url: link.url, order: link.order })),
    images: project.images.map((image) => ({
      id: image.id,
      assetId: image.assetId,
      caption: image.caption,
      order: image.order,
      fileName: image.fileName,
      url: image.url,
      previewUrl: image.previewUrl
    }))
  };
}

function createDefaultProjectPayload(): AdminProjectPayload {
  const now = new Date();
  const period = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}`;
  const seed = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Date.now().toString(36).slice(-4)}`;

  return {
    title: "未命名作品",
    slug: `draft-${seed}`,
    excerpt: "请补充这条作品的摘要说明。",
    description: "请补充项目背景、方法、截图说明和结果。",
    period,
    role: null,
    highlights: [],
    notes: [],
    coverAssetId: null,
    pdfAssetId: null,
    status: "DRAFT",
    images: [],
    links: []
  };
}

function toProjectPayload(editor: ProjectEditorState): AdminProjectPayload {
  return {
    title: editor.title.trim(),
    slug: editor.slug.trim(),
    excerpt: editor.excerpt.trim(),
    description: editor.description.trim(),
    period: editor.period.trim(),
    role: editor.role.trim() || null,
    highlights: editor.highlights.map((item) => item.trim()).filter(Boolean),
    notes: editor.notes.map((item) => item.trim()).filter(Boolean),
    coverAssetId: getPersistedAssetId(editor.cover),
    pdfAssetId: getPersistedAssetId(editor.pdf),
    status: toApiProjectStatus(editor.status),
    images: editor.images
      .filter((image) => image.assetId)
      .map((image, index) => ({
        assetId: image.assetId,
        caption: image.caption.trim() || null,
        order: (index + 1) * 100
      })),
    links: editor.links
      .map((link) => ({
        label: link.label.trim(),
        url: link.url.trim()
      }))
      .filter((link) => link.label && link.url)
      .map((link, index) => ({
        ...link,
        order: (index + 1) * 100
      }))
  };
}

async function invalidatePortfolioQueries(queryClient: ReturnType<typeof useQueryClient>) {
  await queryClient.invalidateQueries({ queryKey: queryKeys.adminProjects });
  await queryClient.invalidateQueries({ queryKey: queryKeys.bootstrap });
  await queryClient.invalidateQueries({ queryKey: queryKeys.projects });
}

export function AdminProjectsPage() {
  const queryClient = useQueryClient();
  const projectsQuery = useAdminProjectsQuery();
  const [selectedId, setSelectedId] = useState<string>("");
  const [editor, setEditor] = useState<ProjectEditorState | null>(null);

  useEffect(() => {
    if (!selectedId && projectsQuery.data?.length) {
      setSelectedId(projectsQuery.data[0].id);
    }
  }, [projectsQuery.data, selectedId]);

  const selectedProject = useMemo(
    () => projectsQuery.data?.find((project) => project.id === selectedId) ?? null,
    [projectsQuery.data, selectedId]
  );

  useEffect(() => {
    if (projectsQuery.data?.length && selectedId && !selectedProject) {
      setSelectedId(projectsQuery.data[0].id);
      return;
    }

    if (selectedProject) {
      setEditor(toEditorState(selectedProject));
      return;
    }

    if (!projectsQuery.data?.length) {
      setEditor(null);
      setSelectedId("");
    }
  }, [projectsQuery.data, selectedProject]);

  const saveMutation = useMutation({
    mutationFn: (payload: ProjectEditorState) => realApi.updateProject(payload.id, toProjectPayload(payload)),
    onSuccess: async () => {
      await invalidatePortfolioQueries(queryClient);
    }
  });

  const createMutation = useMutation({
    mutationFn: () => realApi.createProject(createDefaultProjectPayload()),
    onSuccess: async (project) => {
      setSelectedId(project.id);
      await invalidatePortfolioQueries(queryClient);
    }
  });

  const reorderMutation = useMutation({
    mutationFn: ({ projectId, direction }: { projectId: string; direction: "up" | "down" }) => {
      const projects = projectsQuery.data ?? [];
      const currentIndex = projects.findIndex((project) => project.id === projectId);

      if (currentIndex < 0) {
        return Promise.resolve(projects);
      }

      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= projects.length) {
        return Promise.resolve(projects);
      }

      const nextOrder = moveItem(projects, currentIndex, targetIndex).map((project) => project.id);
      return realApi.reorderProjects(nextOrder);
    },
    onSuccess: async () => {
      await invalidatePortfolioQueries(queryClient);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (projectId: string) => realApi.deleteProject(projectId),
    onSuccess: async () => {
      setSelectedId("");
      await invalidatePortfolioQueries(queryClient);
    }
  });

  const assetUploadMutation = useMutation({
    mutationFn: async ({
      file,
      target
    }: {
      file: File;
      target: "cover" | "pdf" | "gallery";
    }) => {
      const asset =
        target === "pdf" ? await realApi.uploadProjectPdf(file) : await realApi.uploadImage(file);

      return { asset, target };
    },
    onSuccess: ({ asset, target }) => {
      setEditor((current) => {
        if (!current) {
          return current;
        }

        if (target === "cover") {
          return {
            ...current,
            cover: {
              assetId: asset.id,
              fileName: asset.fileName,
              url: asset.url,
              previewUrl: asset.previewUrl
            }
          };
        }

        if (target === "pdf") {
          return {
            ...current,
            pdf: {
              assetId: asset.id,
              fileName: asset.fileName,
              url: asset.url,
              previewUrl: asset.previewUrl
            }
          };
        }

        return {
          ...current,
          images: [
            ...current.images,
            {
              id: `upload-${asset.id}`,
              assetId: asset.id,
              caption: "",
              order: current.images.length + 1,
              fileName: asset.fileName,
              url: asset.url,
              previewUrl: asset.previewUrl
            }
          ]
        };
      });
    }
  });

  if (projectsQuery.isLoading) {
    return <div className="state-shell">正在读取作品管理数据...</div>;
  }

  if (projectsQuery.error) {
    return <div className="state-shell">读取作品管理数据失败：{projectsQuery.error.message}</div>;
  }

  if (!projectsQuery.data?.length) {
    return (
      <div className="state-shell">
        <p>当前还没有作品数据。</p>
        {createMutation.error ? <p className="form-error">{createMutation.error.message}</p> : null}
        <button className="button" type="button" onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
          {createMutation.isPending ? "正在创建..." : "创建第一条草稿作品"}
        </button>
      </div>
    );
  }

  if (!editor || !selectedProject) {
    return <div className="state-shell">正在准备当前作品的编辑器...</div>;
  }

  const selectedIndex = projectsQuery.data.findIndex((project) => project.id === selectedId);

  const handleAssetUpload = (target: "cover" | "pdf" | "gallery") => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    assetUploadMutation.reset();
    assetUploadMutation.mutate({ file, target });
    event.target.value = "";
  };

  const handleDeleteCurrent = () => {
    if (!selectedProject) {
      return;
    }

    if (!window.confirm(`确认删除《${selectedProject.title}》吗？这个操作会同步删除该作品记录。`)) {
      return;
    }

    deleteMutation.mutate(selectedProject.id);
  };

  return (
    <div className="admin-page-grid admin-page-grid--projects">
      <section className="admin-page-head">
        <p className="eyebrow">/admin/projects</p>
        <h1>作品管理</h1>
        <p className="muted">当前已接入真实作品列表、真实排序保存、封面图/多图/PDF 上传和项目级保存链路。</p>
      </section>

      <div className="projects-admin-layout">
        <aside className="project-list-panel">
          <div className="form-group__head">
            <strong>项目列表</strong>
            <button className="ghost-button" type="button" onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
              {createMutation.isPending ? "正在创建..." : "新增草稿"}
            </button>
          </div>

          {createMutation.error ? <p className="form-error">{createMutation.error.message}</p> : null}
          {reorderMutation.error ? <p className="form-error">{reorderMutation.error.message}</p> : null}
          {deleteMutation.error ? <p className="form-error">{deleteMutation.error.message}</p> : null}

          <div className="stack-panel">
            {projectsQuery.data.map((project, index) => (
              <article
                key={project.id}
                className={`project-list-item${project.id === selectedId ? " is-active" : ""}`}
              >
                <button className="project-list-item__select" type="button" onClick={() => setSelectedId(project.id)}>
                  <div>
                    <strong>{project.title}</strong>
                    <p>{project.period}</p>
                  </div>
                  <span className={`pill pill--${project.status}`}>{project.status}</span>
                </button>
                <div className="project-list-item__actions">
                  <button
                    className="text-button"
                    type="button"
                    disabled={index === 0 || reorderMutation.isPending}
                    onClick={() => reorderMutation.mutate({ projectId: project.id, direction: "up" })}
                  >
                    上移
                  </button>
                  <button
                    className="text-button"
                    type="button"
                    disabled={index === projectsQuery.data.length - 1 || reorderMutation.isPending}
                    onClick={() => reorderMutation.mutate({ projectId: project.id, direction: "down" })}
                  >
                    下移
                  </button>
                </div>
              </article>
            ))}
          </div>
        </aside>

        <section className="form-card">
          <div className="form-grid form-grid--two">
            <label className="field">
              <span>标题</span>
              <input value={editor.title} onChange={(event) => setEditor({ ...editor, title: event.target.value })} />
            </label>

            <label className="field">
              <span>Slug</span>
              <input value={editor.slug} onChange={(event) => setEditor({ ...editor, slug: event.target.value })} />
            </label>

            <label className="field">
              <span>项目时间</span>
              <input value={editor.period} onChange={(event) => setEditor({ ...editor, period: event.target.value })} />
            </label>

            <label className="field">
              <span>状态</span>
              <select
                value={editor.status}
                onChange={(event) => setEditor({ ...editor, status: event.target.value as ProjectStatus })}
              >
                <option value="draft">draft</option>
                <option value="published">published</option>
              </select>
            </label>
          </div>

          <label className="field">
            <span>摘要</span>
            <textarea value={editor.excerpt} onChange={(event) => setEditor({ ...editor, excerpt: event.target.value })} />
          </label>

          <label className="field">
            <span>详情简介</span>
            <textarea
              value={editor.description}
              onChange={(event) => setEditor({ ...editor, description: event.target.value })}
            />
          </label>

          <label className="field">
            <span>项目角色</span>
            <input value={editor.role} onChange={(event) => setEditor({ ...editor, role: event.target.value })} />
          </label>

          <div className="media-admin-grid">
            <section className="stack-card">
              <div className="form-group__head">
                <strong>封面图</strong>
                <span className="muted">真实上传接口</span>
              </div>
              <div className="asset-preview-card asset-preview-card--cover">
                {editor.cover?.previewUrl ? <img src={editor.cover.previewUrl} alt={editor.title} /> : <span>等待上传封面</span>}
              </div>
              <label className="field">
                <span>上传封面图</span>
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleAssetUpload("cover")} disabled={assetUploadMutation.isPending} />
              </label>
              <p className="muted">{getAssetDisplayName(editor.cover, "当前未绑定封面资源")}</p>
            </section>

            <section className="stack-card">
              <div className="form-group__head">
                <strong>项目 PDF</strong>
                <span className="muted">真实上传接口</span>
              </div>
              <label className="field">
                <span>上传项目 PDF</span>
                <input type="file" accept="application/pdf,.pdf" onChange={handleAssetUpload("pdf")} disabled={assetUploadMutation.isPending} />
              </label>
              <p className="muted">{getAssetDisplayName(editor.pdf, "当前未绑定项目 PDF")}</p>
              {editor.pdf?.url ? (
                <a className="ghost-button" href={editor.pdf.url} target="_blank" rel="noreferrer">
                  打开当前 PDF
                </a>
              ) : null}
            </section>
          </div>

          <div className="form-group">
            <div className="form-group__head">
              <strong>项目亮点</strong>
              <button
                className="ghost-button"
                type="button"
                onClick={() => setEditor({ ...editor, highlights: [...editor.highlights, ""] })}
              >
                新增亮点
              </button>
            </div>
            <div className="stack-panel">
              {editor.highlights.map((item, index) => (
                <div key={`${selectedId}-highlight-${index}`} className="inline-row">
                  <input
                    value={item}
                    onChange={(event) => {
                      const next = [...editor.highlights];
                      next[index] = event.target.value;
                      setEditor({ ...editor, highlights: next });
                    }}
                  />
                  <button
                    className="text-button"
                    type="button"
                    onClick={() =>
                      setEditor({
                        ...editor,
                        highlights: editor.highlights.filter((_, itemIndex) => itemIndex !== index)
                      })
                    }
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <div className="form-group__head">
              <strong>多个外链</strong>
              <button
                className="ghost-button"
                type="button"
                onClick={() =>
                  setEditor({
                    ...editor,
                    links: [...editor.links, { id: `link-${Date.now()}`, label: "", url: "", order: editor.links.length + 1 }]
                  })
                }
              >
                新增外链
              </button>
            </div>
            <div className="stack-panel">
              {editor.links.map((link, index) => (
                <div key={link.id} className="stack-card">
                  <input
                    value={link.label}
                    onChange={(event) => {
                      const next = [...editor.links];
                      next[index] = { ...link, label: event.target.value };
                      setEditor({ ...editor, links: next });
                    }}
                    placeholder="链接名称"
                  />
                  <input
                    value={link.url}
                    onChange={(event) => {
                      const next = [...editor.links];
                      next[index] = { ...link, url: event.target.value };
                      setEditor({ ...editor, links: next });
                    }}
                    placeholder="https://"
                  />
                  <button
                    className="text-button"
                    type="button"
                    onClick={() =>
                      setEditor({
                        ...editor,
                        links: editor.links
                          .filter((item) => item.id !== link.id)
                          .map((item, itemIndex) => ({ ...item, order: itemIndex + 1 }))
                      })
                    }
                  >
                    删除外链
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <div className="form-group__head">
              <strong>补充说明</strong>
              <button
                className="ghost-button"
                type="button"
                onClick={() => setEditor({ ...editor, notes: [...editor.notes, ""] })}
              >
                新增说明
              </button>
            </div>
            <div className="stack-panel">
              {editor.notes.map((item, index) => (
                <div key={`${selectedId}-note-${index}`} className="inline-row">
                  <input
                    value={item}
                    onChange={(event) => {
                      const next = [...editor.notes];
                      next[index] = event.target.value;
                      setEditor({ ...editor, notes: next });
                    }}
                  />
                  <button
                    className="text-button"
                    type="button"
                    onClick={() =>
                      setEditor({
                        ...editor,
                        notes: editor.notes.filter((_, itemIndex) => itemIndex !== index)
                      })
                    }
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <div className="form-group__head">
              <strong>截图说明</strong>
              <div className="button-row">
                <label className="ghost-button">
                  上传项目截图
                  <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleAssetUpload("gallery")} disabled={assetUploadMutation.isPending} hidden />
                </label>
              </div>
            </div>
            {assetUploadMutation.error ? <p className="form-error">{assetUploadMutation.error.message}</p> : null}
            <div className="stack-panel">
              {editor.images.length ? (
                editor.images.map((image, index) => (
                  <div key={image.id} className="asset-list-card">
                    <div className="asset-list-card__preview">
                      <img src={image.previewUrl} alt={image.caption || `截图 ${index + 1}`} />
                    </div>
                    <div className="asset-list-card__body">
                      <label className="field">
                        <span>截图 {index + 1}</span>
                        <textarea
                          value={image.caption}
                          onChange={(event) => {
                            const next = [...editor.images];
                            next[index] = { ...image, caption: event.target.value };
                            setEditor({ ...editor, images: next });
                          }}
                        />
                      </label>
                      <div className="button-row">
                        <span className="muted">{image.fileName ?? "已上传图片"}</span>
                        <button
                          className="text-button"
                          type="button"
                          onClick={() =>
                            setEditor({
                              ...editor,
                              images: editor.images
                                .filter((item) => item.id !== image.id)
                                .map((item, itemIndex) => ({ ...item, order: itemIndex + 1 }))
                            })
                          }
                        >
                          删除截图
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="muted">当前还没有上传项目截图。</p>
              )}
            </div>
          </div>

          {saveMutation.isSuccess ? <p className="form-success">当前作品已保存到真实接口。</p> : null}
          {saveMutation.error ? <p className="form-error">{saveMutation.error.message}</p> : null}

          <div className="button-row button-row--spread">
            <div className="button-row">
              <button
                className="button"
                type="button"
                disabled={saveMutation.isPending}
                onClick={() => saveMutation.mutate(editor)}
              >
                {saveMutation.isPending ? "保存中..." : "保存当前作品"}
              </button>
              <button className="ghost-button" type="button" onClick={handleDeleteCurrent} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? "删除中..." : "删除当前作品"}
              </button>
            </div>

            <span className="muted">当前排序位置：第 {selectedIndex + 1} 位</span>
          </div>
        </section>
      </div>
    </div>
  );
}
