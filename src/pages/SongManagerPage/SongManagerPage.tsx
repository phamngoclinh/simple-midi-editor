// src/pages/SongManagerPage/SongManagerPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Song } from '../../domain/entities/Song';
import { 
  listAllSongsUseCase, 
  createNewSongUseCase, 
  editSongUseCase, 
  deleteSongUseCase 
} from '../../dependencies'; // Import từ file dependencies đã tạo
import SongForm from '../../components/song/SongForm';
import SongListItem from '../../components/song/SongListItem';
import { SongSortBy, SortOrder } from '../../application/song/ListAllSong';
import Modal from '../../components/common/Modal';
import { Track } from '../../domain/entities/Track';

interface SongFormData {
  name: string;
  description: string;
  totalDuration: number;
  tracks: Track[];
  tags: string[];
}

// Định nghĩa trạng thái sắp xếp
interface SortState {
  by: SongSortBy;
  order: SortOrder;
}

const SongManagerPage: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [sortState, setSortState] = useState<SortState>({ by: 'updated', order: 'desc' });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Modal Tạo mới
  const navigate = useNavigate();

  // --- Hàm Tải Dữ liệu ---
  const loadSongs = useCallback(async () => {
    setLoading(true);
    try {
      const allSongs = await listAllSongsUseCase.execute(sortState.by, sortState.order);
      setSongs(allSongs);
    } catch (error) {
      console.error("Lỗi khi tải Songs:", error);
      alert("Không thể tải danh sách bài hát.");
    } finally {
      setLoading(false);
    }
  }, [sortState]); // Re-run khi sortState thay đổi

  useEffect(() => {
    loadSongs();
  }, [loadSongs]);

  // --- Xử lý Thay đổi Sắp xếp ---
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [by, order] = e.target.value.split(':') as [SongSortBy, SortOrder];
    setSortState({ by, order });
  };

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingSong(null); // Đóng Modal Edit nếu đang mở
  };

  // --- Xử lý Tạo Song (Create) ---
  const handleCreateSong = async (data: SongFormData) => {
    try {
      const createData = {
        name: data.name,
        description: data.description,
        totalDuration: data.totalDuration,
        tracks: data.tracks,
        tags: data.tags
      };
      const newSong = await createNewSongUseCase.execute(createData);
      handleCloseModal();
      await loadSongs(); // Tải lại danh sách
      alert(`Bài hát "${newSong.name}" đã được tạo.`);
      navigate(`/editor/${newSong.id}`); // Chuyển sang trang Editor
    } catch (error) {
      console.error("Lỗi khi tạo Song:", error);
      alert("Tạo bài hát thất bại.");
    }
  };

  const handleStartEdit = (song: Song) => {
    console.log('editing song', song)
    setEditingSong(song); // Thiết lập Song đang chỉnh sửa để mở Modal Edit
  };

  // --- Xử lý Chỉnh sửa Song (Edit) ---
  const handleEditSong = async (songId: string, data: SongFormData) => {
    try {
      const updateData = {
          id: songId,
          name: data.name,
          description: data.description,
          totalDuration: data.totalDuration,
          tracks: data.tracks,
      };
      const updatedSong = await editSongUseCase.execute(updateData);
      handleCloseModal();
      await loadSongs(); // Tải lại danh sách
      setEditingSong(null); // Đóng form chỉnh sửa
      alert(`Bài hát "${updatedSong.name}" đã được cập nhật.`);
    } catch (error) {
      console.error("Lỗi khi chỉnh sửa Song:", error);
      alert("Chỉnh sửa thất bại.");
    }
  };

  // --- Xử lý Xóa Song (Delete) ---
  const handleDeleteSong = async (songId: string, songName: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài hát "${songName}" không?`)) {
      return;
    }
    try {
      await deleteSongUseCase.execute(songId);
      // Xóa thành công, cập nhật UI mà không cần tải lại toàn bộ
      setSongs(prev => prev.filter(s => s.id !== songId)); 
      alert(`Bài hát "${songName}" đã bị xóa.`);
    } catch (error) {
      console.error("Lỗi khi xóa Song:", error);
      alert("Xóa bài hát thất bại.");
    }
  };
  
  // --- Xử lý Mở Song (Navigate) ---
  const handleOpenSong = (songId: string) => {
    navigate(`/editor/${songId}`);
  };

  if (loading) return <div>Đang tải danh sách bài hát...</div>;

  return (
    <div className="song-manager-page" style={pageStyle}>
      <h2>🎶 Quản Lý Bài Hát</h2>
      
      {/* 1. Khu vực Tạo Song */}
      {/* <div className="section create-song">
        <h3>Tạo Bài Hát Mới</h3>
        <SongForm onSubmit={handleCreateSong} />
      </div> */}
      <button 
        onClick={handleOpenCreateModal} 
        style={createButtonStyle}
      >
        + Tạo Bài Hát Mới
      </button>

      <hr style={{ margin: '20px 0' }} />

      {/* 2. Danh sách Song */}
      <div className="section song-list">
        <h3>Danh Sách Bài Hát ({songs.length})</h3>

        {/* Control Sắp xếp */}
            <div style={sortControlStyle}>
                <label htmlFor="sort-by-select">Sắp xếp theo:</label>
                <select id="sort-by-select" onChange={handleSortChange} value={`${sortState.by}:${sortState.order}`} style={selectStyle}>
                    <option value="updated:desc">Cập nhật gần nhất</option>
                    <option value="updated:asc">Cập nhật cũ nhất</option>
                    <option value="name:asc">Tên (A-Z)</option>
                    <option value="name:desc">Tên (Z-A)</option>
                    <option value="created:desc">Ngày tạo (mới nhất)</option>
                    <option value="created:asc">Ngày tạo (cũ nhất)</option>
                    <option value="tempo:desc">Tempo (cao nhất)</option>
                    <option value="tempo:asc">Tempo (thấp nhất)</option>
                </select>
        </div>
        
        {songs.length === 0 ? (
          <p>Chưa có bài hát nào được lưu.</p>
        ) : (
          <ul style={listStyle}>
            {songs.map(song => (
              <li key={song.id} style={listItemStyle}>
                <SongListItem
                  song={song}
                  onOpen={() => handleOpenSong(song.id!)}
                  onEdit={() => handleStartEdit(song)}
                  onDelete={() => handleDeleteSong(song.id!, song.name)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 3. 💥 Modal Tạo Song (Create Modal) */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={handleCloseModal} 
        title="Tạo Song Mới"
      >
        {/* Truyền hàm xử lý tạo mới vào SongForm */}
        <SongForm 
            onSubmit={handleCreateSong} 
            buttonLabel="Tạo Song" 
        />
      </Modal>

      {/* 4. 💥 Modal Chỉnh Sửa Song (Edit Modal) */}
      <Modal 
        isOpen={!!editingSong} 
        onClose={handleCloseModal} 
        title={`Chỉnh Sửa: ${editingSong?.name || ''}`}
      >
        {/* Truyền dữ liệu Song hiện tại và hàm xử lý lưu chỉnh sửa */}
        {editingSong && (
            <SongForm 
              initialSong={editingSong} 
              onSubmit={(data) => handleEditSong(editingSong.id as string, data)}
              buttonLabel="Lưu Thay Đổi"
            />
        )}
      </Modal>
    </div>
  );
};

export default SongManagerPage;

const pageStyle: React.CSSProperties = {
  padding: '20px',
  backgroundColor: '#f4f7f9',
};

const createButtonStyle: React.CSSProperties = {
  padding: '12px 20px',
  fontSize: '1.1em',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  marginBottom: '10px',
};

// --- Style bổ sung cho Sắp xếp ---
const sortControlStyle: React.CSSProperties = {
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
  fontSize: '0.9em',
};

const selectStyle: React.CSSProperties = {
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
};

const listItemStyle: React.CSSProperties = {
  marginBottom: '10px',
};