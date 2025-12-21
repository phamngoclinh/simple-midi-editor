import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AppLayout from '../components/layout/AppLayout';
import EditorPage from '../pages/EditorPage';
import SongManagerPage from '../pages/SongManagerPage';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AppLayout />}>
          <Route index element={<SongManagerPage />} />
          <Route path='/editor/:songId' element={<EditorPage />} />
          <Route path='*' element={<div>404: Trang không tồn tại</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;