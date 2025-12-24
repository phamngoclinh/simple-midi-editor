export interface ApiResponse<T> {
  statusCode: number;
  timestamp: string;
  data: T;
}

export interface Track {
  id: string;
  label: string;
  order: number;
  instrument: string;
  notes: Note[];
}

export interface Song {
  id: string;
  name: string;
  description?: string;
  totalDuration: number;
  tags: string[];
  tracks: Track[];
  createdTimestamp: string;
  updatedTimestamp: string;
}

export interface Note {
  id: string;
  track: Track;
  time: number;
  title: string;
  description?: string;
  color: string;
  icon?: string;
}

export interface CreateSongDTO {
  name: string;
  description?: string;
  totalDuration: number;
  tags?: string[];
  tracks: Array<{ label: string; order: number; instrument?: string }>;
}

export interface UpdateTrackDto {
  id: string;
  label?: string;
  order?: number;
  instrument?: string
}

export interface UpdateSongDTO extends Partial<Omit<CreateSongDTO, 'tracks'>> {
  id: string
  tracks?: Array<UpdateTrackDto>;
}

export interface UpdateNoteDTO extends Partial<Omit<Note, 'id' | 'track'>> { }

export interface CreateNoteDTO extends Omit<Note, 'id' | 'track'> { }