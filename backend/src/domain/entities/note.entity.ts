import { Track } from './track.entity';

export class Note {
  id: string;

  track: Track;

  time: number;

  title: string;

  description?: string;

  color: string;

  icon?: string; // Icon
}
