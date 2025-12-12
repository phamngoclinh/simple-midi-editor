// src/routes/Router.tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Import các trang (Pages)
import AppLayout from '../components/layout/AppLayout'; // Giả sử có Layout chung
import { ModalProvider } from '../contexts/ModalContext';
import EditorPage from '../pages/EditorPage/EditorPage';
import SongManagerPage from '../pages/SongManagerPage/SongManagerPage';
import { SongManagerProvider } from '../contexts/SongManagerContext';

export const Router = () => {
  return (
    <ModalProvider>
      <SongManagerProvider>
        <BrowserRouter>
          {/* Layout dùng để hiển thị Header, Footer hoặc Nav chung */}
          <Routes>
            <Route path="/" element={<AppLayout />}>
              {/* 1. Trang Quản lý Song (Homepage) */}
              <Route index element={<SongManagerPage />} />

              {/* 2. Trang Editor chính: Chứa Timeline và Notes */}
              {/* Sử dụng tham số động :songId */}
              <Route path="/editor/:songId" element={<EditorPage />} />

              {/* Xử lý trang 404 (Tùy chọn) */}
              <Route path="*" element={<div>404: Trang không tồn tại</div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SongManagerProvider>
    </ModalProvider>
  );
};

export default Router;