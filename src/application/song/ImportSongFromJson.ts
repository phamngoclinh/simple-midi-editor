import { ISongRepository } from '../../domain/repositories/ISongRepository';
import { Song } from '../../domain/entities/Song';
import { Track } from '../../domain/entities/Track'; // Giả định entity Track
import { Note } from '../../domain/entities/Note'; // Giả định entity Note
import { SongExportFormat } from './SongExportFormat.dto';

export class ImportSongFromJsonUseCase {
  private songRepository: ISongRepository;

  constructor(songRepository: ISongRepository) {
    this.songRepository = songRepository;
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

    if (!importData.name || !importData.tracks) {
      throw new Error("Thiếu các trường bắt buộc (name, tracks) trong dữ liệu nhập.");
    }

    // 2. Tái tạo cấu trúc Tracks và Notes

    // Khởi tạo các Track mới, sẵn sàng chứa Notes
    const newTracks: Track[] = importData.tracks.map(t => ({
      label: t.label,
      order: t.order,
      instrument: t.instrument,
      notes: [], // Khởi tạo mảng Notes rỗng
    }));

    // Phân phối Notes vào các Track tương ứng
    (importData.notes || []).forEach(noteData => {
      const targetTrack = newTracks.find(t => t.id === noteData.trackId);

      if (targetTrack) {
        // Tạo Note Entity mới
        const newNote: Note = {
          trackId: targetTrack.id, // Dùng ID của Track mới
          time: noteData.time,
          title: noteData.title,
          description: noteData.description,
          color: noteData.color
        };
        targetTrack.notes.push(newNote);
      } else {
        console.warn(`Note tham chiếu Track ID ${noteData.trackId} không tồn tại. Bỏ qua Note.`);
      }
    });

    // 3. Tạo Song Entity mới
    const newSong: Song = {
      name: importData.name,
      description: importData.description,
      totalDuration: importData.totalDuration,
      tracks: newTracks,
      createdTimestamp: new Date().toISOString(),
      updatedTimestamp: new Date().toISOString(),
      tags: []
    };

    // 4. Lưu Song mới vào Repository
    const savedSong = await this.songRepository.save(newSong);

    return savedSong;
  }
}