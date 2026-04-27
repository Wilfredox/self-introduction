import { Navigate, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./ScrollToTop";
import { PublicLayout } from "../../layouts/PublicLayout";
import { HomePage } from "../../pages/HomePage";
import { WorksPage } from "../../pages/WorksPage";
import { WorkDetailPage } from "../../pages/WorkDetailPage";
import { ResumePage } from "../../pages/ResumePage";

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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
