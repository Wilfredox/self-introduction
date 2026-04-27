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
        <strong>PDF 预览容器已预留</strong>
        <p>后续接入真实上传文件后，这里会直接显示页面内预览。</p>
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
