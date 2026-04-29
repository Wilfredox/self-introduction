import { PublicProfile, ResumeContent } from "../types/content";

export const siteContentVersion = "2026-04-27T23:59:00+08:00";

export const siteProfile: PublicProfile = {
  name: "汪浩翔",
  tagline: "智慧水利本科生，聚焦水文计算、数字化水网建模与水利编程开发，正在把课程项目和实习成果整理成更适合招聘浏览的作品表达。",
  contacts: [
    {
      id: "contact-email",
      label: "邮箱",
      value: "861039711@qq.com",
      href: "mailto:861039711@qq.com"
    },
    {
      id: "contact-phone",
      label: "电话",
      value: "13588929677",
      href: "tel:13588929677"
    },
    {
      id: "contact-location",
      label: "城市",
      value: "杭州",
      href: "https://maps.google.com/?q=Hangzhou"
    }
  ]
};

export const resumeContent: ResumeContent = {
  title: "汪浩翔 简历",
  summary: "这一版简历聚焦智慧水利方向的课程设计、建模实践、编程开发能力和国企实习经历，方便招聘方先快速浏览，再决定是否下载保存。",
  downloadLabel: "下载简历 PDF",
  asset: {
    assetId: "resume-pdf",
    fileName: "wang-haoxiang-resume.pdf",
    url: `${import.meta.env.BASE_URL}resume/wang-haoxiang-resume.pdf`,
    previewUrl: `${import.meta.env.BASE_URL}resume/wang-haoxiang-resume-vertical-preview.pdf#page=1&view=FitV&zoom=page-fit&toolbar=0&navpanes=0&scrollbar=0`,
    downloadUrl: `${import.meta.env.BASE_URL}resume/wang-haoxiang-resume.pdf`,
    updatedAt: siteContentVersion
  }
};
