import { ISongRepository } from '../../domain/repositories/ISongRepository';
import { Song } from '../../domain/entities/Song';
import { Track } from '../../domain/entities/Track'; // Giả định entity Track
import { Note } from '../../domain/entities/Note'; // Giả định entity Note
import { SongExportFormat } from './export/SongExportFormat';

export class ImportSongFromJsonUseCase {
  private songRepository: ISongRepository; // Cần thiết để cập nhật Track

  constructor(songRepository: ISongRepository) {
    this.songRepository = songRepository;
  }

  async execute(jsonString: string): Promise<Song> {
    let importData: SongExportFormat;

    try {
      importData = JSON.parse(jsonString);
    } catch (e) {
      throw new Error("Dữ liệu JSON không hợp lệ.");
    }

    if (!importData.name || !importData.trackLabels) {
      throw new Error("Thiếu các trường bắt buộc (name, tracks) trong dữ liệu nhập.");
    }

    const newSong: Song = {
      name: importData.name,
      description: importData.description,
      totalDuration: importData.totalDuration,
      tracks: [],
      createdTimestamp: new Date().toISOString(),
      updatedTimestamp: new Date().toISOString(),
      tags: importData.tags
    };

    const newTracks: Track[] = importData.trackLabels.map((t, i) => ({
      label: t,
      order: i + 1,
      instrument: 'Default Instrument',
      notes: [],
    }));

    const notes = importData.notes || [];
    for (const noteData of notes) {
      const targetTrack = newTracks[noteData.track - 1];
      if (targetTrack) {
        const newNote = {
          time: noteData.time,
          title: noteData.title,
          description: noteData.description,
          color: noteData.color,
          icon: noteData.icon
        } as Note;
        targetTrack.notes.push(newNote);
      } else {
        console.warn(`Note tham chiếu Track ${noteData.track} không tồn tại. Bỏ qua Note.`);
      }
    }

    newSong.tracks = newTracks;

    return this.songRepository.create(newSong);
  }
}