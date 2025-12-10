import { Song } from '../../domain/entities/Song';
import { SongExportFormat } from './SongExportFormat.dto';

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
    song.tracks.forEach(track => {
      (track.notes || []).forEach(note => {
        exportNotes.push({
          trackId: track.id as string,
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

      // Export chỉ các metadata của Tracks
      tracks: song.tracks.map(t => ({
        id: t.id as string,
        label: t.label,
        order: t.order,
        instrument: t.instrument || 'synth',
      })),

      notes: exportNotes,
    };

    // Chuyển đối tượng thành chuỗi JSON
    return JSON.stringify(exportData, null, 2); // null, 2 để định dạng JSON dễ đọc
  }
}