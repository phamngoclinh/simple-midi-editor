import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/common/Modal';
import SongForm from '../../components/song/SongForm';
import SongListItem from '../../components/song/SongListItem';
import { useModal } from '../../contexts/ModalContext';
import useSongManager from '../../hooks/useSongManager';
import { ChildFormHandles } from '../../utils/types';
import NoteList from '../../components/note/NoteList';
import NoteEditForm from '../../components/note/NoteEditForm';

const SongManagerPage: React.FC = () => {
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
  const formRef = useRef<ChildFormHandles>(null);

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

  const actionsRight = [
    editingNote === null ? <button
      onClick={() => startEditNote({
        trackId: selectedSongForNoteEdit?.tracks[0].id as string,
        track: 1,
        time: 0,
        title: '',
        description: '',
        color: '',
        icon: ''
      })}
      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-600 shadow-lg shadow-blue-900/20 transition-all"
    >
      + Tạo Note Mới
    </button> : <></>
  ]

  if (loading) return <div>Đang tải danh sách bài hát...</div>;

  return (
    <main className='flex-1 flex overflow-hidden'>
      <div className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">My Songs</h1>
              <p className="text-slate-500 dark:text-[#9da6b9] text-base">Manage your MIDI projects or start a new idea.</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                id="sort-by-select"
                onChange={handleSortChange}
                value={`${sortState.by}:${sortState.order}`}
                className="h-10 px-4 rounded-lg bg-white dark:bg-[#282e39] border border-slate-200 dark:border-transparent text-slate-700 dark:text-white text-sm font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-[#323945] transition-colors"
              >
                <option value="updated:desc">Cập nhật gần nhất</option>
                <option value="updated:asc">Cập nhật cũ nhất</option>
                <option value="name:asc">Tên (A-Z)</option>
                <option value="name:desc">Tên (Z-A)</option>
                <option value="created:desc">Ngày tạo (mới nhất)</option>
                <option value="created:asc">Ngày tạo (cũ nhất)</option>
                <option value="tempo:desc">Tempo (cao nhất)</option>
                <option value="tempo:asc">Tempo (thấp nhất)</option>
              </select>

              <button onClick={openCreateModal} className="h-10 px-5 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all">
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span>New Song</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            <>
              {songs.length && songs.map(song => (
                <div key={song.id} className="group relative flex flex-col bg-white dark:bg-[#1e2430] rounded-xl border border-slate-200 dark:border-[#282e39] hover:border-primary/50 dark:hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5">
                  <SongListItem
                    song={song}
                    onOpen={() => openSong(song.id!)}
                    onEdit={() => startEditSong(song)}
                    onDelete={() => deleteSong(song.id!, song.name)}
                    onEditNotes={() => startNoteManagement(song)}
                    onExport={() => exportSong(song)}
                  />
                </div>
              ))}
            </>

            <button onClick={openCreateModal} className="group flex flex-col items-center justify-center bg-transparent border-2 border-dashed border-slate-300 dark:border-[#282e39] rounded-xl overflow-hidden hover:border-primary hover:bg-primary/5 transition-all aspect-[4/3] sm:aspect-auto">
              <div className="flex flex-col items-center gap-3 p-8">
                <div className="size-14 rounded-full bg-slate-100 dark:bg-[#1e2430] group-hover:bg-primary text-slate-400 dark:text-[#637083] group-hover:text-white flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-[32px]">add</span>
                </div>
                <p className="text-slate-500 dark:text-[#9da6b9] group-hover:text-primary font-bold text-lg transition-colors">Create New Song</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {isCreateModalOpen && (
        <></>

      )}

      <Modal isOpen={isCreateModalOpen} onClose={closeAllModals} title="Tạo bài hát mới" textOk='Lưu bài hát' onOk={() => formRef.current?.submitForm()}>
        <SongForm onSubmit={handleCreate} ref={formRef} />
      </Modal>

      <Modal isOpen={!!editingSong} onClose={closeAllModals} title={`Chỉnh Sửa: ${editingSong?.name || ''}`} textOk='Lưu bài hát' onOk={() => formRef.current?.submitForm()}>
          {editingSong && (
            <SongForm
              ref={formRef}
              initialSong={editingSong}
              onSubmit={(data) => editSong(editingSong.id as string, data)}
            />
          )}
      </Modal>

      <Modal
        isOpen={!!selectedSongForNoteEdit}
        onClose={closeAllModals}
        title={editingNote ? (editingNote.id ? `Sửa Note: ${editingNote.title}` : 'Tạo Note') : `Quản Lý Notes cho: ${selectedSongForNoteEdit?.name || ''}`}
        textOk={editingNote ? 'Lưu note' : ''}
        textClose='Đóng'
        onOk={() => formRef.current?.submitForm()}
        actionsRight={actionsRight}
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
                ref={formRef}
              />
            ) : (
              <NoteList
                songId={selectedSongForNoteEdit.id!}
                currentSong={selectedSongForNoteEdit}
                onEditNote={(n) => startEditNote(n)}
                onDeleteNote={deleteNote}
              />
            )}
          </>
        )}
      </Modal>
    </main>
  );
};

export default SongManagerPage;
