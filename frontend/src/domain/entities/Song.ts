import { Track } from "./Track";

export interface Song {
  id?: string;

  name: string;

  description?: string;

  totalDuration: number;

  tags: string[];

  tracks: Track[];

  createdTimestamp?: string;

  updatedTimestamp?: string;
}