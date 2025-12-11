import { Track } from './track.entity';

export class Song {
  id: string;

  name: string;

  description?: string;

  totalDuration: number;

  tags?: string[];

  // Time Signature
  createdTimestamp: Date;

  updatedTimestamp: Date;

  // Mối quan hệ một-nhiều với Tracks
  tracks: Track[];
}
