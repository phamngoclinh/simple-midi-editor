import { useState } from 'react';
import { Song } from '../domain/entities/Song';
import { Track } from '../domain/entities/Track';
import {
  createNewSongUseCase,
  editSongUseCase,
  deleteSongUseCase
} from '../dependencies';

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
    return updated;
  };

  const deleteSong = async (songId: string, songName: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài hát "${songName}" không?`)) return;
    await deleteSongUseCase.execute(songId);
    if (onAfterChange) await onAfterChange();
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