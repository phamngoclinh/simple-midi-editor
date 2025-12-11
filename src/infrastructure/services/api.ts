
import { BASE_API_URL } from '../config/api';
import { CreateNoteDTO, CreateSongDTO, Note, Song, Track, UpdateNoteDTO, UpdateSongDTO } from '../types/api';

// ===============================================
//         A. SONG CRUD API CALLS
// ===============================================

export async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  // Nếu mã trạng thái là lỗi (>= 400), ném ra lỗi với message từ backend
  if (!response.ok) {
    // Backend trả về lỗi JSON chuẩn hóa
    const errorMessage = data.message || `Lỗi HTTP: ${response.status}`;
    throw new Error(errorMessage);
  }

  // Nếu thành công, trả về dữ liệu nằm trong trường 'data'
  return data.data as T;
}

/**
 * Lấy tất cả Songs (chỉ metadata cơ bản và Tracks).
 */
export const fetchAllSongs = async (): Promise<Song[]> => {
  const response = await fetch(BASE_API_URL);
  return handleResponse<Song[]>(response);
};

/**
 * Lấy chi tiết một Song (bao gồm tất cả Tracks và Notes).
 */
export const fetchSongDetails = async (songId: string): Promise<Song> => {
  const response = await fetch(`${BASE_API_URL}/${songId}`);
  return handleResponse<Song>(response);
};

/**
 * Tạo một Song mới.
 */
export const createSong = async (songData: CreateSongDTO): Promise<Song> => {
  console.log('api create song', songData)
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
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(songData),
  });
  return handleResponse<Song>(response);
};

/**
 * Xóa một Song.
 */
export const deleteSong = async (songId: string): Promise<void> => {
  const response = await fetch(`${BASE_API_URL}/${songId}`, {
    method: 'DELETE',
  });
  // DELETE trả về 204 No Content, không có body.
  if (!response.ok) {
    // Nếu DELETE thất bại (ví dụ: 404), vẫn cần đọc body để lấy message lỗi
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Lỗi xóa Song: ${response.status}`);
  }
  return; // Thành công
};

// ===============================================
//         B. TRACK/NOTE CRUD API CALLS
// ===============================================

/**
 * Cập nhật nhãn của một Track.
 */
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

/**
 * Tạo một Note mới.
 */
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

/**
 * Cập nhật một Note.
 */
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

/**
 * Xóa một Note.
 */
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