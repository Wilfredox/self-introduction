import { Navigate, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./ScrollToTop";
import { RequireAdminAuth } from "./RequireAdminAuth";
import { PublicLayout } from "../../layouts/PublicLayout";
import { AdminLayout } from "../../layouts/AdminLayout";
import { HomePage } from "../../pages/HomePage";
import { WorksPage } from "../../pages/WorksPage";
import { WorkDetailPage } from "../../pages/WorkDetailPage";
import { ResumePage } from "../../pages/ResumePage";
import { AdminLoginPage } from "../../pages/AdminLoginPage";
import { AdminDashboardPage } from "../../pages/AdminDashboardPage";
import { AdminProfilePage } from "../../pages/AdminProfilePage";
import { AdminProjectsPage } from "../../pages/AdminProjectsPage";
import { AdminResumePage } from "../../pages/AdminResumePage";

export function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/works" element={<WorksPage />} />
          <Route path="/works/:slug" element={<WorkDetailPage />} />
          <Route path="/resume" element={<ResumePage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<RequireAdminAuth />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="projects" element={<AdminProjectsPage />} />
            <Route path="resume" element={<AdminResumePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
