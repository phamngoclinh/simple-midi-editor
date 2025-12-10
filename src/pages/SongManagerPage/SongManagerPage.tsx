// src/pages/SongManagerPage/SongManagerPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Song } from '../../domain/entities/Song';
import {
  listAllSongsUseCase,
  createNewSongUseCase,
  editSongUseCase,
  deleteSongUseCase,
  addNoteToSongUseCase,
  editExistingNoteUseCase,
  deleteExistingNoteUseCase,
  importSongFromJsonUseCase,
  exportSongToJsonUseCase
} from '../../dependencies'; // Import từ file dependencies đã tạo
import SongForm from '../../components/song/SongForm';
import SongListItem from '../../components/song/SongListItem';
import { SongSortBy, SortOrder } from '../../application/song/ListAllSong';
import Modal from '../../components/common/Modal';
import { Track } from '../../domain/entities/Track';
import NoteEditForm, { NoteFormData } from '../../components/note/NoteEditForm';
import { Note } from '../../domain/entities/Note';
import NoteList from '../../components/note/NoteList';

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
  const [selectedSongForNoteEdit, setSelectedSongForNoteEdit] = useState<Song | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
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
    setSelectedSongForNoteEdit(null); // 💥 Thêm reset state này
    setEditingNote(null);
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
        tags: data.tags,
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

  // --- Hàm Xử lý Note Edit/Create ---

  // 1. Mở Modal Note Edit/List
  const handleStartNoteManagement = (song: Song) => {
    setSelectedSongForNoteEdit(song);
    setEditingNote(null); // Luôn bắt đầu ở chế độ List/Create
  };

  // 2. Chuyển sang chế độ Chỉnh sửa Note đã có
  const handleStartEditNote = (note: Note) => {
    setEditingNote(note);
  };

  // 3. Xử lý lưu Note (tạo mới hoặc cập nhật)
  const handleSaveNote = async (noteData: NoteFormData) => {
    if (!selectedSongForNoteEdit) return;

    try {
      if (editingNote && editingNote.id) {
        // 💥 LOGIC UPDATE NOTE
        console.log("Cập nhật Note:", editingNote.id, noteData);
        await editExistingNoteUseCase.execute({ id: editingNote.id as string, ...noteData });
      } else {
        // 💥 LOGIC TẠO MỚI NOTE
        console.log("Tạo mới Note:", noteData);
        await addNoteToSongUseCase.execute({ ...noteData });
      }

      alert(`Note đã được lưu thành công.`);
      // Sau khi lưu, đóng form và reset trạng thái chỉnh sửa Note
      setEditingNote(null);
      // Nếu NoteList có cơ chế refresh tự động, không cần làm gì thêm
    } catch (error: any) {
      console.error("Lỗi khi lưu Note:", error);
      alert(`Lưu Note thất bại. ${error.message}`);
    }
  };

  // 4. Xử lý Xóa Note
  const handleDeleteNote = async (noteId: string) => {
    if (!selectedSongForNoteEdit) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa Note này không?")) return;

    try {
      const trackId = selectedSongForNoteEdit.tracks.find(t => t.notes.some(n => n.id === noteId))?.id;
      if (!trackId) throw new Error("Track ID không tìm thấy");

      // 💥 LOGIC DELETE NOTE
      await deleteExistingNoteUseCase.execute(noteId, selectedSongForNoteEdit.id!, trackId);
      console.log(`Đã xóa Note ID: ${noteId}`);

      alert("Note đã được xóa.");
      // Sau khi xóa, component NoteList sẽ tự tải lại (nếu có cơ chế dependency injection)
    } catch (error) {
      console.error("Lỗi khi xóa Note:", error);
      alert("Xóa Note thất bại.");
    }
  };

  // --- Hàm Export Song ---
  const handleExportSong = (song: Song) => {
    // 💥 LOGIC EXPORT
    try {
        // Tạm thời, chỉ lấy dữ liệu của Song đang được chỉnh sửa (hoặc Song được chọn)
        // Nếu muốn export một Song từ danh sách, cần truyền Song đó vào
        const jsonString = exportSongToJsonUseCase.execute(song); 
        
        // Tạo Blob và tải file
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${song.name.replace(/\s/g, '_')}_export.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert(`Đã export Song "${song.name}" thành công.`);

    } catch (error) {
        console.error("Lỗi khi export Song:", error);
        alert("Export Song thất bại: " + (error as Error).message);
    }
  };

  // --- Hàm Import Song ---
  const handleImportSong = () => {
    // Tạo input file ẩn để mở cửa sổ chọn file
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const jsonString = event.target?.result as string;
        
        // 💥 LOGIC IMPORT
        try {
          // Gửi chuỗi JSON đến Use Case để xử lý
          const newSong = await importSongFromJsonUseCase.execute(jsonString);
          
          alert(`Đã import và tạo Song mới: "${newSong.name}"`);
          await loadSongs(); // Tải lại danh sách để thấy Song mới
          
        } catch (error) {
          console.error("Lỗi khi import Song:", error);
          alert("Import Song thất bại: " + (error as Error).message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  if (loading) return <div>Đang tải danh sách bài hát...</div>;

  return (
    <div className="song-manager-page" style={pageStyle}>
      <h2>🎶 Quản Lý Bài Hát</h2>

      {/* 1. Khu vực Tạo Song */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button
          onClick={handleOpenCreateModal}
          style={createButtonStyle}
        >
          + Tạo Bài Hát Mới
        </button>

        <button 
          onClick={handleImportSong} 
          style={{ ...createButtonStyle, backgroundColor: '#6f42c1' }} // Màu Tím cho Import
        >
          Import Song (JSON)
        </button>
      </div>

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
                  onEditNotes={handleStartNoteManagement}
                  onExport={handleExportSong}
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

      {/* 💥 Modal Chỉnh Sửa Notes (Note Edit Modal) */}
      <Modal
        isOpen={!!selectedSongForNoteEdit}
        onClose={handleCloseModal}
        title={editingNote ? (editingNote.id ? `Sửa Note: ${editingNote.title}` : 'Tạo Note') : `Quản Lý Notes cho: ${selectedSongForNoteEdit?.name || ''}`}
      >
        {selectedSongForNoteEdit && (
          <>
            {editingNote ? (
              // 💥 Chế độ FORM SỬA (hoặc Tạo mới)
              <NoteEditForm
                currentSong={selectedSongForNoteEdit}
                // Gán các trường Note Entity vào NoteFormData (cần đảm bảo tương thích)
                initialNote={{
                  songId: selectedSongForNoteEdit.id as string,
                  trackId: editingNote.trackId as string,
                  track: editingNote.track,
                  time: editingNote.time,
                  title: editingNote.title || '',
                  description: editingNote.description || '',
                  color: editingNote.color || '#007bff',
                  icon: editingNote.icon || '',
                }}
                onSubmit={handleSaveNote}
                onCancel={() => setEditingNote(null)} // Quay lại danh sách
                buttonLabel="Lưu Note"
              />
            ) : (
              // 💥 Chế độ LIST NOTES (và nút Tạo mới)
              <>
                <button
                  onClick={() => setEditingNote({
                    trackId: selectedSongForNoteEdit.tracks[0].id as string,
                    track: 1,
                    time: 0,
                    title: '',
                    description: '',
                    color: '',
                    icon: ''
                  })} // Giả lập tạo mới
                  style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  + Tạo Note Mới
                </button>

                <NoteList
                  songId={selectedSongForNoteEdit.id!}
                  currentSong={selectedSongForNoteEdit}
                  onEditNote={handleStartEditNote} // Mở form chỉnh sửa Note
                  onDeleteNote={handleDeleteNote}
                />
              </>
            )}
          </>
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
