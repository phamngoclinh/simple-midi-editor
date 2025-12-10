import { Song } from '../../domain/entities/Song';
import { SongExportFormat } from './export/SongExportFormat';

export class ExportSongToJsonUseCase {
  /**
   * Chuyển đổi một Song Entity thành chuỗi JSON ở định dạng chuẩn.
   * @param song Entity Song cần Export.
   * @returns Chuỗi JSON.
   */
  execute(song: Song): string {
    if (!song || !song.id) {
      throw new Error("Không thể export Song không hợp lệ.");
    }

    const exportNotes: SongExportFormat['notes'] = [];

    // Thu thập và làm phẳng tất cả Notes từ tất cả Tracks
    song.tracks.forEach((track, index) => {
      (track.notes || []).forEach(note => {
        exportNotes.push({
          track: index + 1,
          time: note.time,
          title: note.title,
          description: note.description,
          color: note.color,
        });
      });
    });

    // Tạo đối tượng Export chính
    const exportData: SongExportFormat = {
      name: song.name,
      description: song.description,
      totalDuration: song.totalDuration || 60, // Giả định thời lượng
      tracks: song.tracks.map(t => t.label),
      notes: exportNotes,
    };

    // Chuyển đối tượng thành chuỗi JSON
    return JSON.stringify(exportData, null, 2); // null, 2 để định dạng JSON dễ đọc
  }
}