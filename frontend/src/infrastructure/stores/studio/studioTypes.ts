import NoteEntity from '../../../domain/note/noteEntity';
import SongEntity from '../../../domain/song/songEntity';
import TrackEntity from '../../../domain/track/trackEntity';

export interface SongChangePayload {
  song: SongEntity,
  tracks: TrackEntity[];
  notes: NoteEntity[];
}

export interface NoteChangePayload extends NoteEntity {
  // songId: string;
  trackId: string;
}

export type StudioModalType =
  | 'CREATE_SONG'
  | 'UPDATE_SONG'
  | 'DELETE_SONG'
  | 'CREATE_NOTE'
  | 'DELETE_NOTE'
  | 'UPDATE_NOTE'
  | 'VIEW_NOTES'

export type StudioModalPayloadMap = {
  CREATE_SONG: {},
  UPDATE_SONG: { songId: string },
  DELETE_SONG: { songId: string; },
  CREATE_NOTE: { songId: string, trackId: string; }
  UPDATE_NOTE: { noteId: string; },
  DELETE_NOTE: { nodeId: string; },
  VIEW_NOTES: { songId: string; trackId?: string; },
}

export type StudioModalPayload<T extends StudioModalType> = StudioModalPayloadMap[T];

export type StudioModalPayloadWrapper<T extends StudioModalType> = {
  type: T;
  data: StudioModalPayload<T>;
};

export interface StudioState {
  songs: Record<string, SongEntity>;
  tracks: Record<string, TrackEntity>;
  notes: Record<string, NoteEntity>;
  uiState: {
    error?: string,
    isLoadingSong: boolean,
    isLoadingSongs: boolean,
    modal?: StudioModalPayloadWrapper<StudioModalType>
  }
}

export type StudioAction =
  | { type: 'ADD_DRAFT', payload: { songId: string } }
  | { type: 'REMOVE_DRAFT' }
  | { type: 'CREATE_SONGS', payload: SongChangePayload[] }
  | { type: 'CREATE_SONG', payload: SongChangePayload }
  | { type: 'UPDATE_SONG', payload: SongChangePayload }
  | { type: 'DELETE_SONG', payload: { songId: string } }
  | { type: 'LOADED_SONG' }
  | { type: 'LOADED_SONGS' }
  | { type: 'LOADING_SONG' }
  | { type: 'LOADING_SONGS' }
  | { type: 'CREATE_NOTE', payload: NoteChangePayload }
  | { type: 'UPDATE_NOTE', payload: NoteChangePayload }
  | { type: 'DELETE_NOTE', payload: { noteId: string } }
  | { type: 'OPEN_VIEW_NOTES_MODAL' }
  | { type: 'CLOSE_VIEW_NOTES_MODAL' }
  | { type: 'OPEN_MODAL', payload: StudioModalPayloadWrapper<StudioModalType> }
  | { type: 'CLOSE_MODAL', payload: { type: StudioModalType } }