import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';
export interface NoteData {
  songId: string;
  trackId: string;
  track: number;
  time: number;
  title: string;
  description: string;
  color: string;
  icon?: string;
}

export class AddNoteToSong {
  private noteRepository: INoteRepository;

  constructor(noteRepository: INoteRepository) {
    this.noteRepository = noteRepository;
  }

  async execute(data: NoteData): Promise<Note> {
    return this.noteRepository.create(data.songId, data.trackId, {
      time: data.time,
      title: data.title,
      description: data.description,
      color: data.color,
      icon: data.icon
    });
  }
}