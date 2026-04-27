import { PublicProfile, ResumeContent } from "../types/content";
import { createPdfAsset } from "./placeholders";

export const siteContentVersion = "2026-04-27T23:20:00+08:00";

export const siteProfile: PublicProfile = {
  name: "林岚",
  tagline: "产品体验设计师，擅长把复杂信息整理成清楚、有记忆点、适合快速浏览的作品表达。",
  contacts: [
    {
      id: "contact-email",
      label: "邮箱",
      value: "hello@linlan.design",
      href: "mailto:hello@linlan.design"
    },
    {
      id: "contact-phone",
      label: "电话",
      value: "+86 138 0000 0000",
      href: "tel:+8613800000000"
    },
    {
      id: "contact-location",
      label: "城市",
      value: "上海 / 可远程协作",
      href: "https://maps.google.com/?q=Shanghai"
    }
  ]
};

export const resumeContent: ResumeContent = {
  title: "Lin Lan Resume 2026",
  summary: "简历页保留在线预览与下载入口，方便招聘方先快速浏览重点，再决定是否保存归档。",
  downloadLabel: "下载简历 PDF",
  asset: createPdfAsset("resume-pdf", "lin-lan-resume.pdf")
};
