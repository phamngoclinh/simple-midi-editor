import NoteEntity from '../../../domain/note/noteEntity';
import SongEntity from '../../../domain/song/songEntity';
import TrackEntity from '../../../domain/track/trackEntity';
import { StudioAction, StudioState } from './studioTypes';

const studioReducer = (state: StudioState, action: StudioAction): StudioState => {
  switch (action.type) {

    case 'CREATE_SONGS': {
      const newSongs = action.payload
        .map(res => res.song)
        .reduce((acc: Record<string, SongEntity>, cur) => {
          acc[cur.id] = cur;
          return acc;
        }, {});
      const newTracks = action.payload
        .flatMap(res => res.tracks)
        .reduce((acc: Record<string, TrackEntity>, cur) => {
          acc[cur.id] = cur;
          return acc;
        }, {});
      const newNotes = action.payload
        .flatMap(res => res.notes)
        .reduce((acc: Record<string, NoteEntity>, cur) => {
          acc[cur.id] = cur;
          return acc;
        }, {});

      return {
        ...state,
        songs: { ...state.songs, ...newSongs },
        tracks: { ...state.tracks, ...newTracks },
        notes: { ...state.notes, ...newNotes },
      };
    }

    case 'CREATE_SONG':
    case 'UPDATE_SONG': {
      const newSongs = {
        ...state.songs,
        [action.payload.song.id]: action.payload.song
      };
      const newTracks = {
        ...state.tracks,
        ...action.payload.tracks.reduce((acc: Record<string, TrackEntity>, cur) => {
          acc[cur.id] = cur;
          return acc;
        }, {})
      };
      const newNotes = {
        ...state.notes,
        ...action.payload.notes.reduce((acc: Record<string, NoteEntity>, cur) => {
          acc[cur.id] = cur;
          return acc;
        }, {})
      };
      // Tìm track bị xoá
      const songTracks = Object.values(state.tracks).filter(t => t.songId === action.payload.song.id);
      const newTrackIds = action.payload.tracks.map(t => t.id);
      const removedTracks = songTracks.filter(t => newTrackIds.every(id => id !== t.id));
      if (removedTracks.length) {
        // Phát hiện track bị xoá
        removedTracks.forEach(removedTrack => {
          delete newTracks[removedTrack.id];
          // Xoá Notes
          const removedNotes = Object.values(state.notes).filter(n => n.trackId === removedTrack.id);
          if (removedNotes.length) {
            removedNotes.forEach(removedNote => {
              delete newNotes[removedNote.id];
            });
          }
        });
      }
      return { ...state, songs: newSongs, tracks: newTracks, notes: newNotes };
    }

    case 'DELETE_SONG': {
      const songIdToRemove = action.payload.songId;
      const { [songIdToRemove]: removedSongId, ...newSongs } = state.songs;
      const newTracks = { ...state.tracks };
      const tracksToRemove = Object.values(state.tracks).filter(t => t.songId === songIdToRemove);
      tracksToRemove.forEach((track) => delete newTracks[track.id]);
      const newNotes = { ...state.notes };
      const notesToRemove = Object.values(state.notes).filter(n => tracksToRemove.some(t => t.id === n.trackId));
      notesToRemove.forEach((note) => delete newTracks[note.id]);
      return { ...state, songs: newSongs, tracks: newTracks, notes: newNotes };
    }

    case 'LOADING_SONGS': {
      return { ...state, uiState: { ...state.uiState, isLoadingSongs: true } };
    }

    case 'LOADED_SONGS': {
      return { ...state, uiState: { ...state.uiState, isLoadingSongs: false } };
    }

    case 'LOADING_SONG': {
      return { ...state, uiState: { ...state.uiState, isLoadingSong: true } };
    }

    case 'LOADED_SONG': {
      return { ...state, uiState: { ...state.uiState, isLoadingSong: false } };
    }

    case 'CREATE_NOTE':
    case 'UPDATE_NOTE': {
      const { ...newNote } = action.payload
      return {
        ...state,
        notes: { ...state.notes, [newNote.id]: newNote },
      };
    }

    case 'DELETE_NOTE': {
      const noteIdToRemove = action.payload.noteId;
      const { [noteIdToRemove]: removedNoteId, ...newNotes } = state.notes;
      return {
        ...state,
        notes: newNotes,
      };
    }

    case 'OPEN_MODAL': {
      return { ...state, uiState: { ...state.uiState, modal: action.payload } };
    }

    case 'CLOSE_MODAL': {
      return { ...state, uiState: { ...state.uiState, modal: undefined } };
    }

    default:
      return state;
  }
}

export default studioReducer;