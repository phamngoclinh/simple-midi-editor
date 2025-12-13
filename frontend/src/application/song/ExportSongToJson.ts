import { Song } from '../../domain/entities/Song';
import { SongExportFormat } from './export/SongExportFormat';

export class ExportSongToJsonUseCase {
  execute(song: Song): string {
    if (!song || !song.id) {
      throw new Error("Không thể export Song không hợp lệ.");
    }

    const exportNotes: SongExportFormat['notes'] = [];

    song.tracks.forEach((track, index) => {
      (track.notes || []).forEach(note => {
        exportNotes.push({
          track: index + 1,
          time: note.time,
          title: note.title,
          description: note.description,
          color: note.color,
          icon: note.icon
        });
      });
    });

    const exportData: SongExportFormat = {
      name: song.name,
      description: song.description,
      totalDuration: song.totalDuration || 60,
      trackLabels: song.tracks.map(t => t.label),
      notes: exportNotes,
      tags: song.tags
    };

    return JSON.stringify(exportData, null, 2);
  }
}