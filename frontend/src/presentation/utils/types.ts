export interface ChildFormHandles {
  submitForm: () => void;
}

export interface ApplicationResult<T> {
  success: boolean;
  data: T | null;
  error?: any;
}

export interface SongFormData {
  id: string;

  name: string;

  description?: string;

  totalDuration: number;

  tracks: {
    id: string;

    songId: string;

    order: number;

    label: string;

    instrument?: string;

    notes?: {
      id: string;

      songId: string;

      trackId: string;

      time: number;

      title: string;

      description?: string;

      color: string;

      icon?: string;
    }[];
  }[];

  tags: string[];
}

export interface NoteFormData {
  id: string;

  songId: string;

  trackId: string;

  time: number;

  title: string;

  description?: string;

  color: string;

  icon?: string;

  tracks: {
    id: string;

    order: number;

    label: string;
  }[];

  maxTime: number;
}
