import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AppLayout from '../components/layout/AppLayout';
import { ModalProvider } from '../contexts/ModalContext';
import EditorPage from '../pages/EditorPage/EditorPage';
import SongManagerPage from '../pages/SongManagerPage/SongManagerPage';
import { SongManagerProvider } from '../contexts/SongManagerContext';

export const Router = () => {
  return (
    <ModalProvider>
      <SongManagerProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<SongManagerPage />} />
              <Route path="/editor/:songId" element={<EditorPage />} />
              <Route path="*" element={<div>404: Trang không tồn tại</div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SongManagerProvider>
    </ModalProvider>
  );
};

export default Router;