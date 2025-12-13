import { Note } from './Note'; // Cần import Entity Note

export interface Track {
  id?: string;

  songId?: string;

  order: number;

  label: string;

  instrument: string;

  notes: Note[];
}