import { Note } from './note.entity';
import { Song } from './song.entity';

export class Track {
  id: string;

  song: Song; // Tham chiếu đến Song mẹ

  label: string;

  order: number; // Thứ tự Track trong Song

  instrument: string;

  notes: Note[]; // Mối quan hệ một-nhiều với Notes
}
