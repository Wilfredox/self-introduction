import { PdfPreview } from "../components/PdfPreview";
import { getPortfolioBootstrap, getResumeContent } from "../data/portfolioContent";

export function ResumePage() {
  const { profile } = getPortfolioBootstrap();
  const resume = getResumeContent();
  const resumeAsset = resume.asset ?? null;
  const resumeTitle = resume.title;
  const resumeSummary = resume.summary;

  return (
    <div className="page-shell">
      <section className="page-intro">
        <p className="eyebrow">Resume</p>
        <h1>简历</h1>
        <p className="muted">这一页把在线预览、摘要和下载放进同一条阅读路径里，方便招聘方先判断，再决定是否保存。</p>
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
                {resume.downloadLabel}
              </a>
            ) : (
              <button className="button button--full" type="button" disabled>
                暂未提供下载文件
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
