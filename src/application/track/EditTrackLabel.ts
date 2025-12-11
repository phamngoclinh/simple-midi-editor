import { ISongRepository } from '../../domain/repositories/ISongRepository';
import { Track } from '../../domain/entities/Track';

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
  async execute(data: EditTrackLabelData): Promise<Track> {
    const { songId, trackId, newLabel } = data;

    // 1. Validation (Kiểm tra cơ bản)
    if (!songId || !trackId || !newLabel.trim()) {
      throw new Error("Dữ liệu đầu vào (songId, trackId, newLabel) không hợp lệ.");
    }

    const trimmedLabel = newLabel.trim();

    return this.songRepository.updateTrackLabel(songId, trackId, trimmedLabel);
  }
}