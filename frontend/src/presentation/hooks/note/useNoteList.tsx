import { useCallback, useMemo } from 'react';
import { useSongsState } from '../../../infrastructure/stores/studio';

const useNoteList = ({ noteIds, songId }: { noteIds?: string[]; songId?: string }) => {
  const { notes, select } = useSongsState();

  const allNotes = useMemo(() => {
    return Object.values(notes);
  }, [notes]);

  const notesByNoteIds = useMemo(() => {
    if (noteIds) return noteIds.map(id => notes[id]);
    return [];
  }, [notes, noteIds]);

  const lazyByNoteIds = useCallback(
    (noteIds: string[]) => {
      return noteIds.map(id => notes[id]);
    },
    [notes],
  );

  const notesBySongId = useMemo(() => {
    if (!songId) return [];
    return select(songId).notes;
  }, [select, songId]);

  const lazyBySongId = useCallback(
    (songId: string) => {
      return select(songId).notes;
    },
    [select],
  );

  return {
    allNotes,
    notesByNoteIds,
    lazyByNoteIds,
    notesBySongId,
    lazyBySongId,
  };
};

export default useNoteList;
