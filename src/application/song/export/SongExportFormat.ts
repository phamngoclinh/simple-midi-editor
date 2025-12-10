export interface SongExportFormat {
  name: string;
  description?: string;
  totalDuration: number;
  // Tracks hoàn chỉnh (dễ dàng tái tạo lại)
  tracks: string[];
  notes: {
    // Sử dụng Track ID (hoặc order) để tham chiếu
    // trackId: string;
    track: number;
    time: number;
    title: string;
    description?: string;
    color: string;
  }[];
}