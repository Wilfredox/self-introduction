import { useBootstrapQuery, useResumeQuery } from "../hooks/usePortfolioQueries";
import { PdfPreview } from "../components/PdfPreview";

export function ResumePage() {
  const bootstrapQuery = useBootstrapQuery();
  const resumeQuery = useResumeQuery();

  if (bootstrapQuery.isLoading || resumeQuery.isLoading) {
    return <div className="state-shell">正在载入简历页...</div>;
  }

  if (bootstrapQuery.error) {
    return <div className="state-shell">简历页基础信息加载失败：{bootstrapQuery.error.message}</div>;
  }

  if (resumeQuery.error) {
    return <div className="state-shell">简历文件加载失败：{resumeQuery.error.message}</div>;
  }

  if (!bootstrapQuery.data) {
    return <div className="state-shell">简历内容暂时不可用。</div>;
  }

  const { profile } = bootstrapQuery.data;
  const resumeAsset = resumeQuery.data;
  const resumeTitle = resumeAsset?.fileName ? `${profile.name} / Resume PDF` : "简历文件待上传";
  const resumeSummary = resumeAsset
    ? "页面内支持直接预览当前简历文件，也保留原始 PDF 下载入口。"
    : "当前还没有上传可预览的简历文件，后续上传后会直接在此页生效。";

  return (
    <div className="page-shell">
      <section className="page-intro">
        <p className="eyebrow">Resume</p>
        <h1>简历页</h1>
        <p className="muted">页面内先给预览和摘要，再给下载按钮，保证招聘方不用来回跳转。</p>
      </section>

      <div className="resume-layout">
        <aside className="resume-sidebar">
          <article className="detail-panel">
            <h2>{profile.name}</h2>
            <p>{profile.tagline}</p>
            <div className="stack-links">
              {profile.contacts.map((contact) => (
                <a key={contact.id} className="ghost-button ghost-button--full" href={contact.href} target="_blank" rel="noreferrer">
                  {contact.label} / {contact.value}
                </a>
              ))}
            </div>
          </article>

          <article className="detail-panel">
            <p className="eyebrow">简历说明</p>
            <strong>{resumeTitle}</strong>
            <p>{resumeSummary}</p>
            {resumeAsset?.downloadUrl ? (
              <a className="button button--full" href={resumeAsset.downloadUrl} download={resumeAsset.fileName}>
                下载简历 PDF
              </a>
            ) : (
              <button className="button button--full" type="button" disabled>
                等待上传真实简历
              </button>
            )}
          </article>
        </aside>

        <section className="resume-preview-panel">
          <PdfPreview asset={resumeAsset} title={resumeTitle} minHeight={760} />
        </section>
      </div>
    </div>
  );
}
