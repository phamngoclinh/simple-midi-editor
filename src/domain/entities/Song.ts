// src/domain/entities/Song.ts
// import { Note } from "./Note";
import { Track } from "./Track";

/**
 * Thể hiện một dự án/bản nhạc MIDI hoàn chỉnh.
 */
export interface Song {
  /** ID duy nhất của Song, được tạo khi lưu trữ (Infrastructure Layer). */
  id?: string;

  /** Tên của bản nhạc. */
  name: string;

  /** Mô tả chi tiết bản nhạc. */
  description?: string;

  /** Tổng thời lượng của bản nhạc, có thể tính bằng giây hoặc tick/đơn vị thời gian MIDI. */
  totalDuration: number;

  /** Danh sách các thẻ (tags) giúp phân loại và tìm kiếm. */
  tags: string[];

  tracks: Track[];

  /** Tập hợp các Track tạo nên bản nhạc. */
  // trackLabels: string[];

  /** Timestamp tạo bản nhạc (ISO string). */
  createdTimestamp?: string;

  /** Timestamp cập nhật cuối cùng (ISO string). */
  updatedTimestamp?: string;
}