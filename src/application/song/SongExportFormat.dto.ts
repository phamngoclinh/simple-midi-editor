export interface SongExportFormat {
  name: string;
  description?: string;
  totalDuration: number;
  // Tracks hoàn chỉnh (dễ dàng tái tạo lại)
  tracks: {
    id: string; // ID cũ hoặc mới
    label: string;
    order: number;
    instrument: string;
  }[];
  notes: {
    // Sử dụng Track ID (hoặc order) để tham chiếu
    trackId: string;
    time: number;
    title: string;
    description?: string;
    color: string;
  }[];
}