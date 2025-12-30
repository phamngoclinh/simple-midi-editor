import { useCallback } from 'react';
import { createNoteUseCase } from '../../../dependencies';
import { useStudioDispatch, useStudioState } from '../../../infrastructure/stores/studio';
import { toResult } from '../../utils/helper';
import { useUseCase } from '../useUseCase';
import NoteEntity from '../../../domain/note/noteEntity';
import { ValidationError } from '../../../application/shared/result';
import { useTranslations } from 'next-intl';

const useDuplicateNote = () => {
  const dispatch = useStudioDispatch();
  const state = useStudioState();
  const { call } = useUseCase();
  const t = useTranslations('Notification');

  const getAvailableDuplicatedNote = (noteId: string) => {
    const originalNote = state.notes[noteId];
    if (!originalNote) {
      throw new Error('Note not found');
    }

    let track = state.tracks[originalNote.trackId];
    if (!track) {
      throw new Error('Track not found');
    }

    const song = state.songs[track.songId];
    if (!song) {
      throw new Error('Song not found');
    }

    const otherTimes = Object.values(state.notes).filter((note) => note.trackId === originalNote.trackId).map((note) => note.time);
    let duplicatedTime = originalNote.time + 1;
    while (otherTimes.includes(duplicatedTime)) {
      duplicatedTime += 1;
    }
    if (duplicatedTime > song.totalDuration) {
      const duplicatedTrack = Object.values(state.tracks).find((track) => track.songId === song.id && track.id !== originalNote.trackId);
      if (!duplicatedTrack) {
        throw new Error('Track not found');
      }
      track = duplicatedTrack;
      duplicatedTime = originalNote.time;
    }

    const duplicateData = {
      songId: track.songId,
      trackId: track.id,
      title: `${originalNote.title} (Copy)`,
      description: originalNote.description,
      time: duplicatedTime,
      color: originalNote.color,
      icon: originalNote.icon,
    };

    return duplicateData;
  }

  const duplicateNote = useCallback(
    async (noteId: string) => {
      const duplicateData = getAvailableDuplicatedNote(noteId);

      const messages = {
        success: t('duplicateNoteSuccess'),
        error: t('duplicateNoteFailure'),
      };

      const response = await call(async () => await createNoteUseCase.execute(duplicateData), messages);

      if (!response.success) {
        return toResult.failure<NoteEntity, ValidationError>(response.errors);
      }

      dispatch({
        type: 'CREATE_NOTE',
        payload: response.data,
      });

      return toResult.success<NoteEntity>(response.data);
    },
    [state.notes, call, dispatch, t],
  );

  return {
    duplicateNote,
  };
};

export default useDuplicateNote;
