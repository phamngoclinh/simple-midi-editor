import { BASE_API_URL } from '../config/api';
import { CreateNoteDTO, CreateSongDTO, Note, Song, Track, UpdateNoteDTO, UpdateSongDTO } from '../types/api';

export async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.message || `Lỗi HTTP: ${response.status}`;
    throw new Error(errorMessage);
  }

  return data.data as T;
}

export const fetchAllSongs = async (): Promise<Song[]> => {
  const response = await fetch(BASE_API_URL);
  return handleResponse<Song[]>(response);
};

export const fetchSongDetails = async (songId: string): Promise<Song> => {
  const response = await fetch(`${BASE_API_URL}/${songId}`);
  return handleResponse<Song>(response);
};

export const createSong = async (songData: CreateSongDTO): Promise<Song> => {
  const response = await fetch(BASE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(songData),
  });
  return handleResponse<Song>(response);
};

export const updateSong = async (songData: UpdateSongDTO): Promise<Song> => {
  const response = await fetch(`${BASE_API_URL}/${songData.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(songData),
  });
  return handleResponse<Song>(response);
};

export const deleteSong = async (songId: string): Promise<void> => {
  const response = await fetch(`${BASE_API_URL}/${songId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {

    const errorBody = await response.json();
    throw new Error(errorBody.message || `Lỗi xóa Song: ${response.status}`);
  }
  return;
};

export const updateTrackLabel = async (
  songId: string,
  trackId: string,
  newLabel: string
): Promise<Track> => {
  const response = await fetch(`${BASE_API_URL}/${songId}/tracks/${trackId}/label`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ label: newLabel }),
  });
  return handleResponse<Track>(response);
};

export const createNote = async (
  songId: string,
  trackId: string,
  noteData: CreateNoteDTO
): Promise<Note> => {
  const response = await fetch(`${BASE_API_URL}/${songId}/tracks/${trackId}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(noteData),
  });
  return handleResponse<Note>(response);
};

export const updateNote = async (
  noteId: string,
  noteData: UpdateNoteDTO
): Promise<Note> => {
  const response = await fetch(`${BASE_API_URL}/notes/${noteId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(noteData),
  });
  return handleResponse<Note>(response);
};

export const deleteNote = async (noteId: string): Promise<void> => {
  const response = await fetch(`${BASE_API_URL}/notes/${noteId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Lỗi xóa Note: ${response.status}`);
  }
  return;
};

export const findNotesBySong = async (songId: string): Promise<Note[]> => {
  const response = await fetch(`${BASE_API_URL}/${songId}/notes`);
  return handleResponse<Note[]>(response);
};