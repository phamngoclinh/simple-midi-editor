import { useState, useMemo, useEffect } from 'react';
import { useSongsState } from '../../../infrastructure/stores/studio';
import useStudioAction from '../store/useStudioAction';
import useDeleteNote from './useDeleteNote';

interface UseEventListProps {
  songId: string;
}

export type SortField = 'startTime' | 'pitch' | 'velocity' | 'trackName';

const useEventList = ({ songId }: UseEventListProps) => {
  const { select } = useSongsState();
  const { deleteNote } = useDeleteNote();
  const { openCreateNoteFormModal } = useStudioAction();

  const songData = useMemo(() => select(songId), [select, songId]);
  const { song, tracks, notes } = songData;

  const [sortBy, setSortBy] = useState<SortField>('startTime');
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 100]); // percentage
  const [visibleTrackIds, setVisibleTrackIds] = useState<string[]>([]);

  useEffect(() => {
    if (tracks.length > 0 && visibleTrackIds.length === 0) {
      setVisibleTrackIds(tracks.map(t => t.id));
    }
  }, [tracks, visibleTrackIds.length]);

  const filteredNotes = useMemo(() => {
    let result = [...notes];

    // Filter by track visibility
    result = result.filter(note => visibleTrackIds.includes(note.trackId));

    // Filter by time range
    const totalTime = song?.totalDuration || 1;
    const startTimeLimit = (timeRange[0] / 100) * totalTime;
    const endTimeLimit = (timeRange[1] / 100) * totalTime;
    result = result.filter(note => note.time >= startTimeLimit && note.time <= endTimeLimit);

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'startTime':
          return a.time - b.time;
        case 'pitch':
          // Simplified: use title for pitch-like sorting
          return a.title.localeCompare(b.title);
        case 'velocity':
          return 0; // No velocity field yet
        case 'trackName':
          const trackA = tracks.find(t => t.id === a.trackId)?.label || '';
          const trackB = tracks.find(t => t.id === b.trackId)?.label || '';
          return trackA.localeCompare(trackB);
        default:
          return 0;
      }
    });

    return result;
  }, [notes, visibleTrackIds, timeRange, sortBy, song, tracks]);

  const toggleTrackVisibility = (trackId: string) => {
    setVisibleTrackIds(prev =>
      prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]
    );
  };

  const selectAllTracks = () => {
    setVisibleTrackIds(tracks.map(t => t.id));
  };

  const handleAddNote = () => {
    if (tracks.length > 0) {
      openCreateNoteFormModal(songId);
    }
  };

  return {
    song,
    tracks,
    notes: filteredNotes,
    totalCount: notes.length,
    sortBy,
    setSortBy,
    timeRange,
    setTimeRange,
    visibleTrackIds,
    toggleTrackVisibility,
    selectAllTracks,
    deleteNote,
    handleAddNote,
  };
};

export default useEventList;
