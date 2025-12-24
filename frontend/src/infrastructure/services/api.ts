import { BASE_API_URL } from './config';
import { CreateNoteDTO, CreateSongDTO, Note, Song, Track, UpdateNoteDTO, UpdateSongDTO } from './types';

export async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return true as T;
  }

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.message || `Lỗi HTTP: ${response.status}`;
    throw new Error(errorMessage);
  }

  return data.data as T;
}

const fetchData = async (path: string = '', method: string = 'GET', data?: any) => {
  try {
    const request: any = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    }
    if (data) request['body'] = JSON.stringify(data);
    return await fetch(`${BASE_API_URL}${path}`, request);
  } catch (e: any) {
    throw new Error('Server gặp sự cố hoặc lỗi đường truyền mạng.');
  }
}

export const fetchAllSongs = async (): Promise<Song[]> => {
  const response = await fetchData();
  return handleResponse<Song[]>(response);
};

export const fetchSongDetails = async (songId: string): Promise<Song> => {
  const response = await fetchData(`/${songId}`);
  return handleResponse<Song>(response);
};

export const createSong = async (songData: CreateSongDTO): Promise<Song> => {
  const response = await fetchData('', 'POST', songData);
  return handleResponse<Song>(response);
};

export const updateSong = async (songData: UpdateSongDTO): Promise<Song> => {
  const response = await fetchData(`/${songData.id}`, 'PUT', songData);
  return handleResponse<Song>(response);
};

export const deleteSong = async (songId: string): Promise<boolean> => {
  const response = await fetchData(`/${songId}`, 'DELETE');
  return handleResponse<boolean>(response);
};

export const updateTrackLabel = async (
  songId: string,
  trackId: string,
  newLabel: string
): Promise<Track> => {
  const response = await fetchData(`/${songId}/tracks/${trackId}/label`, 'PUT', { label: newLabel });
  return handleResponse<Track>(response);
};

export const createNote = async (
  songId: string,
  trackId: string,
  noteData: CreateNoteDTO
): Promise<Note> => {
  const response = await fetchData(`/${songId}/tracks/${trackId}/notes`, 'POST', noteData);
  return handleResponse<Note>(response);
};

export const createNoteOther = async (
  trackId: string,
  noteData: CreateNoteDTO
): Promise<Note> => {
  const response = await fetchData(`/${trackId}/notes`, 'POST', noteData);
  return handleResponse<Note>(response);
};

export const updateNote = async (
  noteId: string,
  noteData: UpdateNoteDTO
): Promise<Note> => {
  const response = await fetchData(`/notes/${noteId}`, 'PUT', noteData);
  return handleResponse<Note>(response);
};

export const deleteNote = async (noteId: string): Promise<boolean> => {
  const response = await fetchData(`/notes/${noteId}`, 'DELETE');
  return handleResponse<boolean>(response);
};

export const findNotesBySong = async (songId: string): Promise<Note[]> => {
  const response = await fetchData(`/${songId}/notes`);
  return handleResponse<Note[]>(response);
};