import { ISongRepository } from '../../domain/repositories/ISongRepository';
import { Song } from '../../domain/entities/Song';
import { Track } from '../../domain/entities/Track'; // Giả định entity Track
import { Note } from '../../domain/entities/Note'; // Giả định entity Note
import { SongExportFormat } from './export/SongExportFormat';
import { INoteRepository } from '../../domain/repositories/INoteRepository';

export class ImportSongFromJsonUseCase {
  private songRepository: ISongRepository; // Cần thiết để cập nhật Track
  private noteRepository: INoteRepository;

  constructor(songRepository: ISongRepository, noteRepository: INoteRepository) {
    this.songRepository = songRepository;
    this.noteRepository = noteRepository;
  }

  /**
   * Nhận chuỗi JSON, chuyển đổi và lưu thành Song Entity mới.
   * @param jsonString Chuỗi JSON nhập vào.
   * @returns Promise trả về Song Entity đã được tạo và lưu.
   */
  async execute(jsonString: string): Promise<Song> {
    let importData: SongExportFormat;

    // 1. Phân tích chuỗi JSON
    try {
      importData = JSON.parse(jsonString);
    } catch (e) {
      throw new Error("Dữ liệu JSON không hợp lệ.");
    }

    if (!importData.name || !importData.trackLabels) {
      throw new Error("Thiếu các trường bắt buộc (name, tracks) trong dữ liệu nhập.");
    }

    const newSong: Song = {
      name: importData.name,
      description: importData.description,
      totalDuration: importData.totalDuration,
      tracks: [],
      createdTimestamp: new Date().toISOString(),
      updatedTimestamp: new Date().toISOString(),
      tags: []
    };

    await this.songRepository.save(newSong);

    // 2. Tái tạo cấu trúc Tracks và Notes

    // Khởi tạo các Track mới, sẵn sàng chứa Notes
    const newTracks: Track[] = importData.trackLabels.map((t, i) => ({
      id: (i + 1).toString(),
      label: t,
      order: i + 1,
      instrument: 'Default Instrument',
      notes: [], // Khởi tạo mảng Notes rỗng
    }));

    // Phân phối Notes vào các Track tương ứng
    const notes = importData.notes || [];
    for (const noteData of notes) {
      const targetTrack = newTracks[noteData.track - 1];
      if (targetTrack) {
        // Tạo Note Entity mới
        const newNote: Note = {
          songId: newSong.id,
          trackId: targetTrack.id,
          track: noteData.track,
          time: noteData.time,
          title: noteData.title,
          description: noteData.description,
          color: noteData.color
        };
        const savedNote = await this.noteRepository.save(newNote);
        targetTrack.notes.push(savedNote);
      } else {
        console.warn(`Note tham chiếu Track ${noteData.track} không tồn tại. Bỏ qua Note.`);
      }
    }

    // 3. Tạo Song Entity mới
    newSong.tracks = newTracks;

    // 4. Lưu Song mới vào Repository
    await this.songRepository.save(newSong);

    return newSong;
  }
}