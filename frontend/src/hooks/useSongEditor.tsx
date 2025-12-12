import { useState } from 'react';
import { useModal } from '../contexts/ModalContext';
import {
  createNewSongUseCase,
  deleteSongUseCase,
  editSongUseCase
} from '../dependencies';
import { Song } from '../domain/entities/Song';
import { Track } from '../domain/entities/Track';

interface SongFormData {
  name: string;
  description: string;
  totalDuration: number;
  tracks: Track[];
  tags: string[];
}

export default function useSongEditor(onAfterChange?: () => Promise<void>) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const startEditSong = (song: Song | null) => setEditingSong(song);

  const { showConfirmation, showToast } = useModal();

  const createSong = async (data: SongFormData) => {
    const createData = {
      name: data.name,
      description: data.description,
      totalDuration: data.totalDuration,
      tracks: data.tracks,
      tags: data.tags
    };
    const newSong = await createNewSongUseCase.execute(createData);
    if (onAfterChange) await onAfterChange();
    return newSong;
  };

  const editSong = async (songId: string, data: SongFormData) => {
    const updateData = {
      id: songId,
      name: data.name,
      description: data.description,
      totalDuration: data.totalDuration,
      tracks: data.tracks,
      tags: data.tags,
    };
    const updated = await editSongUseCase.execute(updateData);
    if (onAfterChange) await onAfterChange();
    setEditingSong(null);
    showToast({
      type: 'success',
      message: 'Cập nhật Song thành công'
    })
    return updated;
  };

  const deleteSong = async (songId: string, songName: string) => {
    const confirmed = await showConfirmation({
      message: `Bạn có chắc chắn muốn xóa bài hát "${songName}" không?`,
      title: "Xác nhận Xóa",
      confirmButtonLabel: "XÓA VĨNH VIỄN",
    });
    if (confirmed) {
      await deleteSongUseCase.execute(songId);
      if (onAfterChange) await onAfterChange();
    }
  };

  const resetEditor = () => {
    setIsCreateModalOpen(false);
    setEditingSong(null);
  };

  return {
    isCreateModalOpen,
    openCreateModal,
    editingSong,
    startEditSong,
    createSong,
    editSong,
    deleteSong,
    resetEditor,
  };
}