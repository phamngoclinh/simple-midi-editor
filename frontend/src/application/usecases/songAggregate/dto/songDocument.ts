interface SongDocument {
  name: string;

  description?: string;

  totalDuration: number;

  trackLabels: string[];

  notes: {

    track: number;

    time: number;

    title: string;

    description?: string;

    color: string;

    icon?: string;

  }[];

  tags?: string[]
}

export default SongDocument;