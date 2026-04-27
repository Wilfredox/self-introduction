import { ChangeEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PdfPreview } from "../components/PdfPreview";
import { realApi } from "../data/realApi";
import { queryKeys, useAdminSiteQuery } from "../hooks/usePortfolioQueries";

export function AdminResumePage() {
  const queryClient = useQueryClient();
  const siteQuery = useAdminSiteQuery();

  const uploadMutation = useMutation({
    mutationFn: (file: File) => realApi.uploadResume(file),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.adminSite });
      await queryClient.invalidateQueries({ queryKey: queryKeys.bootstrap });
      await queryClient.invalidateQueries({ queryKey: queryKeys.resume });
    }
  });

  if (siteQuery.isLoading) {
    return <div className="state-shell">正在读取简历管理数据...</div>;
  }

  if (siteQuery.error) {
    return <div className="state-shell">读取简历管理数据失败：{siteQuery.error.message}</div>;
  }

  const resumeAsset = siteQuery.data?.resume ?? null;

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    uploadMutation.reset();
    uploadMutation.mutate(file);
    event.target.value = "";
  };

  return (
    <div className="admin-page-grid">
      <section className="admin-page-head">
        <p className="eyebrow">/admin/resume</p>
        <h1>简历管理</h1>
        <p className="muted">当前后台真实支持的是简历 PDF 上传与替换，前端按这个口径提供预览、上传进度和保存结果反馈。</p>
      </section>

      <div className="resume-admin-layout">
        <section className="form-card">
          <div className="detail-panel detail-panel--nested">
            <p className="eyebrow">当前文件</p>
            <strong>{resumeAsset?.fileName ?? "未上传简历文件"}</strong>
            <p className="muted">
              {resumeAsset?.updatedAt
                ? `最近更新时间：${new Date(resumeAsset.updatedAt).toLocaleString("zh-CN")}`
                : "上传后，公开简历页会直接切到最新文件。"}
            </p>
          </div>

          <label className="field">
            <span>上传 / 替换简历 PDF</span>
            <input type="file" accept="application/pdf,.pdf" onChange={handleUpload} disabled={uploadMutation.isPending} />
          </label>

          {uploadMutation.isSuccess ? <p className="form-success">简历文件已更新，公开页会读取最新 PDF。</p> : null}
          {uploadMutation.error ? <p className="form-error">{uploadMutation.error.message}</p> : null}

          {resumeAsset?.downloadUrl ? (
            <a className="ghost-button" href={resumeAsset.downloadUrl} target="_blank" rel="noreferrer">
              打开当前简历文件
            </a>
          ) : null}
        </section>

        <section className="detail-panel">
          <p className="eyebrow">页面内预览</p>
          <PdfPreview asset={resumeAsset} title={resumeAsset?.fileName ?? "简历 PDF"} minHeight={620} />
        </section>
      </div>
    </div>
  );
}
