// src/components/editor/MidiEditorManager.tsx
import React, { useState } from 'react';
import { useModal } from '../../contexts/ModalContext';
import { editExistingNoteUseCase } from '../../dependencies';
import { Note } from '../../domain/entities/Note';
import { Song } from '../../domain/entities/Song';
import Modal from '../common/Modal';
import NoteEditForm, { NoteFormData } from '../note/NoteEditForm';
import MidiEditorContainer from './MidiEditorContainer';

interface MidiEditorProps {
  currentSong: Song;
  reload: () => void;
}

const MidiEditorManager: React.FC<MidiEditorProps> = ({ currentSong, reload }) => {
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const { showToast } = useModal();

  const handleCloseModal = () => {
    setEditingNote(null);
  };

  const handleStartEditNote = (note: Note) => {
    setEditingNote(note);
  };

  const handleSaveNote = async (noteData: NoteFormData) => {
    if (!currentSong) return;

    try {
      if (editingNote && editingNote.id) {
        // 💥 LOGIC UPDATE NOTE
        console.log("Cập nhật Note:", editingNote.id, noteData);
        await editExistingNoteUseCase.execute({ id: editingNote.id as string, ...noteData });
        showToast({
          type: 'success',
          message: 'Note đã được lưu thành công.',
        });
        // Sau khi lưu, đóng form và reset trạng thái chỉnh sửa Note
        setEditingNote(null);
        // Nếu NoteList có cơ chế refresh tự động, không cần làm gì thêm
        reload();
      }
    } catch (error: any) {
      console.error('Lỗi khi lưu Note:', error);
      showToast({
        type: 'error',
        message: `Lưu Note thất bại. ${error.message}`,
      });
    }
  };

  return <>
    <MidiEditorContainer currentSong={currentSong} onNoteClick={handleStartEditNote} onSongUpdate={() => reload()} />

    <Modal
      isOpen={!!editingNote}
      onClose={handleCloseModal}
      title={editingNote ? (editingNote.id ? `Sửa Note: ${editingNote.title}` : 'Tạo Note') : `Quản Lý Notes cho: ${currentSong?.name || ''}`}
    >
      {currentSong && editingNote && <NoteEditForm
          currentSong={currentSong}
          // Gán các trường Note Entity vào NoteFormData (cần đảm bảo tương thích)
        initialNote={{
          songId: currentSong.id as string,
          trackId: editingNote.trackId as string,
          track: editingNote.track,
          time: editingNote.time,
          title: editingNote.title || '',
          description: editingNote.description || '',
          color: editingNote.color || '#007bff',
          icon: editingNote.icon || 'none',
        }}
        onSubmit={handleSaveNote}
        onCancel={() => setEditingNote(null)} // Quay lại danh sách
        buttonLabel='Lưu Note'
      />}
    </Modal>
  </>
};

export default MidiEditorManager;
