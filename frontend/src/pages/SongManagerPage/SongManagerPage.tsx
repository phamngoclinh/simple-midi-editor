import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/common/Modal';
import NoteEditForm from '../../components/note/NoteEditForm';
import NoteList from '../../components/note/NoteList';
import SongForm from '../../components/song/SongForm';
import SongListItem from '../../components/song/SongListItem';
import { useModal } from '../../contexts/ModalContext';
import { SongManagerProvider } from '../../contexts/SongManagerContext';
import useSongManager from '../../hooks/useSongManager';
import { createButtonStyle, listItemStyle, listStyle, pageStyle, selectStyle, sortControlStyle } from './SongManagerPage.style';

const SongManagerPage: React.FC = () => {
  // Wrap content with provider and use an inner consumer component so the hook has context.
  return (
    <SongManagerProvider>
      <SongManagerContent />
    </SongManagerProvider>
  );
};

const SongManagerContent: React.FC = () => {
  const navigate = useNavigate();
  const {
    songs,
    loading,
    sortState,
    setSortState,
    isCreateModalOpen,
    openCreateModal,
    closeAllModals,
    createSong,
    editingSong,
    startEditSong,
    editSong,
    deleteSong,
    openSong,
    selectedSongForNoteEdit,
    startNoteManagement,
    editingNote,
    initialNote,
    startEditNote,
    saveNote,
    deleteNote,
    importSong,
    exportSong,
  } = useSongManager();
  const { showToast } = useModal();

  if (loading) return <div>Đang tải danh sách bài hát...</div>;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [by, order] = e.target.value.split(':') as [any, any];
    setSortState({ by, order });
  };

  const handleCreate = async (data: any) => {
    try {
      const newSong = await createSong(data);
      closeAllModals();
      if (newSong && newSong.id) {
        navigate(`/editor/${newSong.id}`);
        showToast({
          type: 'success',
          message: `Bài hát "${newSong.name}" đã được tạo.`,
        });
      }
    } catch (err: any) {
      console.error(err);
      showToast({
        type: 'error',
        message: `Tạo bài hát thất bại. ${err.message}`,
      });
    }
  };

  return (
    <div className="song-manager-page" style={pageStyle}>
      <div className="section song-list">
        <h2>Danh Sách Bài Hát ({songs.length})</h2>

        <div style={{ 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between' }}>
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
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button onClick={importSong} style={{ ...createButtonStyle, backgroundColor: 'rgb(60 112 169)' }}>⬆️ Import</button>
            <button onClick={openCreateModal} style={createButtonStyle} title="Tạo Bài Hát Mới">+ Thêm</button>
          </div>
        </div>

        {songs.length === 0 ? (
          <p>Chưa có bài hát nào được lưu.</p>
        ) : (
          <ul style={listStyle}>
            {songs.map(song => (
              <li key={song.id} style={listItemStyle}>
                <SongListItem
                  song={song}
                  onOpen={() => openSong(song.id!)}
                  onEdit={() => startEditSong(song)}
                  onDelete={() => deleteSong(song.id!, song.name)}
                  onEditNotes={() => startNoteManagement(song)}
                  onExport={() => exportSong(song)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={closeAllModals} title="Tạo Song Mới">
        <SongForm onSubmit={handleCreate} buttonLabel="Tạo Song" />
      </Modal>

      <Modal isOpen={!!editingSong} onClose={closeAllModals} title={`Chỉnh Sửa: ${editingSong?.name || ''}`}>
        {editingSong && (
          <SongForm
            initialSong={editingSong}
            onSubmit={(data) => editSong(editingSong.id as string, data)}
            buttonLabel="Lưu Thay Đổi"
          />
        )}
      </Modal>

      <Modal
        isOpen={!!selectedSongForNoteEdit}
        onClose={closeAllModals}
        title={editingNote ? (editingNote.id ? `Sửa Note: ${editingNote.title}` : 'Tạo Note') : `Quản Lý Notes cho: ${selectedSongForNoteEdit?.name || ''}`}
      >
        {selectedSongForNoteEdit && (
          <>
            {editingNote ? (
              <NoteEditForm
                currentSong={selectedSongForNoteEdit}
                initialNote={initialNote}
                onSubmit={saveNote}
                onCancel={() => startEditNote(null)}
                buttonLabel="Lưu Note"
              />
            ) : (
              <>
                <button
                  onClick={() => startEditNote({
                    trackId: selectedSongForNoteEdit.tracks[0].id as string,
                    track: 1,
                    time: 0,
                    title: '',
                    description: '',
                    color: '',
                    icon: ''
                  })}
                  style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  + Tạo Note Mới
                </button>

                <NoteList
                  songId={selectedSongForNoteEdit.id!}
                  currentSong={selectedSongForNoteEdit}
                  onEditNote={(n) => startEditNote(n)}
                  onDeleteNote={deleteNote}
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
