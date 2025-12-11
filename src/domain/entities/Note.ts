// src/domain/entities/Note.ts

/**
 * Thể hiện một sự kiện Note On/Off (một nốt nhạc) trong Track.
 */
export interface Note {
  /** ID duy nhất của Note. */
  id?: string;

  /** ID của Song mà Note này thuộc về (Dùng cho Repository/Lưu trữ). */
  songId?: string;

  /** ID của Track mà Note này thuộc về (Dùng cho Repository/Lưu trữ). */
  trackId?: string;

  track: number;

  /** Thời gian bắt đầu của nốt (tính bằng tick, milliseconds, hoặc đơn vị thời gian khác). */
  time: number;

  /** Tên hoặc tiêu đề của sự kiện (theo yêu cầu của bạn). */
  title: string;

  /** Mô tả chi tiết (theo yêu cầu của bạn). */
  description?: string;

  /** Màu sắc hiển thị (theo yêu cầu của bạn). */
  color: string;

  /** Icon hiển thị (theo yêu cầu của bạn). */
  icon?: string;
}