import { ISongRepository } from '../../domain/repositories/ISongRepository';
import { Song } from '../../domain/entities/Song'; // Giả định

export interface EditTrackLabelData {
  /** ID của Song chứa Track cần chỉnh sửa. */
  songId: string;
  /** ID của Track cần chỉnh sửa. */
  trackId: string;
  /** Nhãn mới cho Track. */
  newLabel: string;
}

/**
 * Lớp Use Case: Chỉnh sửa nhãn (label) của một Track cụ thể trong một Song.
 */
export class EditTrackLabelUseCase {
  private songRepository: ISongRepository;

  constructor(songRepository: ISongRepository) {
    this.songRepository = songRepository;
  }

  /**
   * Thực thi Use Case để cập nhật nhãn Track.
   * @param data Dữ liệu chứa songId, trackId và newLabel.
   * @returns Promise trả về Song đã được cập nhật.
   * @throws Error nếu Song hoặc Track không tồn tại, hoặc nhãn mới không hợp lệ.
   */
  async execute(data: EditTrackLabelData): Promise<Song> {
    const { songId, trackId, newLabel } = data;

    // 1. Validation (Kiểm tra cơ bản)
    if (!songId || !trackId || !newLabel.trim()) {
      throw new Error("Dữ liệu đầu vào (songId, trackId, newLabel) không hợp lệ.");
    }

    const trimmedLabel = newLabel.trim();

    // 2. Tải Song hiện tại từ Repository
    const song = await this.songRepository.findById(songId);

    if (!song) {
      throw new Error(`Song với ID '${songId}' không tồn tại.`);
    }

    // 3. Tìm Track cần chỉnh sửa
    const trackIndex = song.tracks.findIndex(t => t.id === trackId);

    if (trackIndex === -1) {
      throw new Error(`Track với ID '${trackId}' không tồn tại trong Song.`);
    }

    // 4. Cập nhật nhãn Track
    // Tạo một bản sao của mảng tracks để đảm bảo tính bất biến (Immutability)
    const updatedTracks = [...song.tracks];

    // Tạo một bản sao của track để thay đổi
    updatedTracks[trackIndex] = {
      ...updatedTracks[trackIndex],
      label: trimmedLabel, // Áp dụng nhãn mới
      // Giữ nguyên các trường khác như order, instrument, notes, v.v.
    };

    // Tạo một bản sao của Song với mảng tracks đã được cập nhật
    const updatedSong: Song = {
      ...song,
      tracks: updatedTracks,
      // Cập nhật timestamp (nếu có)
      updatedTimestamp: new Date().toISOString(),
    };

    // 5. Lưu Song đã được cập nhật vào Repository
    const savedSong = await this.songRepository.save(updatedSong);

    return savedSong;
  }
}