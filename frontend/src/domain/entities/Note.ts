export interface Note {
  id?: string;

  songId?: string;

  trackId?: string;

  track: number;

  time: number;

  title: string;

  description?: string;

  color: string;

  icon?: string;
}