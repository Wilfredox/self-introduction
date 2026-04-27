import { PublicAssetRef } from "../types/content";

interface PdfPreviewProps {
  asset?: PublicAssetRef | null;
  title: string;
  minHeight?: number;
}

export function PdfPreview({ asset, title, minHeight = 520 }: PdfPreviewProps) {
  if (!asset?.url) {
    return (
      <div className="pdf-placeholder" style={{ minHeight }}>
        <strong>暂未提供 PDF 预览</strong>
        <p>可以稍后补充文件，或先通过文字内容了解项目。</p>
      </div>
    );
  }

  return (
    <div className="pdf-frame" style={{ minHeight }}>
      <object data={asset.previewUrl || asset.url} type="application/pdf" aria-label={title}>
        <div className="pdf-placeholder">
          <strong>当前浏览器无法直接预览 PDF</strong>
          <p>可以先使用下载入口查看文件。</p>
        </div>
      </object>
    </div>
  );
}
